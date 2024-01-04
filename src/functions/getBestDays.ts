import { BestDay } from '../types/BestDays'

export const getBestDaysToTakeOff = (workingDays: number[], maxDays: number, weekends: number[], publicHolidays: number[]): BestDay[] => {
	let currentVacation: { day: number; points: number }[] = []

	const isWeekendOrHoliday = (day: number): boolean => weekends.includes(day) || publicHolidays.includes(day)

	const calculatePoints = (day: number): number => {
		let points = 0

		// Check days before
		let consecutiveDaysBefore = 1
		while (isWeekendOrHoliday(day - consecutiveDaysBefore)) {
			points += 1
			consecutiveDaysBefore++
		}

		// Check days after
		let consecutiveDaysAfter = 1
		while (isWeekendOrHoliday(day + consecutiveDaysAfter)) {
			points += 1
			consecutiveDaysAfter++
		}

		return points
	}

	for (let i = 0; i < workingDays.length; i++) {
		const currentDay = workingDays[i]
		const currentPoints = calculatePoints(currentDay)

		if (currentPoints > 0) {
			currentVacation.push({ day: currentDay, points: currentPoints })
		}
	}

	currentVacation = currentVacation.sort((a, b) => b.points - a.points).slice(0, maxDays)
	return currentVacation
}
