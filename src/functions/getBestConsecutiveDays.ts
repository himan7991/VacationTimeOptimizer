import { VacationPlan, EMPTY_PLAN } from '../types/VacationPlan'

/**
 * Finds the single longest uninterrupted break obtainable with exactly `maxDays` PTO days.
 *
 * Every window of `maxDays` consecutive working days is considered. The break it produces runs
 * from the first free day touching the window's start to the last free day touching its end.
 * The longest break wins; ties go to the earliest start. If fewer working days remain than
 * `maxDays`, the window shrinks to fit.
 *
 * @param workingDays - Bookable working days (day-of-year numbers), sorted ascending
 * @param maxDays - Number of PTO days available
 * @param weekends - Weekend days (day-of-year numbers)
 * @param publicHolidays - Public holiday days (day-of-year numbers)
 * @returns The chosen PTO days and the total length of the resulting break
 */
export const getBestConsecutiveDays = (workingDays: number[], maxDays: number, weekends: number[], publicHolidays: number[]): VacationPlan => {
	if (workingDays.length === 0 || maxDays <= 0 || !Number.isInteger(maxDays)) return EMPTY_PLAN

	const free = new Set<number>([...weekends, ...publicHolidays])
	const sorted = [...workingDays].sort((a, b) => a - b)
	const windowSize = Math.min(maxDays, sorted.length)

	/** Number of consecutive free days immediately before/after `day` */
	const freeRun = (day: number, step: 1 | -1) => {
		let count = 0
		for (let d = day + step; free.has(d); d += step) count++
		return count
	}

	let best = { start: 0, daysOff: 0 }

	for (let i = 0; i + windowSize <= sorted.length; i++) {
		const first = sorted[i]
		const last = sorted[i + windowSize - 1]
		const breakStart = first - freeRun(first, -1)
		const breakEnd = last + freeRun(last, 1)
		const daysOff = breakEnd - breakStart + 1

		if (daysOff > best.daysOff) best = { start: i, daysOff }
	}

	return { ptoDays: sorted.slice(best.start, best.start + windowSize), daysOff: best.daysOff }
}
