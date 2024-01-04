import { useState } from 'react'
import Page1 from '../pages/Page1'
import Page2 from '../pages/Page2'
import Page3 from '../pages/Page3'
import { motion, AnimatePresence } from 'framer-motion'

export default function Content() {
	const [page, setPage] = useState<number>(1)

	const variants = {
		hidden: { opacity: 0, x: '100vw' },
		visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.83, 0, 0.17, 1] } },
		exit: { opacity: 0, x: '-100vw', transition: { duration: 0.5, ease: [0.83, 0, 0.17, 1] } }
	}
	return (
		<div className="absolute inset-x-[5%] inset-y-16 z-[2] mx-auto flex h-[calc(100vh-6rem)] w-[calc(100vw-10%)] flex-col items-center justify-center rounded-2xl bg-foreground/75 shadow-2xl sm:inset-x-[2.5%] lg:overflow-hidden">
			<AnimatePresence mode="wait">
				{page === 1 && (
					<motion.div
						key="page1"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={variants}
						className="flex h-full w-full items-center justify-center"
					>
						<Page1 goto={setPage} />
					</motion.div>
				)}

				{page === 2 && (
					<motion.div
						key="page2"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={variants}
						className="relative flex h-full w-full items-center justify-center"
					>
						<Page2 goto={setPage} />
					</motion.div>
				)}

				{page === 3 && (
					<motion.div key="page3" initial="hidden" animate="visible" exit="exit" variants={variants} className="h-full w-full">
						<Page3 />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
