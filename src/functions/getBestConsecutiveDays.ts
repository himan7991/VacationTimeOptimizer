import { VacationPlan, EMPTY_PLAN } from '../types/VacationPlan'

/**
 * Finds the single longest uninterrupted break obtainable with exactly `maxDays` PTO days.
 *
 * Every window of `maxDays` consecutive working days is considered. The break it produces runs
 * from the first free day touching the window's start to the last free day touching its end.
 * The longest break wins; ties go to the earliest start. If fewer working days remain than
 * `maxDays`, the window shrinks to fit.
 *
 * Pinned days must all fall inside the chosen window. If they span more working days than
 * `maxDays`, the window grows to cover them.
 *
 * @param workingDays - Bookable working days (day numbers)
 * @param maxDays - Number of PTO days available
 * @param weekends - Weekend days (day numbers)
 * @param publicHolidays - Public holiday days (day numbers)
 * @param pinnedDays - Working days the user insists on taking off
 * @returns The chosen PTO days and the total length of the resulting break
 */
export const getBestConsecutiveDays = (
	workingDays: number[],
	maxDays: number,
	weekends: number[],
	publicHolidays: number[],
	pinnedDays: number[] = []
): VacationPlan => {
	if (workingDays.length === 0 || maxDays <= 0 || !Number.isInteger(maxDays)) return EMPTY_PLAN

	const free = new Set<number>([...weekends, ...publicHolidays])
	const sorted = [...workingDays].sort((a, b) => a - b)
	const indexOf = new Map(sorted.map((day, i) => [day, i]))
	const pinnedIndices = [...new Set(pinnedDays)].filter((day) => indexOf.has(day)).map((day) => indexOf.get(day) as number)

	// The window must start at or before the first pinned day and end at or after the last
	const latestStart = pinnedIndices.length ? Math.min(...pinnedIndices) : sorted.length - 1
	const earliestEnd = pinnedIndices.length ? Math.max(...pinnedIndices) : 0
	const windowSize = Math.min(Math.max(maxDays, earliestEnd - latestStart + 1), sorted.length)

	/** Number of consecutive free days immediately before/after `day` */
	const freeRun = (day: number, step: 1 | -1) => {
		let count = 0
		for (let d = day + step; free.has(d); d += step) count++
		return count
	}

	let best = { start: 0, daysOff: 0 }

	for (let i = 0; i + windowSize <= sorted.length; i++) {
		if (i > latestStart || i + windowSize - 1 < earliestEnd) continue

		const first = sorted[i]
		const last = sorted[i + windowSize - 1]
		const breakStart = first - freeRun(first, -1)
		const breakEnd = last + freeRun(last, 1)
		const daysOff = breakEnd - breakStart + 1

		if (daysOff > best.daysOff) best = { start: i, daysOff }
	}

	return { ptoDays: sorted.slice(best.start, best.start + windowSize), daysOff: best.daysOff }
}
