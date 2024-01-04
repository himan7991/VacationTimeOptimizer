import { motion } from 'framer-motion'

export default function Page1({ goto }: { goto: (arg: number) => void }) {
	return (
		<motion.div id="page1" layoutId="pages">
			<div className="px-[5%] text-center">
				<h1 className="text-4xl font-bold tracking-tight text-copy sm:text-6xl">Vacation Time Optimizer</h1>
				<p className="mt-6 text-lg leading-8 text-copy-light">
					Optimize your time, maximize your escape: find the perfect moment for your getaway
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<button
						onClick={() => goto(2)}
						className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						Get started
					</button>
					{/* <a href="#" className="text-sm font-semibold leading-6 text-copy">
							Learn more <span aria-hidden="true">→</span>
						</a> */}
				</div>
			</div>
		</motion.div>
	)
}
