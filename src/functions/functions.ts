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
			if (currentDate > new Date()) {
				weekends.push(day)
			}
		}
	}

	return weekends.sort((a, b) => a - b)
}

export function daysIntoYear(date: Date) {
	return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
}

export function getPublicHolidays(holidays: PublicHoliday[]) {
	const _holidays: number[] = []

	holidays.map((h) => {
		const holidayDate = new Date(h.date)
		const daysIntoYear =
			(Date.UTC(holidayDate.getFullYear(), holidayDate.getMonth(), holidayDate.getDate()) - Date.UTC(holidayDate.getFullYear(), 0, 0)) /
			24 /
			60 /
			60 /
			1000
		if (holidayDate.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
			_holidays.push(daysIntoYear)
		}
	})

	_holidays.push(getDaysInYear(new Date().getFullYear()) + 1) // add 1-Jan-(year+1) to the holidays
	return _holidays.filter((h, index) => _holidays.indexOf(h) === index)
}

export function daysInMonth(month: number, year: number) {
	return new Date(year, month, 0).getDate()
}
