import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

/**
 * Renders one day of the calendar. Every day sits in the same fixed-size cell so the numbers line up.
 * Holidays are buttons that reveal their name on click or focus. Future working days are buttons
 * that pin or unpin the day as a must-take PTO day. Everything else is plain text and stays out of
 * the Tab order.
 *
 * @param {number} inDisplay - The day-of-month number to display
 * @param {boolean} isPast - The day is before today
 * @param {boolean} isToday - The day is today
 * @param {boolean} [isWeekend] - Indicates if the day is a weekend
 * @param {boolean} [isPublicHoliday] - Indicates if the day is a public holiday
 * @param {boolean} isBestDay - Indicates if the day is a suggested PTO day
 * @param {boolean} [isPinned] - The user has pinned this day as a must-take PTO day
 * @param {() => void} [onTogglePin] - Pins or unpins the day; its presence makes the day clickable
 * @param {number} index - The day number within the planning window, used for element ids
 * @param {string} [title] - The holiday name, when the day is a public holiday
 * @return {JSX.Element} The rendered calendar day
 */

/** Same box for every day, whatever element renders it */
const CELL = 'grid h-7 w-7 place-items-center rounded border-b border-transparent text-center leading-none'
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'

export default function CalendarDay({
	inDisplay,
	isPast,
	isToday,
	isWeekend,
	isPublicHoliday,
	isBestDay,
	isPinned,
	onTogglePin,
	index,
	title
}: {
	inDisplay: number
	isPast: boolean
	isToday: boolean
	isWeekend?: boolean
	isPublicHoliday?: boolean
	isBestDay: boolean
	isPinned?: boolean
	onTogglePin?: () => void
	index: number
	title?: string
}) {
	const [showName, setShowName] = useState(false)

	/**
	 * Returns the colour and emphasis for the day based on the current date and other conditions.
	 *
	 * @return {string} Tailwind class names.
	 */
	// prettier-ignore
	const dayDecoration = () => {
		if (isPast)          return 'text-copy-lighter'
		if (isToday)         return 'text-copy-lighter border-b-copy-lighter'
		if (isPublicHoliday) return 'bg-primary-light font-semibold text-white shadow-md shadow-primary/50'
		if (isWeekend)       return 'text-red-500'
		if (isBestDay)       return 'bg-green-400/90 font-semibold text-white shadow-md shadow-green-300/50'
		return 'text-copy'
	}

	const cellClass = twMerge(CELL, dayDecoration(), isPinned && 'ring-2 ring-primary ring-offset-1 ring-offset-foreground')

	// Holidays: a button that shows the holiday name
	if (isPublicHoliday && title) {
		const tooltipId = `holiday-${index}`

		return (
			<span className="relative">
				<button
					type="button"
					className={twMerge(cellClass, 'cursor-pointer transition-colors hover:underline', FOCUS)}
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

	// Future working days: a toggle that pins the day
	if (onTogglePin) {
		const state = isPinned ? ', pinned' : isBestDay ? ', suggested PTO day' : ''

		return (
			<button
				type="button"
				className={twMerge(cellClass, 'cursor-pointer transition-colors hover:ring-2 hover:ring-primary/50', FOCUS)}
				aria-pressed={Boolean(isPinned)}
				aria-label={`${inDisplay}${state}. ${isPinned ? 'Unpin' : 'Pin as a must-take PTO day'}`}
				onClick={onTogglePin}
			>
				{inDisplay}
			</button>
		)
	}

	// Past days and weekends: plain text
	return (
		<span className={cellClass}>
			{inDisplay}
			{isBestDay && !isPast && <span className="sr-only">, suggested PTO day</span>}
		</span>
	)
}
