import { describe, expect, it } from 'vitest'
import { getBestConsecutiveDays } from './getBestConsecutiveDays'

// A 4-week stretch starting on a Monday (day 1). Weekends on 6-7, 13-14, 20-21, 27-28.
const weekends = [6, 7, 13, 14, 20, 21, 27, 28]
const allDays = Array.from({ length: 28 }, (_, i) => i + 1)
const workingDaysWith = (holidays: number[]) => allDays.filter((d) => !weekends.includes(d) && !holidays.includes(d))

describe('getBestConsecutiveDays', () => {
	it('returns an empty plan for invalid input', () => {
		expect(getBestConsecutiveDays([], 3, weekends, [])).toEqual({ ptoDays: [], daysOff: 0 })
		expect(getBestConsecutiveDays([1, 2, 3], 0, weekends, [])).toEqual({ ptoDays: [], daysOff: 0 })
		expect(getBestConsecutiveDays([1, 2, 3], -2, weekends, [])).toEqual({ ptoDays: [], daysOff: 0 })
	})

	it('bridges two weekends with a full working week', () => {
		// Monday 8 to Friday 12 gives Saturday 6 through Sunday 14: nine days off
		expect(getBestConsecutiveDays(workingDaysWith([]), 5, weekends, [])).toEqual({ ptoDays: [8, 9, 10, 11, 12], daysOff: 9 })
	})

	it('uses holidays to stretch the break further', () => {
		// Thursday 18 and Friday 19 are holidays: booking 15-17 yields 13 (Sat) to 21 (Sun)
		const holidays = [18, 19]
		expect(getBestConsecutiveDays(workingDaysWith(holidays), 3, weekends, holidays)).toEqual({ ptoDays: [15, 16, 17], daysOff: 9 })
	})

	it('shrinks the window instead of crashing when fewer working days remain than requested', () => {
		const working = [22, 23, 24, 25, 26] // last working week only
		expect(getBestConsecutiveDays(working, 30, weekends, [])).toEqual({ ptoDays: working, daysOff: 9 }) // 20-28
	})

	it('counts free days past the end of the working-day list', () => {
		// Working days stop at 26 but the weekend 27-28 still extends the break
		expect(getBestConsecutiveDays([22, 23, 24, 25, 26], 5, weekends, []).daysOff).toBe(9)
	})

	it('returns the earliest window on ties', () => {
		// Every Friday or Monday is worth three days; Friday 5 comes first
		expect(getBestConsecutiveDays(workingDaysWith([]), 1, weekends, [])).toEqual({ ptoDays: [5], daysOff: 3 })
	})

	it('accepts unsorted working days', () => {
		expect(getBestConsecutiveDays([12, 8, 10, 9, 11], 5, weekends, [])).toEqual({ ptoDays: [8, 9, 10, 11, 12], daysOff: 9 })
	})

	describe('pinned days', () => {
		it('only considers windows that contain the pinned day', () => {
			// Without the pin the best 3-day window is 10-12 (6 off); with Monday 22 pinned it must include 22
			expect(getBestConsecutiveDays(workingDaysWith([]), 3, weekends, [], [22])).toEqual({ ptoDays: [18, 19, 22], daysOff: 5 })
		})

		it('grows the window to cover the span between pins', () => {
			// Tuesday 16 and Friday 19 pinned with a budget of 2: the window must be 16-19, giving 16 through Sunday 21
			expect(getBestConsecutiveDays(workingDaysWith([]), 2, weekends, [], [16, 19])).toEqual({ ptoDays: [16, 17, 18, 19], daysOff: 6 })
		})

		it('still finds the best bridge around a single pin', () => {
			const holidays = [15]
			// Friday 12 pinned, 5 days: Mon 8 to Fri 12 bridges 6-7 and 13-15
			expect(getBestConsecutiveDays(workingDaysWith(holidays), 5, weekends, holidays, [12])).toEqual({ ptoDays: [8, 9, 10, 11, 12], daysOff: 10 })
		})

		it('ignores pins that are not working days', () => {
			expect(getBestConsecutiveDays(workingDaysWith([]), 5, weekends, [], [6])).toEqual(getBestConsecutiveDays(workingDaysWith([]), 5, weekends, []))
		})
	})
})
