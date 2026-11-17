import { useEffect, useState } from 'react'
import { FaGithub, FaGlobeEurope } from 'react-icons/fa'
import { IoMenu, IoClose } from 'react-icons/io5'
import { motion } from 'framer-motion'
import ThemeToggle from './toggles/ToggleTheme'
import { GITHUB } from '../constants/links'
import { twMerge } from 'tailwind-merge'
import { useAppContext } from '../context/AppContext'

export default function Header() {
	const { openCountryModal, openAboutModal } = useAppContext()
	const [theme, setTheme] = useState('light')
	const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false)

	const handleThemeChange = (_theme: string) => {
		document.documentElement.classList.remove('dark', 'light')
		document.documentElement.classList.add(_theme)
		document.querySelector("meta[name='theme-color']")?.setAttribute('content', _theme === 'light' ? '#f0f0f0' : '#1a1a1a')
		localStorage.setItem('theme', _theme)
		setTheme(_theme)
	}

	useEffect(() => {
		// The inline script in index.html already applied the theme before first paint; just mirror it into state
		setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
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
				<h2 className="ml-[10%] select-none text-2xl font-bold text-copy">HS.</h2>
				<button
					type="button"
					className="mr-[10%] block cursor-pointer place-self-end text-copy md:hidden"
					aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={isMobileNavOpen}
					aria-controls="site-nav"
					onClick={() => setIsMobileNavOpen((open) => !open)}
				>
					{isMobileNavOpen ? <IoClose size={32} aria-hidden="true" /> : <IoMenu size={32} aria-hidden="true" />}
				</button>

				<nav
					id="site-nav"
					aria-label="Site"
					className={twMerge(
						// Phone: a full-screen overlay below the header bar that fades in, so the page underneath does not move
						'fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col items-end gap-4 bg-background/95 pr-[7.5%] pt-6 backdrop-blur transition-opacity duration-300',
						isMobileNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
						// Tablet and up: an ordinary row inside the header
						'md:pointer-events-auto md:static md:col-span-1 md:w-fit md:flex-row md:items-center md:place-self-end md:bg-transparent md:p-0 md:pr-[10%] md:opacity-100 md:backdrop-blur-none'
					)}
				>
					<motion.button
						type="button"
						className="relative flex h-6 flex-col overflow-hidden font-semibold text-copy"
						whileHover="hover"
						onClick={openAboutModal}
					>
						<motion.span variants={buttonVariant} transition={buttonTransition}>
							About
						</motion.span>
						<motion.span className="text-primary" variants={buttonVariant} transition={buttonTransition} aria-hidden="true">
							About
						</motion.span>
					</motion.button>
					<motion.a
						href={GITHUB}
						className="relative flex h-6 flex-col overflow-hidden font-semibold text-copy"
						whileHover="hover"
						target="_blank"
						rel="noreferrer"
					>
						<motion.span className="flex items-center gap-2" variants={buttonVariant} transition={buttonTransition}>
							Contribute <FaGithub aria-hidden="true" />
						</motion.span>
						<motion.span
							className="flex items-center gap-2 text-primary"
							variants={buttonVariant}
							transition={buttonTransition}
							aria-hidden="true"
						>
							Contribute <FaGithub aria-hidden="true" />
						</motion.span>
					</motion.a>
					<ThemeToggle theme={theme} handleThemeChange={handleThemeChange} />

					<motion.button
						className="flex items-center gap-2 border-b border-transparent font-semibold text-copy hover:text-primary"
						onClick={openCountryModal}
						key={1}
						aria-label="Select a country"
						variants={buttonVariant}
						transition={buttonTransition}
					>
						<p className="md:hidden">Select a country</p> <FaGlobeEurope aria-hidden="true" />
					</motion.button>
				</nav>
			</header>
		</>
	)
}
