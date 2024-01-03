import { PublicHoliday } from '../types/PublicHoliday'

export function getDaysInYear(year: number) {
	return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365
}

export function getWeekends(year: number) {
	const weekends: number[] = []

	for (let day = 1; day <= getDaysInYear(year); day++) {
		const currentDate = new Date(year, 0, day)
		const dayOfWeek = currentDate.getDay()

		if (dayOfWeek === 0 || dayOfWeek === 6) {
			weekends.push(day)
		}
	}

	return weekends.sort((a, b) => a - b)
}

function daysIntoYear(date: Date) {
	return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
}

export function getPublicHolidays(holidays: PublicHoliday[]) {
	const _holidays: number[] = []

	holidays.map((h) => {
		_holidays.push(daysIntoYear(new Date(h.date)))
	})

	return _holidays.filter((h, index) => _holidays.indexOf(h) === index)
}
