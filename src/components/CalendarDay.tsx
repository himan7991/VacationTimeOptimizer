import { daysIntoYear } from '../functions/functions'

export default function CalendarDay({
	display,
	isWeekend,
	isPublicHoliday,
	isBestDay,
	index
}: {
	display: number
	isWeekend?: boolean
	isPublicHoliday?: boolean
	isBestDay: boolean
	index: number
}) {
	if (index < daysIntoYear(new Date())) {
		return (
			<p className="text-center text-copy-lighter" key={index}>
				{display}
			</p>
		)
	}

	if (isPublicHoliday) {
		return (
			<p className="text-center text-primary" key={index}>
				{display}
			</p>
		)
	}

	if (isWeekend) {
		return (
			<p className="text-center text-error" key={index}>
				{display}
			</p>
		)
	}

	if (isBestDay) {
		return (
			<p className="text-center text-secondary" key={index}>
				{display}
			</p>
		)
	}

	return (
		<p className="text-center text-copy" key={index}>
			{display}
		</p>
	)
}
