import Header from './components/Header'
import BlurBackground from './components/BlurBackground'
import Content from './components/Content'
import { useContext, useEffect, useState } from 'react'
import AppContext from './context/AppContext'
import { getDaysInYear, getPublicHolidays, getWeekends } from './functions/functions'
import { IpApi } from './types/IpApi'

export default function App() {
	// context
	const [year, setYear] = useState<number>(new Date().getFullYear())
	const [country, setCountry] = useState<string>('US')
	const [daysInYear, setDaysInYear] = useState<number>(365)
	const [weekends, setWeekends] = useState<number[]>([])
	const [publicHolidays, setPublicHolidays] = useState<number[]>([])
	const [userIP, setUserIP] = useState<string>('')

	const passedAppContext = {
		year,
		setYear,
		country,
		setCountry,
		daysInYear,
		setDaysInYear,
		weekends,
		setWeekends,
		publicHolidays,
		setPublicHolidays
	}

	useEffect(() => {
		// get the user's ip
		fetch('https://api.ipify.org?format=json')
			.then((ipResponse) => ipResponse.json())
			.then((ipData) => {
				setUserIP(ipData.ip)
				// use the ip to retrieve the user's location
				return fetch(`https://ipapi.co/${ipData.ip}/json/`)
			})
			.then((countryResponse) => countryResponse.json())
			.then((countryData) => {
				setCountry(countryData.country_code)
				// use the user country to retrieve the holidays in that country
				return fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryData.country_code}`)
			})
			.then((holidaysResponse) => holidaysResponse.json())
			.then((holidaysData) => setPublicHolidays(getPublicHolidays(holidaysData)))
			.catch((error) => console.error('Error fetching data:', error))

		setDaysInYear(getDaysInYear(year))
		setWeekends(getWeekends(year))
	}, [])

	return (
		<AppContext.Provider value={passedAppContext}>
			<main className="min-h-screen bg-background relative overflow-hidden">
				<Header />
				<Content />
				<BlurBackground />
			</main>
		</AppContext.Provider>
	)
}
