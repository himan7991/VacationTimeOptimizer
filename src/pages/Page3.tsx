import { motion } from 'framer-motion'
import { useContext } from 'react'
import CalendarDay from '../components/CalendarDay'
import AppContext from '../context/AppContext'

export default function Page3() {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
	let count = 0

	const { daysInYear, weekends, publicHolidays, year } = useContext(AppContext)

	return (
		<motion.div id="page3" className="w-full p-4 flex flex-col justify-around items-center h-full xl:flex-row" layoutId="pages">
			<div className="flex flex-col items-center mb-4 xl:mb-0">
				<h2 className="text-6xl text-center font-bold text-copy mb-4">Overview</h2>
				<p className="max-w-[40ch] text-center text-copy">
					Days in <span className="text-primary font-semibold">purple</span> are the public holidays in {year}, while days in{' '}
					<span className="text-error font-semibold">red</span> are the weekends.
				</p>
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

							{[...Array(daysInYear)]
								.map((_, j) => {
									return (
										<CalendarDay
											index={j + 1}
											display={j + 1 + daysInMonth - count}
											isWeekend={weekends.includes(j + 1)}
											isPublicHoliday={publicHolidays.includes(j + 1)}
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
