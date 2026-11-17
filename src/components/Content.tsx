import { useEffect, useState } from 'react'
import Page1 from '../pages/Page1'
import Page2 from '../pages/Page2'
import Page3 from '../pages/Page3'
import { motion, AnimatePresence } from 'framer-motion'

type PageState = { page?: number } | null

/**
 * The three steps share one URL, so each step is pushed as a history entry. The browser's
 * back and forward buttons then move between steps instead of leaving the site.
 */
export default function Content() {
	const [page, setPage] = useState<number>(1)

	useEffect(() => {
		// A fresh load always starts at step 1; the data for later steps has not loaded yet
		window.history.replaceState({ page: 1 }, '')

		const onPopState = (event: PopStateEvent) => {
			const state = event.state as PageState
			setPage(state?.page ?? 1)
		}
		window.addEventListener('popstate', onPopState)
		return () => window.removeEventListener('popstate', onPopState)
	}, [])

	const goto = (next: number) => {
		window.history.pushState({ page: next }, '')
		setPage(next)
	}

	const variants = {
		hidden: { opacity: 0, x: '100vw' },
		visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.83, 0, 0.17, 1] } },
		exit: { opacity: 0, x: '-100vw', transition: { duration: 0.5, ease: [0.83, 0, 0.17, 1] } }
	}
	return (
		<div className="mx-auto flex h-fit min-h-[calc(100vh-7rem)] w-[calc(100vw-10%)] flex-col items-center justify-center overflow-x-clip rounded-2xl bg-foreground/75 pb-2 shadow-2xl sm:inset-x-[2.5%]">
			<AnimatePresence mode="wait">
				{page === 1 && (
					<motion.div
						key="page1"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={variants}
						className="flex w-full flex-1 items-center justify-center"
					>
						<Page1 goto={goto} />
					</motion.div>
				)}

				{page === 2 && (
					<motion.div
						key="page2"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={variants}
						className="relative flex w-full flex-1 items-center justify-center"
					>
						<Page2 goto={goto} />
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
