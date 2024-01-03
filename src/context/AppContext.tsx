import React from 'react'

// set the defaults
const AppContext = React.createContext({
	year: 2024,
	setYear: (arg: number) => {},
	country: 'GR',
	setCountry: (arg: string) => {},
	daysInYear: 365,
	setDaysInYear: (arg: number) => {},
	weekends: [1, 2, 3],
	setWeekends: (arg: number[]) => {},
	publicHolidays: [1, 2, 3],
	setPublicHolidays: (arg: number[]) => {}
})

export default AppContext
