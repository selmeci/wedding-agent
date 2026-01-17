export function GroomWithStop({ className = "" }: { className?: string }) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Ženích so STOP značkou"
		>
			{/* === GROOM (left side) === */}
			{/* Hair (scaled 2x + enhanced) */}
			<rect x="16" y="24" width="24" height="4" fill="#2C1810" />
			<rect x="12" y="28" width="32" height="8" fill="#2C1810" />

			{/* NEW: Hair texture */}
			<rect x="18" y="26" width="8" height="4" fill="#4A2C20" />
			<rect x="30" y="28" width="6" height="4" fill="#3D241A" />
			<rect x="14" y="30" width="4" height="4" fill="#1F1510" />

			{/* Face (scaled 2x) */}
			<rect x="16" y="36" width="24" height="16" fill="#FFD4A3" />

			{/* NEW: Face shading */}
			<rect x="16" y="36" width="2" height="14" fill="#E8C090" opacity="0.5" />
			<rect x="38" y="36" width="2" height="14" fill="#E8C090" opacity="0.5" />

			{/* Eyes (scaled 2x + enhanced) */}
			<rect x="20" y="40" width="4" height="4" fill="#111827" />
			<rect x="32" y="40" width="4" height="4" fill="#111827" />

			{/* NEW: Eye highlights */}
			<rect x="21" y="41" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
			<rect x="33" y="41" width="2" height="2" fill="#FFFFFF" opacity="0.7" />

			{/* NEW: Eyebrows */}
			<rect x="19" y="38" width="6" height="2" fill="#2C1810" />
			<rect x="31" y="38" width="6" height="2" fill="#2C1810" />

			{/* Smile (scaled 2x + enhanced) */}
			<rect x="24" y="48" width="8" height="2" fill="#111827" />

			{/* NEW: Smile corners */}
			<rect x="22" y="46" width="2" height="2" fill="#D97706" opacity="0.4" />
			<rect x="32" y="46" width="2" height="2" fill="#D97706" opacity="0.4" />

			{/* Ear */}
			<rect x="12" y="40" width="4" height="8" fill="#FFD4A3" />
			<rect x="13" y="42" width="2" height="4" fill="#E8C090" />

			{/* Neck (scaled 2x) */}
			<rect x="24" y="52" width="8" height="4" fill="#FFD4A3" />

			{/* Bow tie (scaled 2x + enhanced) */}
			<rect x="22" y="56" width="4" height="4" fill="#111827" />
			<rect x="30" y="56" width="4" height="4" fill="#111827" />
			<rect x="26" y="56" width="4" height="4" fill="#FFFFFF" />

			{/* NEW: Bow tie center detail */}
			<rect x="27" y="57" width="2" height="2" fill="#F3F4F6" />
			<rect x="24" y="58" width="2" height="2" fill="#1F2937" />
			<rect x="30" y="58" width="2" height="2" fill="#1F2937" />

			{/* Suit jacket (scaled 2x) */}
			<rect x="16" y="60" width="24" height="12" fill="#1F2937" />
			<rect x="12" y="64" width="32" height="8" fill="#1F2937" />

			{/* NEW: Jacket lapel details */}
			<rect x="18" y="60" width="2" height="10" fill="#111827" opacity="0.5" />
			<rect x="36" y="60" width="2" height="10" fill="#111827" opacity="0.5" />

			{/* Shirt (white center) (scaled 2x) */}
			<rect x="24" y="60" width="8" height="8" fill="#FFFFFF" />

			{/* NEW: Shirt texture */}
			<rect x="26" y="62" width="4" height="4" fill="#F9FAFB" />

			{/* Buttons (scaled 2x + enhanced) */}
			<rect x="26" y="62" width="4" height="2" fill="#D1D5DB" />
			<rect x="26" y="66" width="4" height="2" fill="#D1D5DB" />

			{/* NEW: Button shine */}
			<rect x="27" y="63" width="2" height="1" fill="#E5E7EB" />

			{/* Left arm (scaled 2x) */}
			<rect x="12" y="60" width="4" height="8" fill="#1F2937" />
			<rect x="8" y="68" width="4" height="4" fill="#FFD4A3" />

			{/* NEW: Left arm sleeve detail */}
			<rect x="12" y="66" width="4" height="2" fill="#FFFFFF" opacity="0.6" />
			<rect x="9" y="70" width="2" height="2" fill="#E8C090" />

			{/* Right arm - extended toward STOP sign (scaled 2x) */}
			<rect x="40" y="60" width="4" height="8" fill="#1F2937" />
			<rect x="44" y="64" width="16" height="4" fill="#FFD4A3" />

			{/* NEW: Right arm details */}
			<rect x="40" y="66" width="4" height="2" fill="#FFFFFF" opacity="0.6" />
			<rect x="46" y="66" width="4" height="2" fill="#E8C090" opacity="0.4" />
			<rect x="56" y="65" width="4" height="2" fill="#FFE8C9" />

			{/* === STOP SIGN (right side) === (scaled 2x + enhanced) */}
			{/* Red octagon background */}
			<polygon
				points="88,36 100,32 112,36 116,48 112,60 100,64 88,60 84,48"
				fill="#DC2626"
			/>

			{/* Darker red outline */}
			<polygon
				points="88,36 100,32 112,36 116,48 112,60 100,64 88,60 84,48"
				fill="none"
				stroke="#991B1B"
				strokeWidth="2"
			/>

			{/* White border inside */}
			<polygon
				points="89,38 100,34 111,38 114,48 111,58 100,62 89,58 86,48"
				fill="none"
				stroke="#FFFFFF"
				strokeWidth="1"
			/>

			{/* NEW: Sign shine effect */}
			<rect x="90" y="38" width="8" height="4" fill="#EF4444" opacity="0.5" />

			{/* "STOP" text in pixel art style (scaled 2x + enhanced) */}
			{/* Letter S */}
			<rect x="90" y="42" width="6" height="2" fill="#FFFFFF" />
			<rect x="90" y="44" width="2" height="2" fill="#FFFFFF" />
			<rect x="90" y="46" width="6" height="2" fill="#FFFFFF" />
			<rect x="94" y="48" width="2" height="2" fill="#FFFFFF" />
			<rect x="90" y="50" width="6" height="2" fill="#FFFFFF" />

			{/* Letter T */}
			<rect x="98" y="42" width="6" height="2" fill="#FFFFFF" />
			<rect x="100" y="44" width="2" height="8" fill="#FFFFFF" />

			{/* Letter O */}
			<rect x="90" y="54" width="6" height="2" fill="#FFFFFF" />
			<rect x="90" y="56" width="2" height="6" fill="#FFFFFF" />
			<rect x="94" y="56" width="2" height="6" fill="#FFFFFF" />
			<rect x="90" y="60" width="6" height="2" fill="#FFFFFF" />

			{/* Letter P */}
			<rect x="98" y="54" width="2" height="8" fill="#FFFFFF" />
			<rect x="100" y="54" width="4" height="2" fill="#FFFFFF" />
			<rect x="102" y="56" width="2" height="2" fill="#FFFFFF" />
			<rect x="100" y="58" width="4" height="2" fill="#FFFFFF" />

			{/* Sign post (scaled 2x + enhanced) */}
			<rect x="96" y="64" width="8" height="24" fill="#6B7280" />
			<rect x="92" y="88" width="16" height="4" fill="#4B5563" />

			{/* NEW: Post shine and detail */}
			<rect x="98" y="66" width="2" height="20" fill="#9CA3AF" opacity="0.4" />
			<rect x="96" y="72" width="8" height="2" fill="#4B5563" opacity="0.3" />

			{/* NEW: Ground shadow */}
			<rect x="90" y="92" width="20" height="2" fill="#374151" opacity="0.3" />

			{/* NEW: Boutonnière on lapel */}
			<rect x="18" y="64" width="4" height="4" fill="#F472B6" />
			<rect x="19" y="65" width="2" height="2" fill="#FBCFE8" />
			<rect x="19" y="68" width="2" height="3" fill="#22C55E" />
		</svg>
	);
}
