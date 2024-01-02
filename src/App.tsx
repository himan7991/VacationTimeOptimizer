import { useEffect } from 'react'
import Header from './components/Header'
import BlurBackground from './components/BlurBackground'
import Content from './components/Content'

export default function App() {
	useEffect(() => {
		const selectedTheme = localStorage.getItem('theme')

		if (selectedTheme) {
			// if the user has selected a theme, use that
			document.body.classList.add(selectedTheme)

			// else if the user's OS prefers dark mode, use that
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.body.classList.add('dark')

			// else use light mode
		} else {
			document.body.classList.add('light')
		}
	}, [])

	return (
		<main className="min-h-screen bg-background relative overflow-hidden">
			<Header />

			<Content />

			<BlurBackground />
		</main>
	)
}
