import { BestDay } from '../types/BestDays'

export const getBestDaysToTakeOff = (workingDays: number[], maxDays: number, weekends: number[], publicHolidays: number[]): BestDay[] => {
	let bestDays: BestDay[] = []
	let workingDaysWithPoints: { day: number; pointDays: number[] }[] = []

	const isWeekendOrHoliday = (day: number): boolean => weekends.includes(day) || publicHolidays.includes(day)

	const createPointDays = (day: number): number[] => {
		const pointDays: number[] = []

		let consecutiveDaysBefore = 1
		while (isWeekendOrHoliday(day - consecutiveDaysBefore)) {
			pointDays.push(day - consecutiveDaysBefore)
			consecutiveDaysBefore++
		}

		let consecutiveDaysAfter = 1
		while (isWeekendOrHoliday(day + consecutiveDaysAfter)) {
			pointDays.push(day + consecutiveDaysAfter)
			consecutiveDaysAfter++
		}

		return pointDays
	}

	for (let i = 0; i < workingDays.length; i++) {
		const currentDay = workingDays[i]
		const currentPointDays = createPointDays(currentDay)

		if (currentPointDays.length > 0) {
			workingDaysWithPoints.push({ day: currentDay, pointDays: currentPointDays })
		}
	}

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

	bestDays = workingDaysWithPoints
		.filter((obj) => obj.pointDays.length > 0)
		.slice(0, maxDays)
		.map((obj) => ({ day: obj.day, points: obj.pointDays.length }))

	return bestDays
}
