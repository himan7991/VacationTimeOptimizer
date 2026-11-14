import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

const TOGGLE_CLASSES = 'text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10'

export default function ModeToggle({ mode, handleModeChange }: { mode: string; handleModeChange: (arg: string) => void }) {
	return (
		<div className="relative flex w-fit items-center rounded-full border border-border">
			<button
				type="button"
				aria-pressed={mode === 'consecutive'}
				className={`${TOGGLE_CLASSES} ${mode === 'consecutive' ? 'text-white' : 'text-copy'}`}
				onClick={() => {
					handleModeChange('consecutive')
				}}
			>
				<span className="relative z-10">Consecutive</span>
			</button>
			<button
				type="button"
				aria-pressed={mode === 'best'}
				className={`${TOGGLE_CLASSES} ${mode === 'best' ? 'text-white' : 'text-copy'}`}
				onClick={() => {
					handleModeChange('best')
				}}
			>
				<span className="relative z-10">Best overall</span>
			</button>
			<div className={`absolute inset-0 z-0 flex ${mode === 'consecutive' ? 'justify-start' : 'justify-end'}`}>
				<motion.span
					layout
					transition={{ type: 'spring', damping: 15, stiffness: 250 }}
					className={twMerge('h-full rounded-full bg-gradient-to-r from-primary to-primary-dark', mode === 'best' ? 'w-[50%]' : 'w-[52%]')}
				/>
			</div>
		</div>
	)
}
