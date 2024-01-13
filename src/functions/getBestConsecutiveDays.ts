import { BestDay } from '../types/BestDays'
import { createPointDays } from './createPointDays'

export const getBestConsecutiveDays = (workingDays: number[], maxDays: number, weekends: number[], publicHolidays: number[]): BestDay[] => {
	let workingDaysWithPoints: { day: number; pointDays: number[] }[] = []

	for (let i = 0; i < workingDays.length; i++) {
		const currentDay = workingDays[i]
		const currentPointDays = createPointDays(weekends, publicHolidays, currentDay)

		workingDaysWithPoints.push({ day: currentDay, pointDays: currentPointDays })
	}

	workingDaysWithPoints
		// sort by points, highest to lowest
		.sort((a, b) => b.pointDays.length - a.pointDays.length)
		// check other days if they have the same point days and remove it
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

	// sort the array back by day number
	workingDaysWithPoints.sort((a, b) => a.day - b.day)

	let windowStart = 0
	let windowEnd = maxDays - 1

	// Calculate the initial points for the window
	let windowPoints = 0
	for (let i = windowStart; i <= windowEnd; i++) {
		windowPoints += workingDaysWithPoints[i].pointDays.length
	}

	// Keep track of the best window and its points
	let bestWindowStart = windowStart
	let bestWindowEnd = windowEnd
	let bestWindowPoints = windowPoints

	// Slide the window to the right until the end
	while (windowEnd < workingDays.length - 1) {
		// Remove the first day and add the next day
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
