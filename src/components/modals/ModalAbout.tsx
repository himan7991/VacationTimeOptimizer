import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { TbBeach } from 'react-icons/tb'
import CalendarLegend from '../CalendarLegend'

/**
 * Renders the AboutModal component based on the isOpen prop.
 *
 * @param {boolean} isOpen - Specifies whether the modal is open or closed
 * @param {Function} setIsOpen - Function to set the isOpen state
 * @return {JSX.Element} The AboutModal component
 */

export default function AboutModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (arg: boolean) => void }) {
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
					className="fixed inset-0 z-50 grid cursor-pointer place-items-center overflow-y-auto bg-background/30 p-4 backdrop-blur sm:p-8"
				>
					<motion.div
						initial={{ scale: 0, rotate: '12.5deg' }}
						animate={{ scale: 1, rotate: '0deg' }}
						exit={{ scale: 0, rotate: '0deg' }}
						onClick={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true"
						aria-labelledby="about-modal-title"
						className="relative w-full max-w-2xl cursor-default overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-xl"
					>
						<TbBeach className="absolute -left-24 -top-24 z-0 rotate-12 text-[250px] text-white/10" />
						<div className="relative z-10 flex flex-col justify-center gap-4">
							<div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-3xl text-primary">
								<TbBeach />
							</div>
							<h2 id="about-modal-title" className="text-center text-3xl font-bold">
								What is this all about?
							</h2>
							<p className="text-center">
								Vacation Time Optimizer is a user-friendly web application that helps you determine the optimal time to use your paid
								time off (PTO), ensuring you make the most of your leisure days.
							</p>

							<div>
								<p>
									Choose from <span className="font-bold">two modes</span>:
								</p>
								<ul className="list-disc pl-6 marker:text-white">
									<li>
										<span className="font-bold">Best overall days</span>, for maximizing vacation days throughout the year
									</li>
									<li>
										<span className="font-bold">Best consecutive period</span>, for optimal consecutive time off
									</li>
								</ul>
							</div>

							<CalendarLegend />

							<div className="flex gap-2">
								<button
									onClick={() => setIsOpen(false)}
									className="w-full rounded bg-white py-2 font-semibold text-primary transition-opacity hover:opacity-90"
								>
									Awesome!
								</button>
							</div>
							<p className="text-center text-xs">v2.0.5</p>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
