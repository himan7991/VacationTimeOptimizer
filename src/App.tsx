import Header from './components/Header'
import BlurBackground from './components/BlurBackground'
import Content from './components/Content'
import { useContext, useEffect, useState } from 'react'
import AppContext from './context/AppContext'
import { getDaysInYear, getPublicHolidays, getWeekends } from './functions/functions'

export default function App() {
	// context
	const [year, setYear] = useState<number>(new Date().getFullYear())
	const [country, setCountry] = useState<string>('GR')
	const [daysInYear, setDaysInYear] = useState<number>(365)
	const [weekends, setWeekends] = useState<number[]>([])
	const [publicHolidays, setPublicHolidays] = useState<number[]>([])

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
		const fetchPublicHolidays = async () => {
			try {
				await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`)
					.then((response) => response.json())
					.then((data) => setPublicHolidays(getPublicHolidays(data)))
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}

		fetchPublicHolidays()

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
