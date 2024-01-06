import { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FaGlobeEurope } from 'react-icons/fa'
import { IoMenu, IoClose } from 'react-icons/io5'
import { motion } from 'framer-motion'
import AboutModal from './modals/ModalAbout'
import CountryModal from './modals/ModalCountry'
import ThemeToggle from './toggles/ToggleTheme'
import { GITHUB } from '../constants/links'
import { twMerge } from 'tailwind-merge'

export default function Header() {
	const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false)
	const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false)
	const [theme, setTheme] = useState('light')
	const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false)

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

	useEffect(() => {
		const handleResize = () => {
			setIsMobileNavOpen(false)
		}

		window.addEventListener('resize', handleResize)
		window.addEventListener('scroll', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('scroll', handleResize)
		}
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
			<header className="grid grid-cols-2 py-4">
				<h2 className="ml-[10%] text-2xl font-bold text-copy">HS.</h2>
				{isMobileNavOpen ? (
					<IoClose
						className="mr-[10%] block cursor-pointer place-self-end text-copy md:hidden"
						size={32}
						onClick={() => setIsMobileNavOpen(false)}
					/>
				) : (
					<IoMenu
						className="mr-[10%] block cursor-pointer place-self-end text-copy md:hidden"
						size={32}
						onClick={() => setIsMobileNavOpen(true)}
					/>
				)}

				<div
					className={twMerge(
						'col-span-2 flex w-screen flex-col items-end gap-4 overflow-hidden bg-background pr-[7.5%] pt-4 transition-all duration-500',
						'md:col-span-1 md:ml-0 md:w-fit md:flex-row md:items-center md:place-self-end md:overflow-visible md:bg-transparent md:p-0 md:pr-[10%]',
						isMobileNavOpen ? 'h-screen' : 'h-0 md:h-fit'
					)}
				>
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
						className="flex items-center gap-2 border-b-[1px] border-transparent font-semibold text-copy hover:text-primary"
						onClick={() => setIsCountryOpen(true)}
						key={1}
						variants={buttonVariant}
						transition={buttonTransition}
					>
						<p className="md:hidden">Select a country</p> <FaGlobeEurope />
					</motion.button>

					<AboutModal isOpen={isAboutOpen} setIsOpen={setIsAboutOpen} />
					<CountryModal isOpen={isCountryOpen} setIsOpen={setIsCountryOpen} />
				</div>
			</header>
		</>
	)
}
