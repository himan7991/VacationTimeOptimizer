import Header from './components/Header'
import BlurBackground from './components/BlurBackground'
import Content from './components/Content'
import { useEffect, useState } from 'react'
import AppContext from './context/AppContext'
import { getDaysInYear, formatPublicHolidays, getWeekends } from './functions/functions'
import { Country } from './types/SupportedCountries'
import { PublicHoliday, PublicHolidaySlice } from './types/PublicHoliday'

export default function App() {
	// context
	const [year, setYear] = useState<number>(new Date().getFullYear())
	const [supportedCountries, setSupportedCountries] = useState<Country[]>([{ countryCode: 'US', name: 'United States' }])
	const [countryCode, setCountryCode] = useState<string>('')
	const [daysInYear, setDaysInYear] = useState<number>(365)
	const [weekends, setWeekends] = useState<number[]>([])
	const [publicHolidays, setPublicHolidays] = useState<PublicHolidaySlice[]>([])

	const passedAppContext = {
		year,
		setYear,
		countryCode,
		setCountryCode,
		daysInYear,
		setDaysInYear,
		weekends,
		setWeekends,
		supportedCountries,
		setSupportedCountries,
		publicHolidays,
		setPublicHolidays
	}

	/**
	 * Loads this year's holidays plus next year's, so 1 January can bridge the year end.
	 */
	const loadPublicHolidays = (code: string) =>
		Promise.all(
			[year, year + 1].map((y) =>
				fetch(`https://date.nager.at/api/v3/PublicHolidays/${y}/${code}`).then((res) => res.json() as Promise<PublicHoliday[]>)
			)
		).then((perYear) => setPublicHolidays(formatPublicHolidays(perYear.flat(), year)))

	useEffect(() => {
		const countryCode = localStorage.getItem('countryCode')

		fetch('https://date.nager.at/api/v3/AvailableCountries')
			.then((res) => res.json())
			.then((data) => setSupportedCountries(data))
			.catch((error) => console.error(error))

		if (countryCode) {
			setCountryCode(countryCode)
			loadPublicHolidays(countryCode).catch((error) => console.error('Error fetching data:', error))
		} else {
			// get the user's ip
			fetch('https://api.ipify.org?format=json')
				.then((ipResponse) => ipResponse.json())
				.then((ipData) => {
					// use the ip to retrieve the user's location
					return fetch(`https://ipapi.co/${ipData.ip}/json/`)
				})
				.then((countryResponse) => countryResponse.json())
				.then((countryData) => {
					setCountryCode(countryData.country_code)
					// use the user country to retrieve the holidays in that country
					return loadPublicHolidays(countryData.country_code)
				})
				.catch((error) => console.error('Error fetching data:', error))
		}

		setDaysInYear(getDaysInYear(year))
		setWeekends(getWeekends(year))
	}, [countryCode])

	return (
		<AppContext.Provider value={passedAppContext}>
			<main className="relative min-h-screen overflow-hidden bg-background pb-6">
				<Header />
				<Content />
				<BlurBackground />
			</main>
		</AppContext.Provider>
	)
}
