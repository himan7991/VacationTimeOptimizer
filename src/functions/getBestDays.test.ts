import { describe, expect, it } from 'vitest'
import { getBestOverallDays } from './getBestDays'

// A 4-week stretch starting on a Monday (day 1). Weekends on 6-7, 13-14, 20-21, 27-28.
const weekends = [6, 7, 13, 14, 20, 21, 27, 28]
const allDays = Array.from({ length: 28 }, (_, i) => i + 1)
const workingDaysWith = (holidays: number[]) => allDays.filter((d) => !weekends.includes(d) && !holidays.includes(d))

describe('getBestOverallDays', () => {
	it('returns an empty plan for invalid input', () => {
		expect(getBestOverallDays([], 3, weekends, [])).toEqual({ ptoDays: [], daysOff: 0 })
		expect(getBestOverallDays([1, 2, 3], 0, weekends, [])).toEqual({ ptoDays: [], daysOff: 0 })
		expect(getBestOverallDays([1, 2, 3], 1.5, weekends, [])).toEqual({ ptoDays: [], daysOff: 0 })
	})

	it('prefers the day next to a holiday-weekend combo over a plain Friday', () => {
		// Day 15 is a Monday holiday, so Friday 12 bridges 12-15: four days off for one PTO day
		const holidays = [15]
		expect(getBestOverallDays(workingDaysWith(holidays), 1, weekends, holidays)).toEqual({ ptoDays: [12], daysOff: 4 })
	})

	it('spreads across different weekends before stacking on the same one', () => {
		// Three Fridays, each worth 3 days off; earlier dates win ties
		expect(getBestOverallDays(workingDaysWith([]), 3, weekends, [])).toEqual({ ptoDays: [5, 12, 19], daysOff: 9 })
	})

	it('keeps adding days once every weekend is claimed, extending existing blocks', () => {
		const plan = getBestOverallDays(workingDaysWith([]), 5, weekends, [])
		expect(plan.ptoDays).toHaveLength(5)
		// Four Fridays claim all four weekends (12 days off), the fifth day stacks onto one of them
		expect(plan.ptoDays).toEqual(expect.arrayContaining([5, 12, 19, 26]))
		expect(plan.daysOff).toBe(13)
	})

	it('never returns more days than there are working days', () => {
		const working = workingDaysWith([])
		expect(getBestOverallDays(working, 100, weekends, [])).toEqual({ ptoDays: working, daysOff: 28 })
	})

	it('counts a holiday that falls on a weekend only once', () => {
		const withSaturdayHoliday = getBestOverallDays(workingDaysWith([6]), 2, weekends, [6])
		const without = getBestOverallDays(workingDaysWith([]), 2, weekends, [])
		expect(withSaturdayHoliday.daysOff).toBe(without.daysOff)
	})

	it('returns PTO days sorted ascending', () => {
		const plan = getBestOverallDays(workingDaysWith([]), 4, weekends, [])
		expect(plan.ptoDays).toEqual([...plan.ptoDays].sort((a, b) => a - b))
	})

	describe('pinned days', () => {
		it('always includes pinned days and spends the rest of the budget normally', () => {
			// Wednesday 3 is pinned and worth only itself; the other two picks are Fridays worth 3 each
			expect(getBestOverallDays(workingDaysWith([]), 3, weekends, [], [3])).toEqual({ ptoDays: [3, 5, 12], daysOff: 7 })
		})

		it('grows the budget when more days are pinned than requested', () => {
			const plan = getBestOverallDays(workingDaysWith([]), 2, weekends, [], [2, 3, 4, 10])
			expect(plan.ptoDays).toEqual([2, 3, 4, 10])
			expect(plan.daysOff).toBe(4)
		})

		it('ignores pins that are not working days', () => {
			const pinned = getBestOverallDays(workingDaysWith([]), 3, weekends, [], [6, 999])
			const unpinned = getBestOverallDays(workingDaysWith([]), 3, weekends, [])
			expect(pinned).toEqual(unpinned)
		})

		it('does not double count free days shared between a pin and a later pick', () => {
			// Pin Monday 8: it claims weekend 6-7. Friday 5 then only adds itself.
			const plan = getBestOverallDays(workingDaysWith([]), 2, weekends, [], [8])
			expect(plan.ptoDays).toContain(8)
			expect(plan.daysOff).toBe(6) // 8 + weekend 6-7 (3), then Friday 12 + weekend 13-14 (3)
		})
	})
})
