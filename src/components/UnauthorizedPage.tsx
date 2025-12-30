import { Header } from "./Header";
import { Container } from "./ui";

function CoupleAtGate({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 160 96"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			style={{ imageRendering: "pixelated" }}
		>
			{/* BRIDE (left side) */}
			<g transform="translate(20, 40)">
				{/* Veil */}
				<rect x="8" y="4" width="16" height="2" fill="#FFFFFF" />
				<rect x="6" y="6" width="20" height="2" fill="#FFFFFF" />
				<rect x="6" y="8" width="4" height="4" fill="#FFFFFF" />
				<rect x="22" y="8" width="4" height="4" fill="#FFFFFF" />
				{/* Hair */}
				<rect x="10" y="6" width="12" height="2" fill="#F4E4C1" />
				<rect x="8" y="8" width="16" height="4" fill="#F4E4C1" />
				{/* Face */}
				<rect x="10" y="12" width="12" height="8" fill="#FFD4A3" />
				{/* Eyes */}
				<rect x="12" y="14" width="2" height="2" fill="#111827" />
				<rect x="18" y="14" width="2" height="2" fill="#111827" />
				{/* Smile */}
				<rect x="14" y="18" width="4" height="1" fill="#FF6B8E" />
				{/* Neck */}
				<rect x="14" y="20" width="4" height="2" fill="#FFD4A3" />
				{/* Dress */}
				<rect x="10" y="22" width="12" height="6" fill="#FFFFFF" />
				<rect x="8" y="24" width="16" height="4" fill="#FFFFFF" />
				<rect x="14" y="24" width="4" height="1" fill="#FF9BB0" />
				<rect x="12" y="26" width="8" height="1" fill="#FFE3E8" />
				{/* Arms */}
				<rect x="8" y="22" width="2" height="4" fill="#FFD4A3" />
				<rect x="22" y="22" width="2" height="4" fill="#FFD4A3" />
				{/* Hands */}
				<rect x="6" y="26" width="2" height="2" fill="#FFD4A3" />
				<rect x="24" y="26" width="2" height="2" fill="#FFD4A3" />
				{/* Bouquet */}
				<rect x="14" y="28" width="4" height="2" fill="#90EE90" />
				<rect x="13" y="27" width="2" height="1" fill="#FF9BB0" />
				<rect x="17" y="27" width="2" height="1" fill="#FF6B8E" />
			</g>

			{/* GROOM (right side) */}
			<g transform="translate(108, 40)">
				{/* Hair */}
				<rect x="10" y="6" width="12" height="2" fill="#2C1810" />
				<rect x="8" y="8" width="16" height="4" fill="#2C1810" />
				{/* Face */}
				<rect x="10" y="12" width="12" height="8" fill="#FFD4A3" />
				{/* Eyes */}
				<rect x="12" y="14" width="2" height="2" fill="#111827" />
				<rect x="18" y="14" width="2" height="2" fill="#111827" />
				{/* Smile */}
				<rect x="14" y="18" width="4" height="1" fill="#111827" />
				{/* Neck */}
				<rect x="14" y="20" width="4" height="2" fill="#FFD4A3" />
				{/* Bow tie */}
				<rect x="13" y="22" width="2" height="2" fill="#111827" />
				<rect x="17" y="22" width="2" height="2" fill="#111827" />
				<rect x="15" y="22" width="2" height="2" fill="#FFFFFF" />
				{/* Suit */}
				<rect x="10" y="24" width="12" height="6" fill="#1F2937" />
				<rect x="8" y="26" width="16" height="4" fill="#1F2937" />
				<rect x="14" y="24" width="4" height="4" fill="#FFFFFF" />
				<rect x="15" y="25" width="2" height="1" fill="#D1D5DB" />
				<rect x="15" y="27" width="2" height="1" fill="#D1D5DB" />
				{/* Arms */}
				<rect x="8" y="24" width="2" height="4" fill="#1F2937" />
				<rect x="22" y="24" width="2" height="4" fill="#1F2937" />
				{/* Hands */}
				<rect x="6" y="28" width="2" height="2" fill="#FFD4A3" />
				<rect x="24" y="28" width="2" height="2" fill="#FFD4A3" />
			</g>

			{/* ORNAMENTAL GATE (center) */}
			{/* Left pillar */}
			<rect x="62" y="20" width="6" height="56" fill="#8B7355" />
			<rect x="60" y="18" width="10" height="4" fill="#A0826D" />
			<rect x="60" y="74" width="10" height="4" fill="#A0826D" />

			{/* Right pillar */}
			<rect x="92" y="20" width="6" height="56" fill="#8B7355" />
			<rect x="90" y="18" width="10" height="4" fill="#A0826D" />
			<rect x="90" y="74" width="10" height="4" fill="#A0826D" />

			{/* Arch top */}
			<rect x="68" y="20" width="24" height="4" fill="#8B7355" />
			<rect x="70" y="16" width="20" height="4" fill="#A0826D" />

			{/* Gate doors */}
			<rect x="68" y="24" width="11" height="50" fill="#6B5A4D" />
			<rect x="81" y="24" width="11" height="50" fill="#6B5A4D" />

			{/* Door panels (decorative) */}
			<rect x="70" y="28" width="7" height="18" fill="#8B7355" />
			<rect x="70" y="50" width="7" height="20" fill="#8B7355" />
			<rect x="83" y="28" width="7" height="18" fill="#8B7355" />
			<rect x="83" y="50" width="7" height="20" fill="#8B7355" />

			{/* Door handles */}
			<rect x="77" y="46" width="2" height="4" fill="#D4AF37" />
			<rect x="81" y="46" width="2" height="4" fill="#D4AF37" />

			{/* LOCK (center of gate) */}
			{/* Lock body */}
			<rect x="74" y="40" width="12" height="10" fill="#D4AF37" />
			<rect x="75" y="41" width="10" height="8" fill="#B8960F" />
			{/* Lock shackle */}
			<rect x="77" y="36" width="2" height="4" fill="#D4AF37" />
			<rect x="81" y="36" width="2" height="4" fill="#D4AF37" />
			<rect x="77" y="34" width="6" height="2" fill="#D4AF37" />
			{/* Keyhole */}
			<rect x="79" y="44" width="2" height="3" fill="#111827" />

			{/* Decorative flowers on arch */}
			<rect x="72" y="18" width="2" height="2" fill="#FF9BB0" />
			<rect x="76" y="17" width="2" height="2" fill="#FF6B8E" />
			<rect x="82" y="17" width="2" height="2" fill="#FF6B8E" />
			<rect x="86" y="18" width="2" height="2" fill="#FF9BB0" />

			{/* Ground/base */}
			<rect
				x="0"
				y="78"
				width="160"
				height="18"
				fill="#C8B8A0"
				fillOpacity="0.3"
			/>
		</svg>
	);
}

export function UnauthorizedPage() {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-pink-100">
			<Header />
			<main className="flex-1 flex items-center justify-center p-8">
				<Container>
					<div className="text-center max-w-4xl mx-auto">
						<div className="mb-12">
							<CoupleAtGate className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto" />
						</div>
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif">
							Vstup len pre pozvaných hostí
						</h1>
						<p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4">
							Táto stránka je prístupná iba s QR kódom z vašej pozvánky.
						</p>
						<p className="text-base md:text-lg text-gray-500">
							QR kód nájdete na vašej svadobnej pozvánke. 💕
						</p>
					</div>
				</Container>
			</main>
		</div>
	);
}
