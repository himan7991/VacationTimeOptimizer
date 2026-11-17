import { twMerge } from 'tailwind-merge'

/** Same box as a calendar day, so the legend samples look like the real thing */
const CELL = 'inline-grid h-6 w-6 shrink-0 place-items-center rounded border-b border-transparent text-xs leading-none'

const ITEMS: { label: string; className: string }[] = [
	{ label: 'Past', className: 'text-copy-lighter' },
	{ label: 'Today', className: 'text-copy-lighter border-b-copy-lighter' },
	{ label: 'Working day', className: 'text-copy' },
	{ label: 'Weekend', className: 'text-error' },
	{ label: 'Public holiday', className: 'bg-primary font-semibold text-white' },
	{ label: 'Suggested PTO', className: 'bg-green-400 font-semibold text-green-950' },
	{ label: 'Pinned', className: 'text-copy ring-2 ring-primary ring-offset-1 ring-offset-foreground' }
]

/**
 * Explains the calendar colours and how pinning works. Rendered on the app's light panel colours
 * so the samples match the real calendar wherever the legend is shown.
 */
export default function CalendarLegend() {
	return (
		<section aria-labelledby="legend-title" className="rounded-lg bg-foreground p-3 text-xs text-copy">
			<h3 id="legend-title" className="mb-2 text-center text-sm font-bold">
				Reading the calendar
			</h3>
			<ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
				{ITEMS.map(({ label, className }) => (
					<li className="flex items-center gap-1.5" key={label}>
						<span className={twMerge(CELL, className)} aria-hidden="true">
							12
						</span>
						{label}
					</li>
				))}
			</ul>
			<p className="mt-3 text-center text-copy-light">
				Click any working day to <span className="font-semibold text-copy">pin</span> it as a must-take PTO day. In{' '}
				<span className="font-semibold text-copy">Best overall</span> mode pinned days are always part of the plan. In{' '}
				<span className="font-semibold text-copy">Consecutive</span> mode the break stretches to cover every pinned day, so pinning the
				first and last day sets the whole range.
			</p>
		</section>
	)
}
