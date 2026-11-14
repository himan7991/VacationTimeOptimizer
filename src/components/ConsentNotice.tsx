import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnalyticsConsent, getStoredConsent, loadAnalytics, storeConsent } from '../functions/consent'

/**
 * Asks for consent before loading Google Analytics. Shown once; the choice is remembered in localStorage.
 * Analytics only loads after an explicit "Accept", on this and later visits.
 */
export default function ConsentNotice() {
	const [consent, setConsent] = useState<AnalyticsConsent | null>(() => getStoredConsent())

	useEffect(() => {
		if (consent === 'granted') loadAnalytics()
	}, [consent])

	const choose = (choice: AnalyticsConsent) => {
		storeConsent(choice)
		setConsent(choice)
	}

	const buttonBase = 'rounded-md px-3 py-1.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

	return (
		<AnimatePresence>
			{consent === null && (
				<motion.section
					initial={{ y: 40, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 40, opacity: 0 }}
					transition={{ duration: 0.3 }}
					role="region"
					aria-label="Analytics consent"
					className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-xl border border-border bg-foreground p-4 text-sm text-copy shadow-2xl sm:flex-row sm:justify-between"
				>
					<p className="text-center sm:text-left">
						<span className="font-semibold">Help us improve?</span> We use Google Analytics to see how people use
						the site. You can choose to opt out, but we’d love your help to make it better.
					</p>
					<div className="grid grid-cols-2 flex-shrink-0 gap-2">
						<button type="button" className={`${buttonBase} border border-border text-copy hover:bg-background`} onClick={() => choose('denied')}>
							No, thanks
						</button>
						<button type="button" className={`${buttonBase} bg-primary text-white hover:bg-primary-dark`} onClick={() => choose('granted')}>
							Sure
						</button>
					</div>
				</motion.section>
			)}
		</AnimatePresence>
	)
}
