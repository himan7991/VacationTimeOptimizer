import { AnimatePresence, motion } from 'framer-motion'
import { FaGlobeEurope } from 'react-icons/fa'
import { supportedCountries } from '../constants/SupportedCountries'
import { useContext } from 'react'
import AppContext from '../context/AppContext'
import { GITHUB } from '../constants/links'

export default function CountryModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (arg: boolean) => void }) {
	const { country } = useContext(AppContext)
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setIsOpen(false)}
					className="bg-background/30 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
				>
					<motion.div
						initial={{ scale: 0, rotate: '12.5deg' }}
						animate={{ scale: 1, rotate: '0deg' }}
						exit={{ scale: 0, rotate: '0deg' }}
						onClick={(e) => e.stopPropagation()}
						className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-lg w-full max-w-6xl shadow-xl cursor-default relative overflow-hidden"
					>
						<FaGlobeEurope className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
						<div className="relative z-10 flex flex-col gap-4">
							<div className="bg-white w-16 h-16 rounded-full text-3xl text-primary grid place-items-center mx-auto">
								<FaGlobeEurope />
							</div>
							<h3 className="text-3xl font-bold text-center">Select your country</h3>
							<p className="text-center font-semibold">
								Vacation Time Optimizer supports over 100 countries! Choose yours below. <br />
							</p>
							<div className="grid grid-cols-10 gap-2 items-center mb-4">
								{supportedCountries.map((c, i) => (
									<p
										className={`text-center cursor-pointer hover:underline ${c.countryCode === country ? 'underline' : ''}`}
										key={i}
									>
										{c.name}
									</p>
								))}
							</div>

							<div className="flex gap-2">
								<button
									onClick={() => setIsOpen(false)}
									className="bg-white hover:opacity-90 transition-opacity text-primary font-semibold w-full py-2 rounded"
								>
									Awesome!
								</button>
							</div>
							<p className="text-center text-sm">
								We're sorry if you don't see yours 😔 Feel free to submit a ticket on{' '}
								<a href={GITHUB} className="text-white hover:text-primary-light underline">
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
