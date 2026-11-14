/** Google Analytics 4 measurement ID for the public site */
export const GA_MEASUREMENT_ID = 'G-WWPQ10SESX'

export type AnalyticsConsent = 'granted' | 'denied'

const STORAGE_KEY = 'analyticsConsent'

/**
 * Reads the visitor's stored choice, or null if they have not been asked yet
 */
export function getStoredConsent(): AnalyticsConsent | null {
	const value = localStorage.getItem(STORAGE_KEY)
	return value === 'granted' || value === 'denied' ? value : null
}

/**
 * Remembers the visitor's choice so the banner is not shown again
 */
export function storeConsent(consent: AnalyticsConsent) {
	localStorage.setItem(STORAGE_KEY, consent)
}

/**
 * Injects the Google Analytics tag. Only called after the visitor has granted consent,
 * so no cookies are set and nothing is sent to Google before that. Safe to call more than once.
 */
export function loadAnalytics() {
	if (document.getElementById('ga-script')) return

	const script = document.createElement('script')
	script.id = 'ga-script'
	script.async = true
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
	document.head.appendChild(script)

	type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
	const w = window as GtagWindow
	w.dataLayer = w.dataLayer ?? []
	w.gtag = function gtag(...args: unknown[]) {
		w.dataLayer?.push(args)
	}
	w.gtag('js', new Date())
	w.gtag('config', GA_MEASUREMENT_ID)
}
