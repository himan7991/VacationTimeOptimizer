import { VacationPlan, EMPTY_PLAN } from '../types/VacationPlan'

/**
 * Picks the PTO days that give the most days off overall, spreading them across the year.
 *
 * Greedy: each round chooses the working day that adds the most days off, where a day
 * adds itself plus every weekend/holiday day it newly connects to. Once every free run is
 * claimed, extra days extend existing blocks (ties go to the longer block, then the earlier date).
 *
 * Pinned days are always chosen first and count against the budget. If more days are pinned
 * than `maxDays`, the budget grows to fit them.
 *
 * @param workingDays - Bookable working days (day numbers)
 * @param maxDays - Number of PTO days available
 * @param weekends - Weekend days (day numbers)
 * @param publicHolidays - Public holiday days (day numbers)
 * @param pinnedDays - Working days the user insists on taking off
 * @returns The chosen PTO days and the total days off they produce
 */
export const getBestOverallDays = (
	workingDays: number[],
	maxDays: number,
	weekends: number[],
	publicHolidays: number[],
	pinnedDays: number[] = []
): VacationPlan => {
	if (workingDays.length === 0 || maxDays <= 0 || !Number.isInteger(maxDays)) return EMPTY_PLAN

	const free = new Set<number>([...weekends, ...publicHolidays])
	const chosen = new Set<number>()
	const attached = new Set<number>() // free days already counted in some block
	const remaining = new Set<number>(workingDays)
	const pinned = [...new Set(pinnedDays)].filter((day) => remaining.has(day)).sort((a, b) => a - b)
	const budget = Math.min(Math.max(maxDays, pinned.length), workingDays.length)

	const isInBlock = (day: number) => free.has(day) || chosen.has(day)

	/** Free days reachable from `day` walking in `step` direction through free and chosen days */
	const reachableFree = (day: number, step: 1 | -1): number[] => {
		const found: number[] = []
		for (let d = day + step; isInBlock(d); d += step) {
			if (free.has(d)) found.push(d)
		}
		return found
	}

	/** Free days `day` would newly connect to if chosen now */
	const newlyAttached = (day: number) => [...reachableFree(day, -1), ...reachableFree(day, 1)].filter((d) => !attached.has(d))

	/** Length of the block that would contain `day` if it were chosen */
	const blockLengthWith = (day: number) => {
		let length = 1
		for (let d = day - 1; isInBlock(d); d--) length++
		for (let d = day + 1; isInBlock(d); d++) length++
		return length
	}

	let daysOff = 0

	/** Commits `day` to the plan and books the free days it connects to */
	const choose = (day: number) => {
		const gained = newlyAttached(day)
		chosen.add(day)
		remaining.delete(day)
		daysOff += 1 + gained.length
		for (const d of [...reachableFree(day, -1), ...reachableFree(day, 1)]) attached.add(d)
	}

	for (const day of pinned) choose(day)

	for (let round = pinned.length; round < budget; round++) {
		let best: { day: number; gain: number; blockLength: number } | undefined

		for (const day of remaining) {
			const gain = 1 + newlyAttached(day).length
			const blockLength = blockLengthWith(day)

			const better =
				!best ||
				gain > best.gain ||
				(gain === best.gain && blockLength > best.blockLength) ||
				(gain === best.gain && blockLength === best.blockLength && day < best.day)

			if (better) best = { day, gain, blockLength }
		}

		if (!best) break
		choose(best.day)
	}

	return { ptoDays: [...chosen].sort((a, b) => a - b), daysOff }
}
