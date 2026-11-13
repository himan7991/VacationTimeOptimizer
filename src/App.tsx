import Header from './components/Header'
import BlurBackground from './components/BlurBackground'
import Content from './components/Content'
import { useEffect, useMemo, useState } from 'react'
import AppContext, { AppContextValue, HolidayStatus } from './context/AppContext'
import { getDaysInYear, formatPublicHolidays, getWeekends } from './functions/functions'
import { Country } from './types/SupportedCountries'
import { PublicHoliday, PublicHolidaySlice } from './types/PublicHoliday'
import { IpApi } from './types/IpApi'

const HOLIDAY_API = 'https://date.nager.at/api/v3'

/**
 * Fetches JSON and turns non-2xx responses into errors, since fetch only rejects on network failure.
 */
async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url)
	if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`)
	return response.json() as Promise<T>
}

/**
 * Looks up the visitor's country from their IP address via two third-party services.
 */
async function detectCountryByIp(): Promise<string> {
	const { ip } = await fetchJson<{ ip: string }>('https://api.ipify.org?format=json')
	const location = await fetchJson<IpApi>(`https://ipapi.co/${ip}/json/`)
	return location.country_code
}

/**
 * Guesses the visitor's country from the browser's language settings, e.g. "el-GR" gives "GR".
 * Only a fallback: many people run an English (US) system outside the US.
 */
export function detectCountryFromLocale(): string | null {
	const tags = [...(navigator.languages ?? []), navigator.language, Intl.DateTimeFormat().resolvedOptions().locale]

	for (const tag of tags) {
		if (!tag) continue
		try {
			const region = new Intl.Locale(tag).region
			if (region && /^[A-Z]{2}$/.test(region)) return region
		} catch {
			// malformed tag, try the next one
		}
	}
	return null
}

export default function App() {
	const [year] = useState<number>(new Date().getFullYear())
	const [supportedCountries, setSupportedCountries] = useState<Country[]>([])
	const [countryCode, setCountryCode] = useState<string>('')
	const [publicHolidays, setPublicHolidays] = useState<PublicHolidaySlice[]>([])
	const [holidayStatus, setHolidayStatus] = useState<HolidayStatus>('idle')
	const [loadError, setLoadError] = useState<string | null>(null)

	// Derived from the year alone, so no state or effect is needed
	const daysInYear = useMemo(() => getDaysInYear(year), [year])
	const weekends = useMemo(() => getWeekends(year), [year])

	// Bootstrap, once: the country list and the default country
	useEffect(() => {
		let ignore = false

		fetchJson<Country[]>(`${HOLIDAY_API}/AvailableCountries`)
			.then((countries) => {
				if (!ignore) setSupportedCountries(countries)
			})
			.catch((error: unknown) => {
				console.error(error)
				if (!ignore) setLoadError('We could not load the list of supported countries. Please try again later.')
			})

		// Stored choice first, then IP geolocation, then the browser locale; otherwise the user picks manually
		const storedCountryCode = localStorage.getItem('countryCode')
		if (storedCountryCode) {
			setCountryCode(storedCountryCode)
		} else {
			detectCountryByIp()
				.catch((error: unknown) => {
					console.error(error)
					return detectCountryFromLocale()
				})
				.then((code) => {
					if (!ignore && code) setCountryCode(code)
				})
		}

		return () => {
			ignore = true
		}
	}, [])

	// Holidays, whenever the country (or year) changes: this year plus next, so 1 January can bridge the year end
	useEffect(() => {
		if (!countryCode) return
		let ignore = false

		setHolidayStatus('loading')
		setLoadError(null)

		Promise.all([year, year + 1].map((y) => fetchJson<PublicHoliday[]>(`${HOLIDAY_API}/PublicHolidays/${y}/${countryCode}`)))
			.then((perYear) => {
				if (ignore) return
				setPublicHolidays(formatPublicHolidays(perYear.flat(), year))
				setHolidayStatus('ready')
			})
			.catch((error: unknown) => {
				if (ignore) return
				console.error(error)
				setPublicHolidays([])
				setHolidayStatus('error')
				setLoadError(`We could not load the public holidays for ${countryCode}. Please try another country or try again later.`)
			})

		return () => {
			ignore = true
		}
	}, [countryCode, year])

	const contextValue: AppContextValue = {
		year,
		countryCode,
		setCountryCode,
		daysInYear,
		weekends,
		supportedCountries,
		publicHolidays,
		holidayStatus,
		loadError
	}

	return (
		<AppContext.Provider value={contextValue}>
			<main className="relative min-h-screen overflow-hidden bg-background pb-6">
				<Header />
				<Content />
				<BlurBackground />
			</main>
		</AppContext.Provider>
	)
}
