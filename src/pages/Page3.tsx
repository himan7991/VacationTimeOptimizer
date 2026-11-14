import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import CalendarDay from '../components/CalendarDay'
import { useAppContext } from '../context/AppContext'
import { addDays, countHolidays, countWeekends, dayNumber, MONTH_NAMES } from '../functions/functions'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { getBestOverallDays } from '../functions/getBestDays'
import { getBestConsecutiveDays } from '../functions/getBestConsecutiveDays'
import ModeToggle from '../components/toggles/ToggleMode'
import { VacationPlan } from '../types/VacationPlan'

export default function Page3() {
	// 'consecutive' or 'best'; the last choice is remembered across visits
	const [mode, setMode] = useState(() => (localStorage.getItem('mode') === 'best' ? 'best' : 'consecutive'))
	const [ptoDays, setPtoDays] = useState<number>(3)
	// Working days the user insists on taking off; day numbers are window-relative, so they reset with the window
	const [pinnedDays, setPinnedDays] = useState<number[]>([])

	const handleThemeChange = (_mode: string) => {
		localStorage.setItem('mode', _mode)
		setMode(_mode)
	}

	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

	const { supportedCountries, countryCode, weekends, publicHolidays, window, shiftWindowStart, canShiftWindowStart, openCountryModal } =
		useAppContext()
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

	useEffect(() => setPinnedDays([]), [window, countryCode])

	const workingDaySet = new Set(workingDays)
	const pinned = pinnedDays.filter((day) => workingDaySet.has(day)).sort((a, b) => a - b)
	const pinnedSet = new Set(pinned)
	const togglePin = (day: number) => setPinnedDays((days) => (days.includes(day) ? days.filter((d) => d !== day) : [...days, day]))

	// Pins raise the floor: overall mode needs one PTO day per pin, consecutive mode must cover the span between them
	const pinnedSpan = pinned.length ? workingDays.indexOf(pinned[pinned.length - 1]) - workingDays.indexOf(pinned[0]) + 1 : 0
	const minPtoDays = mode === 'best' ? pinned.length : pinnedSpan
	const maxPtoDays = Math.max(1, workingDays.length)
	const requestedDays = Math.min(Math.max(ptoDays, minPtoDays), maxPtoDays)

	const planFor = (days: number): VacationPlan =>
		mode === 'best'
			? getBestOverallDays(workingDays, days, weekends, publicHolidaysNumbers, pinned)
			: getBestConsecutiveDays(workingDays, days, weekends, publicHolidaysNumbers, pinned)

	const plan = planFor(requestedDays)
	const bestDaySet = new Set(plan.ptoDays)

	// What one more PTO day would buy, shown as a nudge when it unlocks more than just itself
	const nextPlan = requestedDays < maxPtoDays ? planFor(requestedDays + 1) : null
	const nextGain = nextPlan ? nextPlan.daysOff - plan.daysOff : 0

	const handlePtoDaysChange = (value: string) => {
		const parsed = parseInt(value, 10)
		if (Number.isNaN(parsed)) return
		setPtoDays(Math.min(Math.max(1, parsed), maxPtoDays))
	}

	return (
		<motion.div id="page3" className="grid h-full w-full grid-cols-[1fr_2.5fr] items-center justify-center p-4 xl:gap-8" layoutId="pages">
			<div className="relative flex w-full flex-col items-center justify-center gap-1 md:flex-row md:justify-around md:gap-4 xl:flex-1 xl:flex-col">
				<h1 className="text-center text-6xl font-bold text-copy">Overview</h1>
				<div className="text-center">
					<p className="text-copy">
						In{' '}
						<button
							type="button"
							className="rounded-sm underline hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
							aria-label={`Change country, currently ${countryName}`}
							onClick={openCountryModal}
						>
							{countryName}
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
						aria-label="Shift start one month earlier"
						title="Shift start one month earlier"
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
						aria-label="Shift start one month later"
						title="Shift start one month later"
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
				<p className="text-center text-xs text-copy-light" aria-live="polite">
					{pinned.length === 0 ? (
						'Click a working day to pin it as a must-take PTO day.'
					) : (
						<>
							<span className="font-semibold text-copy">{pinned.length} pinned</span> {pinned.length === 1 ? 'day' : 'days'} included in
							the plan.{' '}
							<button
								type="button"
								className="rounded-sm font-semibold text-primary underline hover:text-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
								onClick={() => setPinnedDays([])}
							>
								Clear
							</button>
						</>
					)}
				</p>
				<p className={`text-center text-xs text-copy-light ${nextPlan && nextGain > 1 ? 'visible' : 'invisible'}`} aria-live="polite">
					Tip: one more PTO day would get you <span className="font-semibold text-copy">{nextPlan?.daysOff} days</span> off (+{nextGain}).{' '}
					<button
						type="button"
						className="rounded-sm font-semibold text-primary underline hover:text-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
						onClick={() => setPtoDays(requestedDays + 1)}
					>
						Use {requestedDays + 1} days
					</button>
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
										isPinned={pinnedSet.has(day)}
										onTogglePin={workingDaySet.has(day) ? () => togglePin(day) : undefined}
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
