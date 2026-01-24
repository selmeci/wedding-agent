import type { RsvpData } from "@/agents/wedding-assistent/types";

interface RsvpSummaryProps {
	rsvpData: RsvpData | null;
	onEditRsvp: () => void;
}

export function RsvpSummary({ rsvpData, onEditRsvp }: RsvpSummaryProps) {
	// Default values if no RSVP data yet
	const data = rsvpData || {
		dietaryRestrictions: null,
		needsTransportAfter: false,
		transportDestination: null,
		willAttend: true,
	};

	return (
		<div className="space-y-6 p-4 pb-8 max-w-2xl mx-auto">
			{/* RSVP Cards Grid */}
			<section>
				<h2 className="text-2xl font-serif text-pink-600 mb-4 flex items-center gap-2">
					📋 Tvoje RSVP
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
					{/* Attendance Card */}
					<div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 shadow-md border border-pink-200">
						<div className="text-3xl mb-2">✅</div>
						<div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
							Účasť
						</div>
						<div className="text-base font-semibold text-pink-600">
							{data.willAttend ? "Prídem" : "Neprídem"}
						</div>
						<div className="text-xs text-gray-400 mt-1">27.3.2026</div>
					</div>

					{/* Dietary Card */}
					<div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 shadow-md border border-pink-200">
						<div className="text-3xl mb-2">🍽️</div>
						<div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
							Strava
						</div>
						<div className="text-base font-semibold text-pink-600">
							{data.dietaryRestrictions || "Bez obmedzení"}
						</div>
					</div>

					{/* Transport Card */}
					<div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 shadow-md border border-pink-200">
						<div className="text-3xl mb-2">🚗</div>
						<div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
							Odvoz
						</div>
						<div className="text-base font-semibold text-pink-600">
							{data.needsTransportAfter
								? data.transportDestination || "Áno"
								: "Nie"}
						</div>
					</div>
				</div>

				{/* Edit RSVP Button */}
				<button
					type="button"
					onClick={onEditRsvp}
					className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-md"
				>
					Upraviť RSVP
				</button>
			</section>

			{/* Program Timeline */}
			<section>
				<h2 className="text-2xl font-serif text-pink-600 mb-4 flex items-center gap-2">
					📅 Program Dňa
				</h2>
				<div className="space-y-4">
					{/* Sobáš */}
					<div className="flex gap-4 items-start">
						<div className="flex-shrink-0 w-16 text-right">
							<div className="text-lg font-bold text-pink-600">15:30</div>
						</div>
						<div className="flex-shrink-0">
							<div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-2xl">
								⛪
							</div>
						</div>
						<div className="flex-1">
							<div className="font-semibold text-gray-900">Sobáš</div>
							<div className="text-sm text-gray-600">Sobášna sieň v Modre</div>
							<div className="text-xs text-gray-500">
								Štúrova 59, 900 01 Modra
							</div>
						</div>
					</div>

					{/* Fotenie */}
					<div className="flex gap-4 items-start">
						<div className="flex-shrink-0 w-16 text-right">
							<div className="text-lg font-bold text-pink-600">16:00</div>
						</div>
						<div className="flex-shrink-0">
							<div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-2xl">
								📸
							</div>
						</div>
						<div className="flex-1">
							<div className="font-semibold text-gray-900">Fotenie</div>
							<div className="text-sm text-gray-600">~1 hodina</div>
						</div>
					</div>

					{/* Hostina */}
					<div className="flex gap-4 items-start">
						<div className="flex-shrink-0 w-16 text-right">
							<div className="text-lg font-bold text-pink-600">17:00</div>
						</div>
						<div className="flex-shrink-0">
							<div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-2xl">
								🍽️
							</div>
						</div>
						<div className="flex-1">
							<div className="font-semibold text-gray-900">Hostina</div>
							<div className="text-sm text-gray-600">Reštaurácia Starý Dom</div>
							<div className="text-xs text-gray-500">
								Dukelská 2, 900 01 Modra
							</div>
							<div className="text-xs text-gray-400 mt-1">
								(5 minút chôdze od sobáša)
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Practical Info */}
			<section>
				<h2 className="text-2xl font-serif text-pink-600 mb-4 flex items-center gap-2">
					ℹ️ Praktické Info
				</h2>
				<div className="space-y-3">
					{/* Dress Code */}
					<div className="flex gap-3 items-start bg-white rounded-lg p-3 border border-pink-100">
						<div className="text-2xl">👗</div>
						<div className="flex-1">
							<div className="font-medium text-gray-900">Dress Code</div>
							<div className="text-sm text-gray-600">
								Semi-Formal / Cocktail
							</div>
							<div className="text-xs text-gray-500 mt-1">
								⚠️ Prosím bez bielej a čiernej farby
							</div>
						</div>
					</div>

					{/* Dary */}
					<div className="flex gap-3 items-start bg-white rounded-lg p-3 border border-pink-100">
						<div className="text-2xl">🎁</div>
						<div className="flex-1">
							<div className="font-medium text-gray-900 mb-2">
								Dary a Kytice
							</div>
							<div className="text-sm text-gray-700 leading-relaxed mb-2">
								Ku kyticiam: Radosť nám spravíte aj jednou ružičkou. 🌹
							</div>
							<div className="text-sm text-gray-700 leading-relaxed">
								K darom: Najväčším darom pre nás je vaša prítomnosť a spoločne
								strávený čas. Ak by ste nám chceli niečím prispieť, finančný
								príspevok privítame. 💝
							</div>
							<div className="text-xs text-gray-500 mt-2 italic">
								Hmotné dary nie sú potrebné. Obálku môžete odovzdať po obrade
								alebo počas hostiny nech je s tým čo najmenej starostí.
								Ďakujeme.
							</div>
						</div>
					</div>

					{/* Parkovanie */}
					<div className="flex gap-3 items-start bg-white rounded-lg p-3 border border-pink-100">
						<div className="text-2xl">🅿️</div>
						<div className="flex-1">
							<div className="font-medium text-gray-900">Parkovanie</div>
							<div className="space-y-2 text-sm text-gray-600">
								<div>
									Pri nemocnici (Vajanského 1)
									<div className="text-xs text-gray-500 mt-1">
										Bezplatné, 7 min pešo od sobáša
									</div>
								</div>
								<div>
									Pred OC Kockou
									<div className="text-xs text-gray-500 mt-1">
										Bezplatné, 6 min pešo od sobáša
									</div>
								</div>
								<div>
									Na námestí
									<div className="text-xs text-gray-500 mt-1">
										Platené do 16:30, 2 min pešo od sobáša
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Chat Commands */}
			<section>
				<h2 className="text-2xl font-serif text-pink-600 mb-4 flex items-center gap-2">
					💬 Čo vieš v chate
				</h2>
				<div className="bg-white rounded-lg p-4 border border-pink-100 space-y-3">
					<div className="text-sm text-gray-600">
						Napíš mi niektorý z týchto príkazov:
					</div>
					<div className="space-y-2 text-sm text-gray-700">
						<div>📨 „odber noviniek“ – prihlásenie na emailové novinky</div>
						<div>🛑 „odhlásiť novinky“ – zrušenie odberu</div>
						<div>💌 „chcem odkázať“ – správa pre Ivonku a Romana</div>
						<div>✏️ „zmeniť RSVP“ – upraviť účasť, diétu alebo odvoz</div>
					</div>
				</div>
			</section>
		</div>
	);
}
