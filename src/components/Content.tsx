import Page1 from '../pages/Page1'

export default function Content() {
	return (
		<div className="bg-foreground h-[calc(100vh-6rem)] w-[calc(100vw-10%)] shadow-2xl rounded-2xl mx-auto flex flex-col justify-center items-center overflow-hidden">
			<div>
				<Page1 />
			</div>
		</div>
	)
}
