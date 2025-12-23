import { ChevronDown, ChevronUp, Edit3 } from "lucide-react";
import { useState } from "react";

export interface RsvpData {
	guestNames: string[];
	willAttend: boolean | null;
	attendCeremony: boolean | null;
	dietaryRestrictions: string | null;
	needsAccommodation: boolean | null;
	needsDirections: boolean | null;
	isFromModra: boolean;
}

export interface RsvpSummaryCardProps {
	data: RsvpData;
	onEdit?: () => void;
}

export function RsvpSummaryCard({ data, onEdit }: RsvpSummaryCardProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	// Format guest names for display
	const guestNamesText =
		data.guestNames.length === 1
			? data.guestNames[0]
			: data.guestNames.join(", ");

	if (!isExpanded) {
		// Collapsed state - compact single line
		return (
			<div className="sticky top-0 z-10 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-xl shadow-sm mx-4 mt-4 mb-2">
				<button
					type="button"
					onClick={() => setIsExpanded(true)}
					className="w-full px-4 py-3 flex items-center justify-between hover:bg-pink-50/50 transition-colors rounded-xl"
				>
					<div className="flex items-center gap-2">
						<span className="text-lg">💐</span>
						<span className="font-medium text-pink-800">Tvoje potvrdenie</span>
						<span className="text-green-600 text-sm">✓</span>
					</div>
					<ChevronDown className="w-5 h-5 text-pink-600" />
				</button>
			</div>
		);
	}

	// Expanded state - compact card with grid layout
	return (
		<div className="sticky top-0 z-10 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-xl shadow-md mx-4 mt-4 mb-2 overflow-hidden max-h-[40vh] overflow-y-auto">
			{/* Header with collapse button */}
			<div className="flex items-center justify-between px-3 py-2 border-b border-pink-200 bg-white/30">
				<button
					type="button"
					onClick={() => setIsExpanded(false)}
					className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
				>
					<span className="text-base">💐</span>
					<h3 className="font-heading text-sm font-semibold text-pink-800">
						{guestNamesText}
					</h3>
					<ChevronUp className="w-4 h-4 text-pink-600" />
				</button>
				{onEdit && (
					<button
						type="button"
						onClick={onEdit}
						className="flex items-center gap-1 px-2 py-1 text-xs text-pink-700 hover:bg-pink-200 rounded transition-colors"
					>
						<Edit3 className="w-3 h-3" />
						<span className="hidden sm:inline">Upraviť</span>
					</button>
				)}
			</div>

			{/* RSVP Details - Grid layout on desktop, single column on mobile */}
			<div className="px-3 py-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
				{/* Ceremony attendance */}
				<div className="flex items-center gap-2">
					<span className="text-base flex-shrink-0">
						{data.willAttend && data.attendCeremony ? "⛪" : "❌"}
					</span>
					<span className="text-gray-700">
						<span className="font-medium">Na sobáši:</span>{" "}
						{data.willAttend && data.attendCeremony ? "Áno" : "Nie"}
					</span>
				</div>

				{/* Reception attendance */}
				<div className="flex items-center gap-2">
					<span className="text-base flex-shrink-0">
						{data.willAttend ? "🍽️" : "❌"}
					</span>
					<span className="text-gray-700">
						<span className="font-medium">Na hostine:</span>{" "}
						{data.willAttend ? "Áno" : "Nie"}
					</span>
				</div>

				{/* Dietary restrictions */}
				{data.willAttend && (
					<div className="flex items-start gap-2 md:col-span-2">
						<span className="text-base flex-shrink-0">🥗</span>
						<span className="text-gray-700">
							<span className="font-medium">Diéta:</span>{" "}
							{data.dietaryRestrictions || "Žiadne"}
						</span>
					</div>
				)}

				{/* Accommodation (only if not from Modra and attending) */}
				{data.willAttend && !data.isFromModra && (
					<div className="flex items-center gap-2">
						<span className="text-base flex-shrink-0">🏨</span>
						<span className="text-gray-700">
							<span className="font-medium">Ubytovanie:</span>{" "}
							{data.needsAccommodation ? "Áno" : "Nie"}
						</span>
					</div>
				)}

				{/* Directions (only if not from Modra and attending) */}
				{data.willAttend && !data.isFromModra && (
					<div className="flex items-center gap-2">
						<span className="text-base flex-shrink-0">🗺️</span>
						<span className="text-gray-700">
							<span className="font-medium">Doprava:</span>{" "}
							{data.needsDirections ? "Áno" : "Nie"}
						</span>
					</div>
				)}
			</div>

			{/* Thank you message */}
			<div className="px-3 py-2 text-center border-t border-pink-200 bg-white/20">
				<p className="text-xs text-pink-800 font-medium">
					{data.willAttend ? "Tešíme sa na vás! 💕" : "Ďakujeme za odpoveď 💕"}
				</p>
			</div>
		</div>
	);
}
