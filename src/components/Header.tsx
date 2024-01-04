import { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FaGlobeEurope } from 'react-icons/fa'
import { motion } from 'framer-motion'
import AboutModal from './AboutModal'
import CountryModal from './CountryModal'
import ThemeToggle from './ThemeToggle'
import { GITHUB } from '../constants/links'

export default function Header() {
	const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false)
	const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false)
	const [theme, setTheme] = useState('light')

	const handleThemeChange = (_theme: string) => {
		document.body.classList.remove('dark', 'light')
		document.body.classList.add(_theme)
		localStorage.setItem('theme', _theme)
		setTheme(_theme)
	}

	useEffect(() => {
		const selectedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
		document.body.classList.add(selectedTheme)
		setTheme(selectedTheme)
	}, [])

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
				<div className="flex gap-4 items-center">
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
							href={GITHUB}
							className="text-copy flex items-center gap-2 font-semibold"
							key={3}
							variants={buttonVariant}
							transition={buttonTransition}
							target="_blank"
						>
							Contribute <FaGithub />
						</motion.a>
						<motion.a
							href={GITHUB}
							className="text-primary flex items-center gap-2 font-semibold"
							key={4}
							variants={buttonVariant}
							transition={buttonTransition}
							target="_blank"
						>
							Contribute <FaGithub />
						</motion.a>
					</motion.div>
					<ThemeToggle theme={theme} handleThemeChange={handleThemeChange} />

					<motion.button
						className="text-copy border-b-[1px] border-transparent hover:text-primary"
						onClick={() => setIsCountryOpen(true)}
						key={1}
						variants={buttonVariant}
						transition={buttonTransition}
					>
						<FaGlobeEurope />
					</motion.button>
				</div>
			</header>

			<AboutModal isOpen={isAboutOpen} setIsOpen={setIsAboutOpen} />
			<CountryModal isOpen={isCountryOpen} setIsOpen={setIsCountryOpen} />
		</>
	)
}
