import { useState } from 'react'
import { daysIntoYear } from '../functions/functions'
import { twMerge } from 'tailwind-merge'

/**
 * Renders one day of the calendar. Holidays are buttons that reveal their name on click or focus,
 * so the name is reachable by mouse, touch and keyboard. Other days are plain text.
 *
 * @param {number} inDisplay - The day-of-month number to display
 * @param {boolean} [isWeekend] - Indicates if the day is a weekend
 * @param {boolean} [isPublicHoliday] - Indicates if the day is a public holiday
 * @param {boolean} isBestDay - Indicates if the day is a suggested PTO day
 * @param {number} index - The day-of-year number
 * @param {string} [title] - The holiday name, when the day is a public holiday
 * @return {JSX.Element} The rendered calendar day
 */

/** Same box for every day, whatever element renders it */
const CELL = 'grid h-7 w-7 place-items-center rounded border-b border-transparent text-center leading-none'

export default function CalendarDay({
	inDisplay,
	isWeekend,
	isPublicHoliday,
	isBestDay,
	index,
	title
}: {
	inDisplay: number
	isWeekend?: boolean
	isPublicHoliday?: boolean
	isBestDay: boolean
	index: number
	title?: string
}) {
	const [showName, setShowName] = useState(false)
	const today = daysIntoYear(new Date())

	/**
	 * Returns the appropriate text color based on the current date and other conditions.
	 *
	 * @return {string} The appropriate text color class name.
	 */
	const dayDecoration = () => {
		if (isPast)          return 'text-copy-lighter'
		if (isToday)         return 'text-copy-lighter border-b-copy-lighter'
		if (isPublicHoliday) return 'bg-primary-light font-semibold text-white shadow-md shadow-primary/50'
		if (isWeekend)       return 'text-red-500'
		if (isBestDay)       return 'bg-green-400/90 font-semibold text-white shadow-md shadow-green-300/50'
		return 'text-copy'
	}

	const cellClass = twMerge(CELL, dayDecoration())

	// Holidays are the only interactive days
	if (!isPublicHoliday || !title) {
		return (
			<span className={cellClass}>
				{inDisplay}
				{isBestDay && !isPast && <span className="sr-only">, suggested PTO day</span>}
			</span>
		)
	}

	const tooltipId = `holiday-${index}`

	return (
		<span className="relative">
			<button
				type="button"
				className={twMerge(
					cellClass,
					'cursor-pointer transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'
				)}
				aria-label={`${inDisplay}, public holiday: ${title}`}
				aria-describedby={showName ? tooltipId : undefined}
				onClick={() => setShowName((open) => !open)}
				onBlur={() => setShowName(false)}
				onKeyDown={(event) => event.key === 'Escape' && setShowName(false)}
			>
				{inDisplay}
			</button>
			{showName && (
				<span
					id={tooltipId}
					role="tooltip"
					className="absolute left-1/2 top-full z-20 mt-1 w-max max-w-[12rem] -translate-x-1/2 rounded-md bg-primary px-2 py-1 text-xs text-white shadow-lg"
				>
					{title}
				</span>
			)}
		</span>
	)
}
