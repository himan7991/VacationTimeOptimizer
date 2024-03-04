import { useState } from 'react'
import { daysIntoYear } from '../functions/functions'
import { twMerge } from 'tailwind-merge'

/**
 * Renders a calendar day component with various visual styles based on the day's properties.
 *
 * @param {number} inDisplay - The number to display for the day
 * @param {boolean} [isWeekend] - Indicates if the day is a weekend
 * @param {boolean} [isPublicHoliday] - Indicates if the day is a public holiday
 * @param {boolean} isBestDay - Indicates if the day is the best day
 * @param {number} index - The index of the day
 * @param {string} [title] - The title to display for the day
 * @return {JSX.Element} The rendered calendar day component
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
	const [display, setDisplay] = useState<number>(inDisplay)

	/**
	 * Returns the appropriate text color based on the current date and other conditions.
	 *
	 * @return {string} The appropriate text color class name.
	 */
	const textColor = () => {
		if (index < daysIntoYear(new Date())) return 'text-copy-lighter'
		if (index === daysIntoYear(new Date())) return 'text-copy-lighter border-b-copy-lighter'
		if (isPublicHoliday) return 'text-primary cursor-pointer'
		if (isWeekend) return 'text-red-500'
		if (isBestDay) return 'text-emerald-500 border-emerald-500'
		return 'text-copy'
	}

	return (
		<p
			className={twMerge('border-b border-transparent text-center', textColor())}
			key={index}
			title={title && title}
			onMouseOver={() => process.env.NODE_ENV === 'development' && setDisplay(index)}
			onMouseOut={() => process.env.NODE_ENV === 'development' && setDisplay(inDisplay)}
			onClick={() => {
				isPublicHoliday && alert(title)
			}}
		>
			{display}
		</p>
	)
}
