// from https://date.nager.at/swagger/index.html
export type PublicHoliday = {
	date: string
	localName: string
	name: string
	countryCode: string
	fixed: boolean
	global: boolean
	counties: null
	launchYear: null
	types: [string]
}
