import { useState } from 'react'
import { daysIntoYear } from '../functions/functions'
import { twMerge } from 'tailwind-merge'

export default function CalendarDay({
	inDisplay,
	isWeekend,
	isPublicHoliday,
	isBestDay,
	index
}: {
	inDisplay: number
	isWeekend?: boolean
	isPublicHoliday?: boolean
	isBestDay: boolean
	index: number
}) {
	const [display, setDisplay] = useState<number>(inDisplay)

	const textColor = () => {
		if (index < daysIntoYear(new Date())) return 'text-copy-lighter'
		if (index === daysIntoYear(new Date())) return 'text-copy-lighter border-b-copy-lighter'
		if (isPublicHoliday) return 'text-primary'
		if (isWeekend) return 'text-red-500'
		if (isBestDay) return 'text-emerald-500 border-emerald-500'
		return 'text-copy'
	}

	return (
		<p
			className={twMerge('border-b-[1px] border-transparent text-center', textColor())}
			key={index}
			title={index.toString()}
			onMouseOver={() => process.env.NODE_ENV === 'development' && setDisplay(index)}
			onMouseOut={() => process.env.NODE_ENV === 'development' && setDisplay(inDisplay)}
		>
			{display}
		</p>
	)
}
