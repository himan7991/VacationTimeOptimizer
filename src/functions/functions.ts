import { PublicHoliday, PublicHolidaySlice } from '../types/PublicHoliday'

/**
 * Returns the number of days in a given year, based on if the year is leap or not
 * @param year The year to get the days for
 * @returns The number of days in the specified year
 */
export function getDaysInYear(year: number) {
	return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365
}

/**
 * Returns an array of upcoming weekends in the current year
 * @param year The year to get weekends for
 * @returns An array of day numbers representing upcoming weekends
 */
export function getWeekends(year: number) {
	const weekends: number[] = []

	for (let day = 1; day <= getDaysInYear(year); day++) {
		const currentDate = new Date(year, 0, day)
		const dayOfWeek = currentDate.getDay()

		if (dayOfWeek === 0 || dayOfWeek === 6) {
			if (currentDate > new Date()) {
				weekends.push(day)
			}
		}
	}

	return weekends.sort((a, b) => a - b)
}

/**
 * Returns the day of the year for a given date
 * @param date The date to calculate the day of the year for
 * @returns The day of the year
 */
export function daysIntoYear(date: Date) {
	return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
}

/**
 * Filters and formats upcoming public holidays
 * @param holidays Array of public holidays
 * @returns Formatted array of upcoming public holidays
 */
export function getPublicHolidays(holidays: PublicHoliday[]): PublicHolidaySlice[] {
	const _holidays: PublicHolidaySlice[] = []

	holidays.map((h) => {
		const holidayDate = new Date(h.date)
		const daysIntoYear =
			(Date.UTC(holidayDate.getFullYear(), holidayDate.getMonth(), holidayDate.getDate()) - Date.UTC(holidayDate.getFullYear(), 0, 0)) /
			24 /
			60 /
			60 /
			1000
		if (holidayDate.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
			_holidays.push({ date: daysIntoYear, name: h.name, localName: h.localName })
		}
	})

	_holidays.push({ date: getDaysInYear(new Date().getFullYear()) + 1, name: "New Year's Day", localName: 'Πρωτοχρονιά' }) // add 1-Jan-(year+1) to the holidays
	return _holidays.filter((h, index) => _holidays.findIndex((item) => item.date === h.date) === index)
}

/**
 * Returns the number of days in a specific month
 * @param month The month (1-indexed) to get days for
 * @param year The year of the month
 * @returns The number of days in the specified month
 */
export function daysInMonth(month: number, year: number) {
	return new Date(year, month, 0).getDate()
}
