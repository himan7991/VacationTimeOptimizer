import { FaGithub } from 'react-icons/fa'

export default function Header() {
	return (
		<header className="py-4 px-[5%] flex justify-between items-center">
			<h2 className="text-copy font-bold text-2xl">HS.</h2>
			<div className="flex gap-4 [&>a]:font-semibold">
				<a href="#" className="text-copy border-b-[1px] border-transparent hover:border-copy">
					About
				</a>
				<a
					href="https://github.com/himan7991/VacationTimeOptimizer"
					className="text-copy flex items-center gap-1 border-b-[1px] border-transparent hover:border-copy"
				>
					Contribute <FaGithub />
				</a>
			</div>
		</header>
	)
}
