/**
 * The 12-month period being planned. Day numbers everywhere in the app are relative to this window:
 * day 1 is the first day of `start`, and `length` is the last day of the window.
 */
export type PlanningWindow = {
	/** Month the window starts in, 1 = January */
	startMonth: number
	/** Calendar year the window starts in */
	startYear: number
	/** First day of the window, local midnight */
	start: Date
	/** Last day of the window, local midnight */
	end: Date
	/** Number of days in the window (365 or 366) */
	length: number
	/** Human-readable range, e.g. "2026" or "Apr 2026 – Mar 2027" */
	label: string
}
