import { createContext, useContext } from 'react'
import { Country } from '../types/SupportedCountries'
import { PublicHolidaySlice } from '../types/PublicHoliday'

export type AppContextValue = {
	year: number
	setYear: (arg: number) => void
	countryCode: string
	setCountryCode: (arg: string) => void
	daysInYear: number
	setDaysInYear: (arg: number) => void
	weekends: number[]
	setWeekends: (arg: number[]) => void
	supportedCountries: Country[]
	setSupportedCountries: (arg: Country[]) => void
	publicHolidays: PublicHolidaySlice[]
	setPublicHolidays: (arg: PublicHolidaySlice[]) => void
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
