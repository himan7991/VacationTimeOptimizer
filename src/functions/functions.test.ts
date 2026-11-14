import { describe, expect, it } from 'vitest'
import {
	addDays,
	clampWindowStart,
	countHolidays,
	countWeekends,
	dayNumber,
	daysInMonth,
	daysIntoYear,
	formatPublicHolidays,
	getDaysInYear,
	getPlanningWindow,
	getWeekends,
	getYearsCovered,
	MAX_WINDOW_SHIFT_MONTHS,
	monthsBetween,
	parseIsoDate,
	shiftYearMonth,
	WINDOW_END_LOOKAHEAD_DAYS
} from './functions'
import { PublicHoliday } from '../types/PublicHoliday'

const TODAY = new Date(2026, 10, 14, 12) // Saturday 14 November 2026, midday

const holiday = (date: string, name: string): PublicHoliday => ({
	date,
	name,
	localName: `local ${name}`,
	countryCode: 'GR',
	fixed: true,
	global: true,
	counties: null,
	launchYear: null,
	types: ['Public']
})

describe('calendar basics', () => {
	it('getDaysInYear handles leap-year rules', () => {
		expect(getDaysInYear(2023)).toBe(365)
		expect(getDaysInYear(2024)).toBe(366)
		expect(getDaysInYear(1900)).toBe(365) // divisible by 100 but not 400
		expect(getDaysInYear(2000)).toBe(366) // divisible by 400
	})

	it('daysIntoYear numbers days from 1 and ignores the time of day', () => {
		expect(daysIntoYear(new Date(2026, 0, 1))).toBe(1)
		expect(daysIntoYear(new Date(2026, 11, 31, 23, 59))).toBe(365)
		expect(daysIntoYear(new Date(2024, 11, 31))).toBe(366)
	})

	it('daysInMonth includes February in leap years', () => {
		expect(daysInMonth(1, 2026)).toBe(31)
		expect(daysInMonth(2, 2026)).toBe(28)
		expect(daysInMonth(2, 2024)).toBe(29)
	})

	it('parseIsoDate parses as a local date, not UTC', () => {
		const date = parseIsoDate('2026-12-25')
		expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([2026, 11, 25, 0])
	})

	it('addDays crosses month and year boundaries', () => {
		expect(addDays(new Date(2026, 11, 31), 1)).toEqual(new Date(2027, 0, 1))
		expect(addDays(new Date(2026, 2, 1), -1)).toEqual(new Date(2026, 1, 28))
	})
})

describe('year-month arithmetic', () => {
	it('shiftYearMonth wraps around the year', () => {
		expect(shiftYearMonth({ year: 2026, month: 11 }, 2)).toEqual({ year: 2027, month: 1 })
		expect(shiftYearMonth({ year: 2026, month: 11 }, -11)).toEqual({ year: 2025, month: 12 })
	})

	it('monthsBetween is signed', () => {
		expect(monthsBetween({ year: 2026, month: 11 }, { year: 2027, month: 1 })).toBe(2)
		expect(monthsBetween({ year: 2026, month: 11 }, { year: 2025, month: 12 })).toBe(-11)
	})

	it('clampWindowStart keeps the start within the allowed range of the current month', () => {
		expect(clampWindowStart({ year: 2026, month: 1 }, TODAY)).toEqual({ year: 2026, month: 1 })
		expect(clampWindowStart({ year: 2024, month: 1 }, TODAY)).toEqual(shiftYearMonth({ year: 2026, month: 11 }, -MAX_WINDOW_SHIFT_MONTHS))
		expect(clampWindowStart({ year: 2030, month: 6 }, TODAY)).toEqual(shiftYearMonth({ year: 2026, month: 11 }, MAX_WINDOW_SHIFT_MONTHS))
	})
})

describe('getPlanningWindow', () => {
	it('builds a calendar year for a January start', () => {
		const w = getPlanningWindow({ year: 2026, month: 1 })
		expect(w.start).toEqual(new Date(2026, 0, 1))
		expect(w.end).toEqual(new Date(2026, 11, 31))
		expect(w.length).toBe(365)
		expect(w.label).toBe('2026')
	})

	it('builds a 12-month window across two calendar years', () => {
		const w = getPlanningWindow({ year: 2026, month: 4 })
		expect(w.start).toEqual(new Date(2026, 3, 1))
		expect(w.end).toEqual(new Date(2027, 2, 31))
		expect(w.length).toBe(365)
		expect(w.label).toBe('Apr 2026 – Mar 2027')
		expect(getYearsCovered(w)).toEqual([2026, 2027])
	})

	it('has 366 days when the window contains 29 February', () => {
		expect(getPlanningWindow({ year: 2027, month: 11 }).length).toBe(366) // contains Feb 2028
	})

	it('dayNumber counts from the window start', () => {
		const w = getPlanningWindow({ year: 2026, month: 4 })
		expect(dayNumber(w, new Date(2026, 3, 1))).toBe(1)
		expect(dayNumber(w, new Date(2027, 0, 1))).toBe(276)
		expect(dayNumber(w, new Date(2027, 2, 31))).toBe(w.length)
		expect(dayNumber(w, new Date(2026, 2, 31))).toBe(0) // the day before the window
	})
})

describe('getWeekends', () => {
	const w = getPlanningWindow({ year: 2026, month: 1 })

	it('returns only future weekend days, sorted, and runs past the window end', () => {
		const weekends = getWeekends(w, TODAY)
		const todayNumber = dayNumber(w, TODAY)

		expect(weekends.every((d) => d > todayNumber)).toBe(true)
		expect(weekends).toEqual([...weekends].sort((a, b) => a - b))
		expect(weekends[0]).toBe(dayNumber(w, new Date(2026, 10, 15))) // Sunday 15 November; today (Saturday) is excluded
		expect(weekends).toContain(dayNumber(w, new Date(2027, 0, 2))) // Saturday 2 January 2027
		expect(weekends).toContain(dayNumber(w, new Date(2027, 0, 3)))
		expect(Math.max(...weekends)).toBeLessThanOrEqual(w.length + WINDOW_END_LOOKAHEAD_DAYS)
	})
})

describe('formatPublicHolidays', () => {
	const w = getPlanningWindow({ year: 2026, month: 1 })

	it('drops past holidays, numbers next year past the window end, and deduplicates by date', () => {
		const input = [
			holiday('2026-01-01', 'Past New Year'),
			holiday('2026-12-25', 'Christmas'),
			holiday('2026-12-25', 'Christmas again'),
			holiday('2027-01-01', 'New Year'),
			holiday('2027-01-06', 'Epiphany')
		]
		const result = formatPublicHolidays(input, w, TODAY)

		expect(result.map((h) => h.date)).toEqual([359, 366, 371])
		expect(result[0]).toEqual({ date: 359, name: 'Christmas', localName: 'local Christmas' })
	})

	it('drops holidays beyond the lookahead', () => {
		expect(formatPublicHolidays([holiday('2027-02-01', 'Too far')], w, TODAY)).toEqual([])
	})

	it('excludes today', () => {
		expect(formatPublicHolidays([holiday('2026-11-14', 'Today')], w, TODAY)).toEqual([])
		expect(formatPublicHolidays([holiday('2026-11-15', 'Tomorrow')], w, TODAY)).toHaveLength(1)
	})

	it('numbers dates relative to a non-January window', () => {
		const april = getPlanningWindow({ year: 2026, month: 4 })
		const [christmas] = formatPublicHolidays([holiday('2026-12-25', 'Christmas')], april, TODAY)
		expect(christmas.date).toBe(dayNumber(april, new Date(2026, 11, 25)))
	})
})

describe('counting helpers', () => {
	it('countWeekends counts runs of weekend days as one weekend', () => {
		// A lone Sunday (2), two full weekends, and a Saturday (22) cut off by the limit
		expect(countWeekends([2, 8, 9, 15, 16, 22, 23], 22)).toBe(4)
	})

	it('countHolidays separates weekday holidays from weekend ones and respects the limit', () => {
		const h = (date: number) => ({ date, name: 'x', localName: 'x' })
		expect(countHolidays([h(5), h(9), h(20), h(30)], [8, 9, 15, 16], 25)).toEqual({ total: 3, onWeekdays: 2 })
	})
})
