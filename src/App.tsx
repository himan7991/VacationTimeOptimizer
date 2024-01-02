import Header from './components/Header'
import BlurBackground from './components/BlurBackground'
import Content from './components/Content'

export default function App() {
	return (
		<main className="min-h-screen bg-background relative overflow-hidden">
			<Header />

			<Content />

			<BlurBackground />
		</main>
	)
}
