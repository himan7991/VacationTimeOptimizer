import { PublicHoliday, PublicHolidaySlice } from '../types/PublicHoliday'

/**
 * Returns the number of days in a given year, based on if the year is leap or not
 * @param year The year to get the days for
 * @returns The number of days in the specified year
 */
export function getDaysInYear(year: number) {
	return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365
}

/** Days past the end of the year that weekends are still generated for, so a break can run over the year end */
export const YEAR_END_LOOKAHEAD_DAYS = 7

/**
 * Returns the upcoming weekend days of a year as day-of-year numbers.
 * Numbering continues into the first week of the following year (see YEAR_END_LOOKAHEAD_DAYS)
 * so that a break ending on 31 December can count the weekend that follows it.
 * @param year The year to get weekends for
 * @returns Sorted day numbers of upcoming weekend days
 */
export function getWeekends(year: number) {
	const weekends: number[] = []

	for (let day = 1; day <= getDaysInYear(year) + YEAR_END_LOOKAHEAD_DAYS; day++) {
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
 * Parses an ISO date string (YYYY-MM-DD) as a local date, avoiding the UTC shift of `new Date(string)`
 * @param isoDate Date string in YYYY-MM-DD form
 * @returns A Date at local midnight
 */
export function parseIsoDate(isoDate: string): Date {
	const [year, month, day] = isoDate.split('-').map(Number)
	return new Date(year, month - 1, day)
}

/**
 * Filters and formats upcoming public holidays as day-of-year numbers relative to `baseYear`.
 * Holidays in the following year continue the numbering (e.g. 1 January becomes day 366 or 367),
 * so they can be used for bridging the year end. Only holidays after today are kept.
 * @param holidays Array of public holidays, possibly spanning two years
 * @param baseYear The year that day 1 refers to
 * @returns Formatted array of upcoming public holidays, deduplicated by date
 */
export function formatPublicHolidays(holidays: PublicHoliday[], baseYear: number): PublicHolidaySlice[] {
	const today = new Date().setHours(0, 0, 0, 0)
	const _holidays: PublicHolidaySlice[] = []

	for (const h of holidays) {
		const holidayDate = parseIsoDate(h.date)
		if (holidayDate.getTime() <= today) continue

		const yearOffset = holidayDate.getFullYear() === baseYear ? 0 : getDaysInYear(baseYear)
		_holidays.push({ date: daysIntoYear(holidayDate) + yearOffset, name: h.name, localName: h.localName })
	}

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
