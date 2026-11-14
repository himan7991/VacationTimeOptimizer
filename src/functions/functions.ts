import { PublicHoliday, PublicHolidaySlice } from '../types/PublicHoliday'
import { PlanningWindow } from '../types/PlanningWindow'

/** Days past the end of the window that weekends and holidays are still kept for, so a break can run over the edge */
export const WINDOW_END_LOOKAHEAD_DAYS = 7

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const MS_PER_DAY = 24 * 60 * 60 * 1000

/**
 * Returns the number of days in a given year, based on if the year is leap or not
 * @param year The year to get the days for
 * @returns The number of days in the specified year
 */
export function getDaysInYear(year: number) {
	return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365
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

/**
 * Returns the day of the year for a given date (1 January = 1)
 * @param date The date to calculate the day of the year for
 * @returns The day of the year
 */
export function daysIntoYear(date: Date) {
	return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / MS_PER_DAY
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
 * Returns a new date `days` calendar days after `date`, at local midnight
 */
export function addDays(date: Date, days: number): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/**
 * Whole calendar days from the start of the window to `date`, counting the first day as 1.
 * Dates before the window give 0 or negative numbers; dates after it exceed `window.length`.
 */
export function dayNumber(window: PlanningWindow, date: Date): number {
	const from = Date.UTC(window.start.getFullYear(), window.start.getMonth(), window.start.getDate())
	const to = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
	return Math.round((to - from) / MS_PER_DAY) + 1
}

/** A calendar month, 1 = January */
export type YearMonth = { year: number; month: number }

/** How far, in months, the window start may be moved from the current month */
export const MAX_WINDOW_SHIFT_MONTHS = 12

/**
 * Returns the month `delta` months after `from` (negative values go back)
 */
export function shiftYearMonth(from: YearMonth, delta: number): YearMonth {
	const date = new Date(from.year, from.month - 1 + delta, 1)
	return { year: date.getFullYear(), month: date.getMonth() + 1 }
}

/**
 * Whole months from `from` to `to`; positive when `to` is later
 */
export function monthsBetween(from: YearMonth, to: YearMonth): number {
	return (to.year - from.year) * 12 + (to.month - from.month)
}

/**
 * Keeps a window start within MAX_WINDOW_SHIFT_MONTHS of the current month
 */
export function clampWindowStart(start: YearMonth, today: Date = new Date()): YearMonth {
	const current = { year: today.getFullYear(), month: today.getMonth() + 1 }
	const offset = Math.min(MAX_WINDOW_SHIFT_MONTHS, Math.max(-MAX_WINDOW_SHIFT_MONTHS, monthsBetween(current, start)))
	return shiftYearMonth(current, offset)
}

/**
 * Builds the 12-month window that starts on the first day of the given month.
 * E.g. { year: 2026, month: 4 } gives 1 Apr 2026 – 31 Mar 2027.
 */
export function getPlanningWindow({ year: startYear, month: startMonth }: YearMonth): PlanningWindow {
	const month = Math.min(12, Math.max(1, Math.round(startMonth)))
	const start = new Date(startYear, month - 1, 1)
	const end = new Date(startYear + 1, month - 1, 0) // day 0 of the same month next year = last day before it
	const window: Omit<PlanningWindow, 'length' | 'label'> = { startMonth: month, startYear, start, end }
	const length = dayNumber(window as PlanningWindow, end)
	const label =
		month === 1
			? `${startYear}`
			: `${MONTH_NAMES[start.getMonth()]} ${start.getFullYear()} – ${MONTH_NAMES[end.getMonth()]} ${end.getFullYear()}`

	return { ...window, length, label }
}

/**
 * Calendar years that holidays must be fetched for to cover the window plus its lookahead
 */
export function getYearsCovered(window: PlanningWindow): number[] {
	const first = window.start.getFullYear()
	const last = addDays(window.end, WINDOW_END_LOOKAHEAD_DAYS).getFullYear()
	return Array.from({ length: last - first + 1 }, (_, i) => first + i)
}

/**
 * Returns the upcoming weekend days of the window as day numbers, sorted ascending.
 * Numbering continues for WINDOW_END_LOOKAHEAD_DAYS past the window so that a break
 * ending on its last day can count the weekend that follows it.
 * @param window The planning window
 * @param today Reference date, defaults to now; only days after it are returned
 */
export function getWeekends(window: PlanningWindow, today: Date = new Date()): number[] {
	const weekends: number[] = []
	const todayNumber = dayNumber(window, today)

	for (let day = 1; day <= window.length + WINDOW_END_LOOKAHEAD_DAYS; day++) {
		if (day <= todayNumber) continue
		const dayOfWeek = addDays(window.start, day - 1).getDay()
		if (dayOfWeek === 0 || dayOfWeek === 6) weekends.push(day)
	}

	return weekends
}

/**
 * Filters and formats upcoming public holidays as day numbers relative to the window.
 * Holidays past the window end are kept for WINDOW_END_LOOKAHEAD_DAYS so they can bridge the edge.
 * Only holidays after today are kept; duplicates by date are dropped.
 * @param holidays Array of public holidays, possibly spanning several years
 * @param window The planning window
 * @param today Reference date, defaults to now
 */
export function formatPublicHolidays(holidays: PublicHoliday[], window: PlanningWindow, today: Date = new Date()): PublicHolidaySlice[] {
	const todayNumber = dayNumber(window, today)
	const _holidays: PublicHolidaySlice[] = []

	for (const h of holidays) {
		const day = dayNumber(window, parseIsoDate(h.date))
		if (day <= todayNumber || day < 1 || day > window.length + WINDOW_END_LOOKAHEAD_DAYS) continue
		_holidays.push({ date: day, name: h.name, localName: h.localName })
	}

	return _holidays
		.filter((h, index) => _holidays.findIndex((item) => item.date === h.date) === index)
		.sort((a, b) => a.date - b.date)
}
