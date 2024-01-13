/**
 * Checks if a given day is a weekend or public holiday.
 * @param weekends number[] of weekend days
 * @param publicHolidays number[] of public holidays
 * @param day number
 * @returns True if the day is a weekend or public holiday, otherwise false.
 */
const isWeekendOrHoliday = (weekends: number[], publicHolidays: number[], day: number): boolean =>
	weekends.includes(day) || publicHolidays.includes(day)

/**
 * Creates an array of consecutive days before and after a given day that are weekends or public holidays.
 * @param weekends number[] of weekend days
 * @param publicHolidays number[] of public holidays
 * @param day number
 * @returns number[] of point days
 */
export const createPointDays = (weekends: number[], publicHolidays: number[], day: number): number[] => {
	const pointDays: number[] = []

	let consecutiveDaysBefore = 1
	while (isWeekendOrHoliday(weekends, publicHolidays, day - consecutiveDaysBefore)) {
		pointDays.push(day - consecutiveDaysBefore)
		consecutiveDaysBefore++
	}

	let consecutiveDaysAfter = 1
	while (isWeekendOrHoliday(weekends, publicHolidays, day + consecutiveDaysAfter)) {
		pointDays.push(day + consecutiveDaysAfter)
		consecutiveDaysAfter++
	}

	return pointDays
}
