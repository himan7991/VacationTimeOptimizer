import { motion } from 'framer-motion'
import { useContext } from 'react'
import CalendarDay from '../components/CalendarDay'
import AppContext from '../context/AppContext'
import { daysIntoYear } from '../functions/functions'
import { supportedCountries } from '../constants/SupportedCountries'

export default function Page3() {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
	let count = 0

	const { countryCode, daysInYear, weekends, publicHolidays, year } = useContext(AppContext)
	const daysInYearArr: number[] = Array.from({ length: daysInYear }, (_, index) => index + 1)
	const workingDays: number[] = daysInYearArr.filter(
		(day) => !weekends.includes(day) && !publicHolidays.includes(day) && day >= daysIntoYear(new Date())
	)

	const getBestDaysToTakeOff = (workingDays: number[], maxDays: number): number[] => {
		const sortedWorkingDays = [...workingDays].sort((a, b) => a - b)

		let bestDays: number[] = []
		let currentVacation: number[] = []

		for (let i = 0; i < sortedWorkingDays.length; i++) {
			const currentDay = sortedWorkingDays[i]

			const isNextToPublicHoliday = publicHolidays.includes(currentDay - 1) || publicHolidays.includes(currentDay + 1)

			const includesWeekend = weekends.includes(currentDay - 1) || weekends.includes(currentDay + 1)

			if (isNextToPublicHoliday || includesWeekend) {
				currentVacation.push(currentDay)
			} else {
				if (currentVacation.length > bestDays.length) {
					bestDays = [...currentVacation]
				}
				currentVacation = []
			}
		}

		return bestDays.slice(0, maxDays)
	}

	// Specify the maximum number of days you want to take off
	const maxVacationDays = 4 // Adjust as needed

	const bestDays: number[] = getBestDaysToTakeOff(workingDays, maxVacationDays)
	console.log('🚀 ~ file: Page3.tsx:52 ~ Page3 ~ bestDays:', bestDays)

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
						<span className="font-semibold">{workingDays.length} working days ahead</span>
					</p>
				</div>
			</div>
			<div className="grid grid-cols-4 gap-4">
				{months.map((month, m) => {
					const monthIndex = m + 1
					const daysInMonth = new Date(year, monthIndex, 0).getDate()
					count += daysInMonth

					const emptyDays = Array(new Date(year, m, 0).getDay()).fill(null)

					return (
						<div className="border border-border p-4 grid grid-cols-7 rounded-xl bg-foreground h-56 w-56" key={monthIndex}>
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
