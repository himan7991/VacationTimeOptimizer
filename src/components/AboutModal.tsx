import { AnimatePresence, motion } from 'framer-motion'
import { TbBeach } from 'react-icons/tb'

export default function SpringModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (arg: boolean) => void }) {
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
						className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
					>
						<TbBeach className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
						<div className="relative z-10">
							<div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-primary grid place-items-center mx-auto">
								<TbBeach />
							</div>
							<h3 className="text-3xl font-bold text-center mb-2">What's this all about?</h3>
							<p className="text-center mb-6">
								Vacation Time Optimizer is a web application that helps you determine the optimal time to use your paid time off (PTO)
							</p>
							<div className="flex gap-2">
								<button
									onClick={() => setIsOpen(false)}
									className="bg-white hover:opacity-90 transition-opacity text-primary font-semibold w-full py-2 rounded"
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
