import { createContext, useContext } from 'react'
import { Country } from '../types/SupportedCountries'
import { PublicHolidaySlice } from '../types/PublicHoliday'

export type HolidayStatus = 'idle' | 'loading' | 'ready' | 'error'

export type AppContextValue = {
	year: number
	countryCode: string
	setCountryCode: (arg: string) => void
	daysInYear: number
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
