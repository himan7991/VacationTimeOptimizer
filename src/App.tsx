import { useEffect } from 'react'

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

	return <main className="min-h-screen bg-background"></main>
}
