import { AnimatePresence, motion } from 'framer-motion'
import { FaGlobeEurope } from 'react-icons/fa'
import { useContext, useEffect } from 'react'
import AppContext from '../../context/AppContext'

/**
 * Renders a modal for selecting a country.
 */

export default function CountryModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (arg: boolean) => void }) {
	const { supportedCountries, countryCode, setCountryCode } = useContext(AppContext)

	const COLUMNS = 6
	const GROUPS = Math.ceil(supportedCountries.length / COLUMNS)
	const countryGroups = [...Array(COLUMNS)].map((_, i) => supportedCountries.slice(i * GROUPS, (i + 1) * GROUPS))

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
						className="relative w-full max-w-7xl cursor-default rounded-lg bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-xl"
					>
						<FaGlobeEurope className="absolute -left-24 -top-24 z-0 rotate-12 text-[250px] text-white/10" />
						<div className="relative z-10 flex flex-col gap-4">
							<div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-3xl text-primary">
								<FaGlobeEurope />
							</div>
							<h3 className="text-center text-3xl font-bold">Select your country</h3>
							<p className="text-center font-semibold"> Vacation Time Optimizer supports over 100 countries! Choose yours below </p>
							<div className="mb-4 grid grid-cols-1 place-items-center md:place-items-start items-center gap-2 md:grid-cols-3 lg:grid-cols-6">
								{/* <div className="mb-4 max-h-40 grid-flow-col-dense"> */}
								{/* {supportedCountries
									.sort((a, b) => a.name.localeCompare(b.name))
									.map((c, i) => (
										<p
											className={`w-fit cursor-pointer text-center hover:underline ${c.countryCode === countryCode ? 'underline' : ''}`}
											key={i}
											onClick={() => {
												setCountryCode(c.countryCode)
												localStorage.setItem('countryCode', c.countryCode)
											}}
										>
											{c.name}
										</p>
									))} */}
								{countryGroups.map((group, i) => (
									<div className="flex flex-col gap-2 items-center md:items-start" key={i}>
										{group.map((c, j) => (
											<p
												className={`w-fit cursor-pointer hover:underline ${c.countryCode === countryCode ? 'underline' : ''}`}
												key={j}
												onClick={() => {
													setCountryCode(c.countryCode)
													localStorage.setItem('countryCode', c.countryCode)
												}}
											>
												{c.name}
											</p>
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
								We're sorry if you don't see your country on the list 😔 Vacation Time Optimizer is powered by{' '}
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
