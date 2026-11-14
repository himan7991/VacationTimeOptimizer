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
	const textColor = () => {
		if (index < today) return 'text-copy-lighter'
		if (index === today) return 'text-copy-lighter border-b-copy-lighter'
		if (isPublicHoliday) return 'text-primary'
		if (isWeekend) return 'text-red-500'
		if (isBestDay) return 'text-emerald-500 border-emerald-500'
		return 'text-copy'
	}

	const className = twMerge('border-b border-transparent text-center', textColor())

	if (!isPublicHoliday || !title) {
		return <p className={className}>{inDisplay}</p>
	}

	const tooltipId = `holiday-${index}`

	return (
		<span className="relative">
			<button
				type="button"
				className={twMerge(className, 'w-full cursor-pointer rounded-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary')}
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
