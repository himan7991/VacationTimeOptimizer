import { motion } from 'framer-motion'
import { useContext, useState } from 'react'
import CalendarDay from '../components/CalendarDay'
import AppContext from '../context/AppContext'
import { daysIntoYear } from '../functions/functions'
import { supportedCountries } from '../constants/SupportedCountries'
import ReactSlider from 'react-slider'
import '../styles/Slider.module.css'
import { getBestDaysToTakeOff } from '../functions/getBestDays'
import { getBestConsecutiveDays } from '../functions/getBestConsecutiveDays'
import ModeToggle from '../components/ModeToggle'

export default function Page3() {
	let count = 0
	const [mode, setMode] = useState('best')

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

	const maxVacationDays = 3
	const bestDays: number[] =
		mode === 'best'
			? getBestDaysToTakeOff(workingDays, maxVacationDays, weekends, publicHolidays)
			: getBestConsecutiveDays(workingDays, maxVacationDays, weekends, publicHolidays)

	return (
		<motion.div id="page3" className="w-full p-4 flex flex-col justify-center items-center h-full xl:flex-row" layoutId="pages">
			<div className="flex items-center justify-center relative w-full">
				<div className="flex flex-col items-center mb-4 xl:mb-0">
					<h2 className="text-6xl text-center font-bold text-copy mb-4">Overview</h2>
					{/* <p className="max-w-[40ch] text-center text-copy">
						Days in <span className="text-primary font-semibold">purple</span> are the public holidays in {year}, while days in{' '}
						<span className="text-error font-semibold">red</span> are the weekends.
					</p> */}
					<p className="text-copy text-center">
						We found <span className="font-semibold text-primary">{publicHolidays.length} public holidays</span> in{' '}
						{supportedCountries.filter((c) => c.countryCode === countryCode)[0].name},{' '}
						<span className="font-semibold text-error">{Math.floor(weekends.length / 2)} weekends</span> and <br />
						<span className="font-semibold">{workingDays.length - 1} working days</span> ahead
					</p>

					{/* todo: fix the slider or get a new one */}
				</div>
				{/* <ReactSlider
					renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
					min={0}
					max={25}
					defaultValue={3}
					className="bg-red-200"
					onChange={() => console.log('a')}
					orientation="horizontal"
					withTracks
				/> */}
				<div className="absolute top-4 right-4">
					<ModeToggle mode={mode} handleModeChange={handleThemeChange} />
				</div>
			</div>
			<div className="grid grid-cols-4 gap-4">
				{months.map((month, m) => {
					const monthIndex = m + 1
					const daysInMonth = new Date(year, monthIndex, 0).getDate()
					count += daysInMonth

					const emptyDays = Array(new Date(year, m, 0).getDay()).fill(null)

					return (
						<div className="border border-border p-4 grid grid-cols-7 gap-x-1 rounded-xl bg-foreground h-56 w-56" key={monthIndex}>
							<h2 className="col-span-7 text-copy font-semibold">{month}</h2>

							<div className="grid grid-cols-7 col-span-7 text-center">
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
