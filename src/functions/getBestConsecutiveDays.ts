import { BestDay } from '../types/BestDays'

export const getBestConsecutiveDays = (workingDays: number[], maxDays: number, weekends: number[], publicHolidays: number[]): BestDay[] => {
	// Helper function to check if a day is a weekend or a holiday
	const isWeekendOrHoliday = (day: number): boolean => weekends.includes(day) || publicHolidays.includes(day)

	// Helper function to calculate the points for a single day
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

	// Initialize the window of size maxDays
	let windowStart = 0
	let windowEnd = maxDays - 1

	// Calculate the initial points for the window
	let windowPoints = 0
	for (let i = windowStart; i <= windowEnd; i++) {
		windowPoints += calculatePoints(workingDays[i])
	}

	// Keep track of the best window and its points
	let bestWindowStart = windowStart
	let bestWindowEnd = windowEnd
	let bestWindowPoints = windowPoints

	// Slide the window to the right until the end
	while (windowEnd < workingDays.length - 1) {
		// Remove the first day and add the next day
		windowPoints -= calculatePoints(workingDays[windowStart])
		windowStart++
		windowEnd++
		windowPoints += calculatePoints(workingDays[windowEnd])

		// Update the best window if needed
		if (windowPoints > bestWindowPoints) {
			bestWindowStart = windowStart
			bestWindowEnd = windowEnd
			bestWindowPoints = windowPoints
		}
	}

	// Return the best window as an array of objects
	const bestWindow: BestDay[] = []
	for (let i = bestWindowStart; i <= bestWindowEnd; i++) {
		bestWindow.push({ day: workingDays[i], points: calculatePoints(workingDays[i]) })
	}
	return bestWindow
}
