import React from 'react'
import { Country } from '../types/SupportedCountries'
import { PublicHolidaySlice } from '../types/PublicHoliday'
// set the defaults
const AppContext = React.createContext({
	year: 2024,
	setYear: (arg: number) => {},
	countryCode: 'GR',
	setCountryCode: (arg: string) => {},
	daysInYear: 365,
	setDaysInYear: (arg: number) => {},
	weekends: [1, 2, 3],
	setWeekends: (arg: number[]) => {},
	supportedCountries: [{ countryCode: 'string', name: 'string' }],
	setSupportedCountries: (arg: Country[]) => {},
	publicHolidays: [{ date: 0, name: '', localName: '' }],
	setPublicHolidays: (arg: PublicHolidaySlice[]) => {}
})

export default AppContext
