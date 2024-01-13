import { useState } from 'react'
import { daysIntoYear } from '../functions/functions'
import { twMerge } from 'tailwind-merge'

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
