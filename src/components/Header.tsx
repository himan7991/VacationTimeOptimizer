import { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FaGlobeEurope } from 'react-icons/fa'
import { motion } from 'framer-motion'
import AboutModal from './modals/ModalAbout'
import CountryModal from './modals/ModalCountry'
import ThemeToggle from './toggles/ToggleTheme'
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
			<header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[5%] py-4">
				<h2 className="text-2xl font-bold text-copy">HS.</h2>
				<div className="flex items-center gap-4">
					<motion.div className="flex h-6 flex-col overflow-hidden" whileHover="hover">
						<motion.button
							className="font-semibold text-copy"
							onClick={() => setIsAboutOpen(true)}
							key={1}
							variants={buttonVariant}
							transition={buttonTransition}
						>
							About
						</motion.button>
						<motion.button
							className="font-semibold text-primary"
							onClick={() => setIsAboutOpen(true)}
							key={2}
							variants={buttonVariant}
							transition={buttonTransition}
						>
							About
						</motion.button>
					</motion.div>
					<motion.div className="flex h-6 flex-col overflow-hidden" whileHover="hover">
						<motion.a
							href={GITHUB}
							className="flex items-center gap-2 font-semibold text-copy"
							key={3}
							variants={buttonVariant}
							transition={buttonTransition}
							target="_blank"
						>
							Contribute <FaGithub />
						</motion.a>
						<motion.a
							href={GITHUB}
							className="flex items-center gap-2 font-semibold text-primary"
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
						className="border-b-[1px] border-transparent text-copy hover:text-primary"
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
