import { createContext, useContext } from 'react'
import { Country } from '../types/SupportedCountries'
import { PublicHolidaySlice } from '../types/PublicHoliday'
import { PlanningWindow } from '../types/PlanningWindow'
import { YearMonth } from '../functions/functions'

export type HolidayStatus = 'idle' | 'loading' | 'ready' | 'error'

export type AppContextValue = {
	/** The 12-month period being planned; all day numbers are relative to it */
	window: PlanningWindow
	/** First month of the window */
	windowStart: YearMonth
	/** Moves the window start by `deltaMonths`, within the allowed range */
	shiftWindowStart: (deltaMonths: number) => void
	/** Whether the window start can move by `deltaMonths` without leaving the allowed range */
	canShiftWindowStart: (deltaMonths: number) => boolean
	countryCode: string
	setCountryCode: (arg: string) => void
	/** Opens the country picker from anywhere in the app */
	openCountryModal: () => void
	/** Opens the About dialog, which also holds the calendar legend */
	openAboutModal: () => void
	weekends: number[]
	supportedCountries: Country[]
	publicHolidays: PublicHolidaySlice[]
	/** Progress of the holiday request for the current country */
	holidayStatus: HolidayStatus
	/** Human-readable message when any request failed, otherwise null */
	loadError: string | null
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

/**
 * Returns the app context. Must be used inside <AppContext.Provider>.
 */
export function useAppContext(): AppContextValue {
	const context = useContext(AppContext)
	if (!context) throw new Error('useAppContext must be used within an AppContext.Provider')
	return context
}

export default AppContext
