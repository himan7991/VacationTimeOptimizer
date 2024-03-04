import { BestDay } from '../types/BestDays'
import { createPointDays } from './createPointDays'

/**
 * Retrieves the best overall days based on the provided working days, max days, weekends, and public holidays
 * @param workingDays - Array of working days
 * @param maxDays - Maximum number of days to retrieve
 * @param weekends - Array of weekend days
 * @param publicHolidays - Array of public holidays
 * @returns Array of BestDay objects representing the best overall days
 */

export const getBestOverallDays = (workingDays: number[], maxDays: number, weekends: number[], publicHolidays: number[]): BestDay[] => {
	// Input validation
	if (workingDays.length === 0 || maxDays <= 0 || !Number.isInteger(maxDays)) {
		return []
	}

	// Create an object to store the point days for each working day
	const workingDaysWithPoints: { [key: number]: number[] } = {}

	// Iterate through each working day to create an array of point days for each day
	for (let i = 0; i < workingDays.length; i++) {
		const currentDay: number = workingDays[i]
		workingDaysWithPoints[currentDay] = createPointDays(weekends, publicHolidays, currentDay)
	}

	// Create an array of objects containing the working day and the number of point days
	const workingDaysWithPointCounts: { day: number; pointCount: number }[] = Object.entries(workingDaysWithPoints)
		.filter(([_, pointDays]) => pointDays.length > 0)
		.map(([day, pointDays]) => ({ day: parseInt(day), pointCount: pointDays.length }))

	// Sort the working days by the number of point days, from highest to lowest
	workingDaysWithPointCounts.sort((a, b) => b.pointCount - a.pointCount)

	// Remove duplicate point days
	const uniquePointDays: Set<number> = new Set()
	const nonOverlapWorkingDaysWithPointCounts: { day: number; pointCount: number }[] = workingDaysWithPointCounts.filter((obj) => {
		const pointDays = workingDaysWithPoints[obj.day]
		const overlap = pointDays.some((day) => uniquePointDays.has(day))
		pointDays.forEach((day) => uniquePointDays.add(day))
		return !overlap
	})

	// Select the top maxDays and map them to BestDay objects
	const bestDays: BestDay[] = nonOverlapWorkingDaysWithPointCounts.slice(0, maxDays).map((obj) => ({ day: obj.day, points: obj.pointCount }))

	return bestDays
}
