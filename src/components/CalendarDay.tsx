import { useState } from 'react'
import { daysIntoYear } from '../functions/functions'

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
		if (isPublicHoliday) return 'text-primary'
		if (isWeekend) return 'text-error'
		if (isBestDay) return 'text-secondary'
		// if (index >= 79 && index <= 83) return 'text-emerald-500' // 10 days in march, 4 pto
		// if (index >= 86 && index <= 90) return 'text-emerald-500' // 8 days in may, 3 pto
		// if (index >= 120 && index <= 126) return 'text-emerald-500' // 9 days in march, 4 pto
		// if (index >= 358 && index <= 362) return 'text-emerald-500' // 9 days in december, 3 pto
		return 'text-copy'
	}

	return (
		<p
			className={`text-center ${textColor()}`}
			key={index}
			title={index.toString()}
			onMouseOver={() => setDisplay(index)}
			onMouseOut={() => setDisplay(inDisplay)}
		>
			{display}
		</p>
	)
}
