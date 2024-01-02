import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import SpringModal from './AboutModal'

export default function Header() {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	return (
		<>
			<header className="py-4 px-[5%] z-10 flex justify-between items-center absolute top-0 inset-x-0">
				<h2 className="text-copy font-bold text-2xl">HS.</h2>
				<div className="flex gap-4 [&>a]:font-semibold">
					<button className="text-copy border-b-[1px] border-transparent hover:border-copy" onClick={() => setIsOpen(true)}>
						About
					</button>
					<a
						href="https://github.com/himan7991/VacationTimeOptimizer"
						className="text-copy flex items-center gap-2 border-b-[1px] border-transparent hover:border-copy"
					>
						Contribute <FaGithub />
					</a>
				</div>
			</header>

			<SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	)
}
