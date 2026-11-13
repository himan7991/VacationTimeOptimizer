import { motion } from 'framer-motion'
import { useState } from 'react'
import CalendarDay from '../components/CalendarDay'
import { useAppContext } from '../context/AppContext'
import { daysIntoYear } from '../functions/functions'
import { getBestOverallDays } from '../functions/getBestDays'
import { getBestConsecutiveDays } from '../functions/getBestConsecutiveDays'
import ModeToggle from '../components/toggles/ToggleMode'
import { VacationPlan } from '../types/VacationPlan'

export default function Page3() {
	let count = 0
	const [mode, setMode] = useState('best')
	const [ptoDays, setPtoDays] = useState<number>(3)

	const handleThemeChange = (_mode: string) => {
		localStorage.setItem('mode', _mode)
		setMode(_mode)
	}

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

	const { supportedCountries, countryCode, daysInYear, weekends, publicHolidays, year } = useAppContext()
	const countryName = supportedCountries.find((c) => c.countryCode === countryCode)?.name ?? 'your country'
	const publicHolidaysNumbers: number[] = publicHolidays.map((p) => p.date)
	// Holidays inside this year; the list may also carry next year's 1 January for bridging
	const holidaysThisYear = publicHolidays.filter((p) => p.date <= daysInYear).length
	const weekendsThisYear = Math.floor(weekends.filter((d) => d <= daysInYear).length / 2)
	const daysInYearArr: number[] = Array.from({ length: daysInYear }, (_, index) => index + 1)
	const workingDays: number[] = daysInYearArr.filter(
		(day) => !weekends.includes(day) && !publicHolidaysNumbers.includes(day) && day > daysIntoYear(new Date())
	)

	const maxPtoDays = Math.max(1, workingDays.length)
	const requestedDays = Math.min(ptoDays, maxPtoDays)

	const plan: VacationPlan =
		mode === 'best'
			? getBestOverallDays(workingDays, requestedDays, weekends, publicHolidaysNumbers)
			: getBestConsecutiveDays(workingDays, requestedDays, weekends, publicHolidaysNumbers)
	const bestDaySet = new Set(plan.ptoDays)

	const handlePtoDaysChange = (value: string) => {
		const parsed = parseInt(value, 10)
		if (Number.isNaN(parsed)) return
		setPtoDays(Math.min(Math.max(1, parsed), maxPtoDays))
	}

	return (
		<motion.div
			id="page3"
			className="flex h-full w-full flex-col items-center justify-start p-4 xl:flex-row xl:justify-center xl:gap-8"
			layoutId="pages"
		>
			<div className="relative mb-6 flex w-full flex-col items-center justify-center gap-1 md:flex-row md:justify-around md:gap-8 xl:mb-0 xl:flex-1 xl:flex-col">
				<div className="mb-4 flex flex-col items-center xl:mb-0">
					<h2 className="mb-4 text-center text-6xl font-bold text-copy">Overview</h2>
					<p className="text-center text-copy">
						We found <span className="font-semibold text-primary">{holidaysThisYear} public holidays</span> in{' '}
						{countryName},<br />
						<span className="font-semibold text-error">{weekendsThisYear} weekends</span> and <br />
						<span className="font-semibold">{workingDays.length} working days</span> ahead
					</p>
				</div>
				<div className="right-4 top-4 flex flex-col items-center gap-2">
					<label className="flex items-center gap-2 text-copy">
						PTO days
						<input
							type="number"
							min={1}
							max={maxPtoDays}
							value={requestedDays}
							className="w-20 rounded-md border border-border bg-foreground px-2 py-1 text-center text-copy accent-primary"
							onChange={(event) => handlePtoDaysChange(event.target.value)}
						/>
					</label>
					<ModeToggle mode={mode} handleModeChange={handleThemeChange} />
					<p className="text-center text-copy">
						You&apos;re getting{' '}
						<span className="font-semibold">{plan.daysOff} days</span>{' '}
						of vacation <br />
						with just <span className="border-b border-primary font-semibold">{plan.ptoDays.length} days of PTO</span>!
					</p>
				</div>
			</div>
			<div className="xl:flex-2 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{months.map((month, m) => {
					const monthIndex = m + 1
					const daysInMonth = new Date(year, monthIndex, 0).getDate()
					count += daysInMonth

					const emptyDays = Array(new Date(year, m, 0).getDay()).fill(null)

					return (
						<div className="grid h-56 w-56 grid-cols-7 gap-x-1 rounded-xl border border-border bg-foreground p-4" key={monthIndex}>
							<h2 className="col-span-7 font-semibold text-copy">{month}</h2>

							<div className="col-span-7 grid grid-cols-7 text-center">
								{weekdays.map((day, i) => (
									<p className={day === 'S' ? 'text-error' : 'text-copy'} key={i}>
										{day}
									</p>
								))}
							</div>

							{emptyDays.map((_, index) => (
								<p key={`empty-${index}`} />
							))}

							{daysInYearArr
								.map((_, j) => {
									return (
										<CalendarDay
											index={j + 1}
											inDisplay={j + 1 + daysInMonth - count}
											isWeekend={weekends.includes(j + 1)}
											isPublicHoliday={publicHolidaysNumbers.includes(j + 1)}
											isBestDay={bestDaySet.has(j + 1)}
											title={
												publicHolidaysNumbers.includes(j + 1)
													? `${publicHolidays[publicHolidaysNumbers.indexOf(j + 1)].localName} (${
															publicHolidays[publicHolidaysNumbers.indexOf(j + 1)].name
														})`
													: ''
											}
											key={j}
										/>
									)
								})
								.slice(monthIndex === 1 ? 0 : count - daysInMonth, count)}
						</div>
					)
				})}
			</div>
		</motion.div>
	)
}
