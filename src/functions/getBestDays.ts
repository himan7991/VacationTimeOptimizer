import { BestDay } from '../types/BestDays'
import { createPointDays } from './createPointDays'

export const getBestOverallDays = (workingDays: number[], maxDays: number, weekends: number[], publicHolidays: number[]): BestDay[] => {
	let bestDays: BestDay[] = []
	let workingDaysWithPoints: { day: number; pointDays: number[] }[] = []

	for (let i = 0; i < workingDays.length; i++) {
		const currentDay = workingDays[i]
		const currentPointDays = createPointDays(weekends, publicHolidays, currentDay)

		if (currentPointDays.length > 0) {
			workingDaysWithPoints.push({ day: currentDay, pointDays: currentPointDays })
		}
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

	bestDays = workingDaysWithPoints
		.filter((obj) => obj.pointDays.length > 0)
		.slice(0, maxDays)
		.map((obj) => ({ day: obj.day, points: obj.pointDays.length }))

	return bestDays
}
