import { AnimatePresence, motion } from 'framer-motion'
import { FaGlobeEurope } from 'react-icons/fa'
import { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'

/**
 * Renders a modal for selecting a country.
 */

export default function CountryModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (arg: boolean) => void }) {
	const { supportedCountries, countryCode, setCountryCode } = useAppContext()

	const COLUMNS = 6
	// The API returns countries ordered by ISO code; show them alphabetically by name, column by column
	const sortedCountries = [...supportedCountries].sort((a, b) => a.name.localeCompare(b.name, 'en'))
	const GROUPS = Math.ceil(sortedCountries.length / COLUMNS)
	const countryGroups = [...Array(COLUMNS)].map((_, i) => sortedCountries.slice(i * GROUPS, (i + 1) * GROUPS))

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
		window.addEventListener('keydown', handleKeyPress)

		return () => {
			window.removeEventListener('keydown', handleKeyPress)
		}
	}, [setIsOpen])

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setIsOpen(false)}
					className="fixed inset-0 z-50 grid cursor-pointer overflow-y-scroll bg-background/30 p-8 backdrop-blur lg:place-items-center"
				>
					<motion.div
						// initial={{ scale: 0 }}
						// animate={{ scale: 1 }}
						// exit={{ scale: 0, rotate: '0deg' }}
						onClick={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true"
						aria-labelledby="country-modal-title"
						className="relative w-full max-w-7xl cursor-default rounded-lg bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-xl"
					>
						<FaGlobeEurope className="absolute rotate-12 text-[600px] text-white/5" />
						<div className="relative z-10 flex flex-col gap-4">
							<div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-3xl text-primary">
								<FaGlobeEurope />
							</div>
							<h3 id="country-modal-title" className="text-center text-3xl font-bold">
								Select your country
							</h3>
							<p className="text-center font-semibold"> Vacation Time Optimizer supports over 100 countries! Choose yours below </p>
							<div className="mb-4 grid grid-cols-1 place-items-center items-center gap-2 md:grid-cols-3 md:place-items-start lg:grid-cols-6">
								{countryGroups.map((group, i) => (
									<div className="flex flex-col items-center gap-2 md:items-start" key={i}>
										{group.map((c, j) => (
											<button
												type="button"
												className={`w-fit p-2 text-start leading-5 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
													c.countryCode === countryCode
														? 'w-full rounded-md bg-white text-primary-dark outline-double outline-2 outline-primary-light'
														: ''
												}`}
												key={j}
												aria-pressed={c.countryCode === countryCode}
												onClick={() => {
													setCountryCode(c.countryCode)
													localStorage.setItem('countryCode', c.countryCode)
												}}
											>
												{c.name}
											</button>
										))}
									</div>
								))}
							</div>

							<div className="flex gap-2">
								<button
									onClick={() => setIsOpen(false)}
									className="w-full rounded bg-white py-2 font-semibold text-primary transition-opacity hover:opacity-90"
								>
									Awesome!
								</button>
							</div>
							<p className="text-center text-xs md:text-sm">
								We&apos;re sorry if you don&apos;t see your country on the list 😔 Vacation Time Optimizer is powered by{' '}
								<a href="https://date.nager.at/Country/Coverage" className="text-white underline hover:text-primary-light">
									date.nager
								</a>{' '}
								and their API
							</p>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
