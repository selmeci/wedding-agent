import { useState } from "react";
import { BabyCrawling } from "./BabyCrawling";
import { BabySitting } from "./BabySitting";
import { CoupleWalking } from "./CoupleWalking";
import { Proposal } from "./Proposal";
import { WeddingCouple } from "./WeddingCouple";

export function LoveStoryTimeline({ className = "" }: { className?: string }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const milestones = [
		{
			Component: BabyCrawling,
			date: "13.11.1985",
			label: "Narodenie ženícha",
		},
		{
			Component: BabySitting,
			date: "27.10.1991",
			label: "Narodenie nevesty",
		},
		{
			Component: CoupleWalking,
			date: "25.3.2023",
			label: "A sme pár",
		},
		{
			Component: Proposal,
			date: "23.3.2025",
			label: "Zásnuby",
		},
		{
			Component: WeddingCouple,
			date: "27.3.2026",
			label: "Svadba",
		},
	];

	return (
		<div className={`w-full py-6 md:py-12 ${className}`}>
			{/* Clickable header (mobile) / Static header (desktop) */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full text-center md:cursor-default md:pointer-events-none"
			>
				<h2 className="text-3xl md:text-4xl font-serif text-pink-600 mb-4 md:mb-20 font-medium inline-flex items-center gap-2">
					Náš príbeh lásky
					{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
					<svg
						className={`w-6 h-6 transition-transform duration-300 md:hidden ${isExpanded ? "rotate-180" : ""}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</h2>
			</button>

			{/* Timeline content - collapsible on mobile, always visible on desktop */}
			<div
				className={`overflow-hidden transition-all duration-500 ease-in-out md:max-h-none md:opacity-100 ${
					isExpanded ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div
					className={`relative max-w-7xl mx-auto px-4 ${isExpanded ? "overflow-y-auto max-h-[70vh] md:overflow-visible md:max-h-none" : ""}`}
				>
					{/* Connector Line */}
					{/* Mobile: Vertical line in center */}
					<div className="absolute left-1/2 top-0 bottom-12 w-0.5 -translate-x-1/2 border-l-2 border-dashed border-pink-200 md:hidden" />
					{/* Desktop: Horizontal line at bottom */}
					<div className="hidden md:block absolute bottom-[88px] left-8 right-8 h-0.5 border-b-2 border-dashed border-pink-200" />

					<div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-16 md:gap-4 relative z-10">
						{milestones.map((milestone, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: it is ok here
								key={index}
								className="flex flex-col items-center gap-4 group w-full md:w-auto"
							>
								{/* Image Container */}
								<div className="h-28 flex items-end justify-center transition-transform hover:scale-110 duration-300 origin-bottom bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-2 rounded-full md:p-0">
									<milestone.Component className="h-full w-auto drop-shadow-md" />
								</div>

								{/* Text Container */}
								<div className="text-center bg-white/90 md:bg-transparent py-2 px-4 rounded-xl">
									<span className="block font-serif text-xl font-bold text-pink-600 tracking-wide mb-1">
										{milestone.date}
									</span>
									<span className="block text-sm font-medium text-pink-500 uppercase tracking-wider">
										{milestone.label}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
