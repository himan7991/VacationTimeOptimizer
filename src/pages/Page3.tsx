import { motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import CalendarDay from '../components/CalendarDay'
import AppContext from '../context/AppContext'
import { daysIntoYear } from '../functions/functions'
import { supportedCountries } from '../constants/SupportedCountries'
import { getBestDaysToTakeOff } from '../functions/getBestDays'
import { getBestConsecutiveDays } from '../functions/getBestConsecutiveDays'
import ModeToggle from '../components/ModeToggle'

export default function Page3() {
	let count = 0
	const [mode, setMode] = useState('best')
	const [range, setRange] = useState<number>(3)

	const handleThemeChange = (_mode: string) => {
		localStorage.setItem('mode', _mode)
		setMode(_mode)
	}

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

	const { countryCode, daysInYear, weekends, publicHolidays, year } = useContext(AppContext)
	const daysInYearArr: number[] = Array.from({ length: daysInYear }, (_, index) => index + 1)
	const workingDays: number[] = daysInYearArr.filter(
		(day) => !weekends.includes(day) && !publicHolidays.includes(day) && day > daysIntoYear(new Date())
	)

	const bestDays: number[] =
		mode === 'best'
			? getBestDaysToTakeOff(workingDays, range, weekends, publicHolidays)
			: getBestConsecutiveDays(workingDays, range, weekends, publicHolidays)

	useEffect(() => {
		console.log('update')
	}, [countryCode])

	return (
		<motion.div
			id="page3"
			className="flex h-full w-full flex-col items-center justify-start overflow-scroll p-4 xl:flex-row xl:justify-center xl:gap-8 xl:overflow-hidden"
			layoutId="pages"
		>
			<div className="relative mb-6 flex w-full flex-col items-center justify-center gap-1 md:flex-row md:justify-around md:gap-8 xl:mb-0 xl:flex-1 xl:flex-col">
				<div className="mb-4 flex flex-col items-center xl:mb-0">
					<h2 className="mb-4 text-center text-6xl font-bold text-copy">Overview</h2>
					{/* <p className="max-w-[40ch] text-center text-copy">
						Days in <span className="text-primary font-semibold">purple</span> are the public holidays in {year}, while days in{' '}
						<span className="text-error font-semibold">red</span> are the weekends.
					</p> */}
					<p className="text-center text-copy">
						We found <span className="font-semibold text-primary">{publicHolidays.length} public holidays</span> in{' '}
						{supportedCountries.filter((c) => c.countryCode === countryCode)[0].name},{' '}
						<span className="font-semibold text-error">{Math.floor(weekends.length / 2)} weekends</span> and <br />
						<span className="font-semibold">{workingDays.length - 1} working days</span> ahead
					</p>
				</div>
				<div className="right-4 top-4 flex flex-col items-center">
					<div className="mb-2 flex items-center gap-2">
						<input
							type="range"
							min={1}
							max={30}
							value={range}
							className="w-32 accent-primary"
							onChange={(event) => setRange(Number(event.target.value))}
						/>
						<span className="text-copy">{range}</span>
					</div>
					<ModeToggle mode={mode} handleModeChange={handleThemeChange} />
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
											isPublicHoliday={publicHolidays.includes(j + 1)}
											isBestDay={bestDays.includes(j + 1)}
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
