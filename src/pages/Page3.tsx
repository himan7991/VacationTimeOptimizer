import { motion } from 'framer-motion'
import { useState } from 'react'
import CalendarDay from '../components/CalendarDay'
import { useAppContext } from '../context/AppContext'
import { addDays, countHolidays, countWeekends, dayNumber, MONTH_NAMES } from '../functions/functions'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { getBestOverallDays } from '../functions/getBestDays'
import { getBestConsecutiveDays } from '../functions/getBestConsecutiveDays'
import ModeToggle from '../components/toggles/ToggleMode'
import { VacationPlan } from '../types/VacationPlan'

export default function Page3() {
	const [mode, setMode] = useState('consecutive') // 'consecutive' or 'best'
	const [ptoDays, setPtoDays] = useState<number>(3)

	const handleThemeChange = (_mode: string) => {
		localStorage.setItem('mode', _mode)
		setMode(_mode)
	}

	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

	const { supportedCountries, countryCode, weekends, publicHolidays, window, shiftWindowStart, canShiftWindowStart } = useAppContext()
	const todayNumber = dayNumber(window, new Date())
	const countryName = supportedCountries.find((c) => c.countryCode === countryCode)?.name ?? 'your country'
	const publicHolidaysNumbers: number[] = publicHolidays.map((p) => p.date)
	// Counts are limited to the window; the lists also carry a few days past its end for bridging
	const holidays = countHolidays(publicHolidays, weekends, window.length)

	/**
	 * Label for a holiday: the local name, plus the English name when it differs ("Πρωτοχρονιά (New Year's Day)").
	 */
	const holidayLabel = (day: number) => {
		const holiday = publicHolidays.find((p) => p.date === day)
		if (!holiday) return ''
		const sameName = holiday.localName.trim().toLowerCase() === holiday.name.trim().toLowerCase()
		return sameName ? holiday.localName : `${holiday.localName} (${holiday.name})`
	}
	const weekendsInWindow = countWeekends(weekends, window.length)
	const windowDays: number[] = Array.from({ length: window.length }, (_, index) => index + 1)
	const workingDays: number[] = windowDays.filter((day) => !weekends.includes(day) && !publicHolidaysNumbers.includes(day) && day > todayNumber)

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
		<motion.div id="page3" className="grid h-full w-full grid-cols-[1fr_2fr] items-center justify-center p-4 xl:gap-8" layoutId="pages">
			<div className="relative mb-6 flex w-full flex-col items-center justify-center gap-1 md:flex-row md:justify-around md:gap-8 xl:mb-0 xl:flex-1 xl:flex-col">
				<div className="mb-4 flex flex-col items-center xl:mb-0">
					<h2 className="mb-4 text-center text-6xl font-bold text-copy">Overview</h2>
					<p className="text-center text-copy">
						We found <span className="font-semibold text-primary">{holidaysInWindow} public holidays</span> in {countryName},<br />
						<span className="font-semibold text-error">{weekendsInWindow} weekends</span> and <br />
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
					<div className="flex items-center gap-2 text-copy" role="group" aria-label="Planning period">
						<button
							type="button"
							className="rounded-md border border-border bg-foreground p-1 text-copy hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
							aria-label="Start one month earlier"
							disabled={!canShiftWindowStart(-1)}
							onClick={() => shiftWindowStart(-1)}
						>
							<IoChevronBack aria-hidden="true" />
						</button>
						<span className="min-w-[11rem] text-center font-semibold" aria-live="polite">
							{window.label}
						</span>
						<button
							type="button"
							className="rounded-md border border-border bg-foreground p-1 text-copy hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
							aria-label="Start one month later"
							disabled={!canShiftWindowStart(1)}
							onClick={() => shiftWindowStart(1)}
						>
							<IoChevronForward aria-hidden="true" />
						</button>
						, we found:
					</p>
					<p className="w-[60ch] text-center text-sm text-copy">
						<span className="font-semibold text-primary">{holidays.total} public holidays</span>
						{holidays.total > 0 && <span className="text-copy-light"> ({holidays.onWeekdays} on weekdays)</span>},<br />
						<span className="font-semibold text-error">{weekendsInWindow} weekends</span> and <br />
						<span className="font-semibold">{workingDays.length} working days</span> ahead
					</p>
				</div>
				<label className="flex items-center gap-2 text-copy" htmlFor="pto-days">
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
				<div className="flex items-center text-copy" role="group" aria-label="Planning period">
					<button
						type="button"
						className="rounded-md border border-border bg-foreground p-1 text-copy hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Start one month earlier"
						disabled={!canShiftWindowStart(-1)}
						onClick={() => shiftWindowStart(-1)}
					>
						<IoChevronBack aria-hidden="true" />
					</button>
					<span className="min-w-[11rem] text-center font-semibold" aria-live="polite">
						{window.label}
					</span>
					<button
						type="button"
						className="rounded-md border border-border bg-foreground p-1 text-copy hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Start one month later"
						disabled={!canShiftWindowStart(1)}
						onClick={() => shiftWindowStart(1)}
					>
						<IoChevronForward aria-hidden="true" />
					</button>
				</div>
				<ModeToggle mode={mode} handleModeChange={handleThemeChange} />
				<p className="text-center text-sm text-copy">
					You&apos;re getting <span className="font-semibold">{plan.daysOff} days</span> of vacation <br />
					with just <span className="border-b border-primary font-semibold">{plan.ptoDays.length} days of PTO</span>!
				</p>
			</div>

			<div className="xl:flex-2 grid grid-cols-1 gap-4 justify-self-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{Array.from({ length: 12 }, (_, m) => {
					const monthStart = new Date(window.startYear, window.startMonth - 1 + m, 1)
					const daysInMonth = addDays(new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1), -1).getDate()
					const firstDayNumber = dayNumber(window, monthStart)
					// Monday-first grid: number of blank cells before the 1st
					const emptyDays = Array((monthStart.getDay() + 6) % 7).fill(null)
					// Show the year on the first card and whenever a new calendar year begins
					const showYear = m === 0 || monthStart.getMonth() === 0
					const monthLabel = showYear
						? `${MONTH_NAMES[monthStart.getMonth()]} ${monthStart.getFullYear()}`
						: MONTH_NAMES[monthStart.getMonth()]

					return (
						<div
							className="grid h-64 w-64 grid-cols-7 gap-x-1 rounded-xl border border-border bg-foreground p-4 shadow-md"
							key={firstDayNumber}
						>
							<h2 className="col-span-7 mb-2 font-semibold text-copy">{monthLabel}</h2>

							<div className="col-span-7 grid grid-cols-7 text-center">
								{weekdays.map((day, i) => (
									<p className={day === 'S' ? 'text-error' : 'text-copy'} key={i}>
										{day}
									</p>
								))}
							</div>

							{emptyDays.map((_, index) => (
								<span className="h-7 w-7" key={`empty-${index}`} aria-hidden="true" />
							))}

							{Array.from({ length: daysInMonth }, (_, i) => {
								const day = firstDayNumber + i
								return (
									<CalendarDay
										index={day}
										inDisplay={i + 1}
										isPast={day < todayNumber}
										isToday={day === todayNumber}
										isWeekend={weekends.includes(day)}
										isPublicHoliday={publicHolidaysNumbers.includes(day)}
										isBestDay={bestDaySet.has(day)}
										title={holidayLabel(day)}
										key={day}
									/>
								)
							})}
						</div>
					)
				})}
			</div>
		</motion.div>
	)
}
