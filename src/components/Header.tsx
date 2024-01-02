import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FaGlobeEurope } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import SpringModal from './AboutModal'

export default function Header() {
	const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false)

	const buttonVariant = {
		initial: { y: 0, opacity: 0 },
		hover: { y: -25, opacity: 1 }
	}

	// Define the transition for the buttons
	const buttonTransition = {
		type: 'spring',
		stiffness: 300,
		damping: 20
	}

	return (
		<>
			<header className="py-4 px-[5%] z-10 flex justify-between items-center absolute top-0 inset-x-0">
				<h2 className="text-copy font-bold text-2xl">HS.</h2>
				<div className="flex gap-4">
					<motion.div className="overflow-hidden flex flex-col h-6" whileHover="hover">
						<motion.button
							className="text-copy font-semibold"
							onClick={() => setIsAboutOpen(true)}
							key={1}
							variants={buttonVariant}
							transition={buttonTransition}
						>
							About
						</motion.button>
						<motion.button
							className="text-primary font-semibold"
							onClick={() => setIsAboutOpen(true)}
							key={2}
							variants={buttonVariant}
							transition={buttonTransition}
						>
							About
						</motion.button>
					</motion.div>

					<motion.div className="overflow-hidden flex flex-col h-6" whileHover="hover">
						<motion.a
							href="https://github.com/himan7991/VacationTimeOptimizer"
							className="text-copy flex items-center gap-2 font-semibold"
							key={1}
							variants={buttonVariant}
							transition={buttonTransition}
						>
							Contribute <FaGithub />
						</motion.a>
						<motion.a
							href="https://github.com/himan7991/VacationTimeOptimizer"
							className="text-primary flex items-center gap-2 font-semibold"
							key={1}
							variants={buttonVariant}
							transition={buttonTransition}
						>
							Contribute <FaGithub />
						</motion.a>
					</motion.div>

					<button className="text-copy border-b-[1px] border-transparent hover:text-primary">
						<FaGlobeEurope />
					</button>
				</div>
			</header>

			<SpringModal isOpen={isAboutOpen} setIsOpen={setIsAboutOpen} />
		</>
	)
}
