import { BestDay } from '../types/BestDays'
import { createPointDays } from './createPointDays'

/**
 * Calculates the best consecutive days based on working days, maximum days, weekends, and public holidays.
 * @param workingDays - Array of working days
 * @param maxDays - Maximum number of consecutive days
 * @param weekends - Array of weekends
 * @param publicHolidays - Array of public holidays
 * @returns Array of objects representing the best consecutive days with their points
 */
export const getBestConsecutiveDays = (workingDays: number[], maxDays: number, weekends: number[], publicHolidays: number[]): BestDay[] => {
	// Create an array of objects to store each working day along with its associated point days
	let workingDaysWithPoints: { day: number; pointDays: number[] }[] = []

	// Calculate and store the point days for each working day
	for (let i = 0; i < workingDays.length; i++) {
		const currentDay = workingDays[i]
		const currentPointDays = createPointDays(weekends, publicHolidays, currentDay)

		workingDaysWithPoints.push({ day: currentDay, pointDays: currentPointDays })
	}

	// Sort the workingDaysWithPoints array by the number of point days in descending order
	workingDaysWithPoints
		.sort((a, b) => b.pointDays.length - a.pointDays.length)
		.forEach((obj) => {
			const currentDay = obj.day
			const otherObjects = workingDaysWithPoints.filter((o) => o.day !== currentDay)
			obj.pointDays.forEach((pointDay) => {
				otherObjects.forEach((otherObj) => {
					const index = otherObj.pointDays.indexOf(pointDay)
					if (index !== -1) otherObj.pointDays.splice(index, 1)
				})
			})
		})

	// Sort the workingDaysWithPoints array back by the day number
	workingDaysWithPoints.sort((a, b) => a.day - b.day)

	// Initialize the window start and end index
	let windowStart = 0
	let windowEnd = maxDays - 1

	// Calculate the initial points for the window
	let windowPoints = 0
	for (let i = windowStart; i <= windowEnd; i++) {
		windowPoints += workingDaysWithPoints[i].pointDays.length
	}

	// Initialize variables to keep track of the best window and its points
	let bestWindowStart = windowStart
	let bestWindowEnd = windowEnd
	let bestWindowPoints = windowPoints

	// Slide the window to the right until the end
	while (windowEnd < workingDays.length - 1) {
		// Remove the first day and add the next day to the window
		windowPoints -= workingDaysWithPoints[windowStart]?.pointDays.length
		windowStart++
		windowEnd++
		windowPoints += workingDaysWithPoints[windowEnd]?.pointDays.length

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
		bestWindow.push({ day: workingDays[i], points: workingDaysWithPoints[i].pointDays.length })
	}
	return bestWindow
}
