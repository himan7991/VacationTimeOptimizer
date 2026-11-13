/**
 * The result of an optimisation run.
 * All day values are day-of-year numbers (1 = 1 January).
 */
export type VacationPlan = {
	/** Working days the user should book as PTO, sorted ascending */
	ptoDays: number[]
	/** Total days off obtained: PTO days plus every weekend/holiday they connect to */
	daysOff: number
}

export const EMPTY_PLAN: VacationPlan = { ptoDays: [], daysOff: 0 }
