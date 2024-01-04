import { AnimatePresence, motion } from 'framer-motion'
import { TbBeach } from 'react-icons/tb'

export default function AboutModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (arg: boolean) => void }) {
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
						className="relative w-full max-w-lg cursor-default overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-xl"
					>
						<TbBeach className="absolute -left-24 -top-24 z-0 rotate-12 text-[250px] text-white/10" />
						<div className="relative z-10">
							<div className="mx-auto mb-2 grid h-16 w-16 place-items-center rounded-full bg-white text-3xl text-primary">
								<TbBeach />
							</div>
							<h3 className="mb-2 text-center text-3xl font-bold">What's this all about?</h3>
							<p className="mb-6 text-center">
								Vacation Time Optimizer is a web application that helps you determine the optimal time to use your paid time off (PTO)
							</p>
							<div className="flex gap-2">
								{/* todo: show the "tutorial" again -- reset local storage "tutorial" from 'passed' and show the first two screens again */}
								<button
									onClick={() => setIsOpen(false)}
									className="w-full rounded bg-transparent py-2 font-semibold text-white transition-colors hover:bg-white/10"
								>
									Show tutorial again
								</button>
								<button
									onClick={() => setIsOpen(false)}
									className="w-full rounded bg-white py-2 font-semibold text-primary transition-opacity hover:opacity-90"
								>
									Awesome!
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
