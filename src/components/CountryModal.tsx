import { AnimatePresence, motion } from 'framer-motion'
import { FaGlobeEurope } from 'react-icons/fa'
import { supportedCountries } from '../constants/SupportedCountries'
import { useContext } from 'react'
import AppContext from '../context/AppContext'
import { GITHUB } from '../constants/links'

export default function CountryModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (arg: boolean) => void }) {
	const { countryCode } = useContext(AppContext)
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setIsOpen(false)}
					className="fixed inset-0 z-50 grid cursor-pointer place-items-center overflow-y-scroll bg-background/30 p-8 backdrop-blur"
				>
					<motion.div
						initial={{ scale: 0, rotate: '12.5deg' }}
						animate={{ scale: 1, rotate: '0deg' }}
						exit={{ scale: 0, rotate: '0deg' }}
						onClick={(e) => e.stopPropagation()}
						className="relative w-full max-w-6xl cursor-default overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-xl"
					>
						<FaGlobeEurope className="absolute -left-24 -top-24 z-0 rotate-12 text-[250px] text-white/10" />
						<div className="relative z-10 flex flex-col gap-4">
							<div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-3xl text-primary">
								<FaGlobeEurope />
							</div>
							<h3 className="text-center text-3xl font-bold">Select your country</h3>
							<p className="text-center font-semibold">
								Vacation Time Optimizer supports over 100 countries! Choose yours below. <br />
							</p>
							<div className="mb-4 grid grid-cols-10 items-center gap-2">
								{supportedCountries
									.sort((a, b) => a.name.localeCompare(b.name))
									.map((c, i) => (
										<p
											className={`cursor-pointer text-center hover:underline ${
												c.countryCode === countryCode ? 'underline' : ''
											}`}
											key={i}
										>
											{c.name}
										</p>
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
							<p className="text-center text-sm">
								We're sorry if you don't see yours 😔 Feel free to submit a ticket on{' '}
								<a href={GITHUB} className="text-white underline hover:text-primary-light">
									GitHub
								</a>{' '}
								and we'll get right on it
							</p>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
