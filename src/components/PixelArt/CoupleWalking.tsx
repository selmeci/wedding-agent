export function CoupleWalking({ className = "" }: { className?: string }) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Pár držiaci sa za ruky"
		>
			{/* === BRIDE (Left) === */}
			{/* -- Legs & Shoes -- (scaled 2x) */}
			<rect x="36" y="100" width="6" height="20" fill="#FFD4A3" />
			<rect x="48" y="100" width="6" height="20" fill="#FFD4A3" />

			{/* NEW: Leg shading */}
			<rect x="38" y="102" width="2" height="16" fill="#E8C090" opacity="0.4" />
			<rect x="50" y="102" width="2" height="16" fill="#E8C090" opacity="0.4" />

			{/* Shoes (Pink flats/sandals) */}
			<rect x="36" y="120" width="8" height="4" fill="#EC4899" />
			<rect x="48" y="120" width="8" height="4" fill="#EC4899" />

			{/* NEW: Shoe detail */}
			<rect x="38" y="121" width="4" height="2" fill="#F472B6" />
			<rect x="50" y="121" width="4" height="2" fill="#F472B6" />

			{/* -- Dress (Summer Pink) -- (scaled 2x) */}
			{/* Skirt */}
			<rect x="30" y="76" width="32" height="24" fill="#FF9BB0" />
			<rect x="28" y="80" width="36" height="20" fill="#FF9BB0" />

			{/* Folds/Shadows */}
			<rect x="34" y="76" width="2" height="24" fill="#FF6B8E" opacity="0.6" />
			<rect x="44" y="76" width="2" height="24" fill="#FF6B8E" opacity="0.6" />
			<rect x="56" y="76" width="2" height="24" fill="#FF6B8E" opacity="0.6" />

			{/* NEW: Dress flow detail */}
			<rect x="30" y="92" width="4" height="6" fill="#FF85A0" />
			<rect x="58" y="92" width="4" height="6" fill="#FF85A0" />

			{/* Torso */}
			<rect x="34" y="52" width="24" height="24" fill="#FF9BB0" />

			{/* Neckline */}
			<rect x="40" y="52" width="12" height="4" fill="#FFD4A3" />

			{/* NEW: Dress detail */}
			<rect x="40" y="56" width="12" height="4" fill="#FFC0D0" opacity="0.5" />

			{/* -- Arms -- (scaled 2x) */}
			{/* Left arm (down by side) */}
			<rect x="30" y="54" width="4" height="20" fill="#FFD4A3" />

			{/* Right arm (reaching for groom) */}
			<rect x="56" y="58" width="12" height="6" fill="#FFD4A3" />

			{/* -- Head -- (scaled 2x) */}
			{/* Neck */}
			<rect x="42" y="48" width="8" height="4" fill="#FFD4A3" />

			{/* Face */}
			<rect x="38" y="28" width="18" height="20" fill="#FFD4A3" />
			<rect x="40" y="40" width="4" height="2" fill="#FF9BB0" opacity="0.5" />

			{/* Face Features */}
			<rect x="40" y="34" width="4" height="4" fill="#1F2937" />
			<rect x="48" y="34" width="4" height="4" fill="#1F2937" />

			{/* NEW: Eye highlights */}
			<rect x="41" y="35" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			<rect x="49" y="35" width="2" height="2" fill="#FFFFFF" opacity="0.6" />

			{/* Smile */}
			<rect x="42" y="42" width="8" height="2" fill="#D97706" opacity="0.6" />

			{/* Hair (Blonde) (scaled 2x + enhanced) */}
			<rect x="36" y="24" width="24" height="8" fill="#F4E4C1" />
			<rect x="34" y="26" width="4" height="16" fill="#F4E4C1" />
			<rect x="56" y="26" width="4" height="12" fill="#F4E4C1" />
			<rect x="40" y="24" width="8" height="2" fill="#FFFFFF" opacity="0.4" />

			{/* NEW: Hair texture */}
			<rect x="40" y="26" width="6" height="4" fill="#FAF0DC" />

			{/* === GROOM (Right) === */}
			{/* -- Legs (Jeans) -- (scaled 2x) */}
			<rect x="80" y="88" width="10" height="32" fill="#2563EB" />
			<rect x="94" y="88" width="10" height="32" fill="#2563EB" />

			{/* Jeans details/shadows */}
			<rect x="80" y="88" width="2" height="32" fill="#1E40AF" opacity="0.5" />
			<rect x="102" y="88" width="2" height="32" fill="#1E40AF" opacity="0.5" />

			{/* NEW: Jeans seams */}
			<rect x="84" y="90" width="2" height="28" fill="#3B82F6" opacity="0.3" />
			<rect x="98" y="90" width="2" height="28" fill="#3B82F6" opacity="0.3" />

			{/* Shoes (Sneakers) */}
			<rect x="78" y="120" width="12" height="4" fill="#374151" />
			<rect x="94" y="120" width="12" height="4" fill="#374151" />
			<rect x="78" y="122" width="12" height="2" fill="#FFFFFF" opacity="0.8" />
			<rect x="94" y="122" width="12" height="2" fill="#FFFFFF" opacity="0.8" />

			{/* -- Torso (Casual Shirt) -- (scaled 2x) */}
			<rect x="78" y="52" width="28" height="36" fill="#4B5563" />
			<rect x="90" y="52" width="4" height="8" fill="#374151" opacity="0.3" />

			{/* NEW: Shirt details */}
			<rect x="82" y="56" width="20" height="4" fill="#6B7280" opacity="0.3" />

			{/* -- Arms -- (scaled 2x) */}
			{/* Right arm (holding bouquet) */}
			<rect x="106" y="54" width="6" height="16" fill="#FFD4A3" />
			<rect x="106" y="52" width="6" height="6" fill="#4B5563" />

			{/* Left arm (holding hands) */}
			<rect x="72" y="52" width="6" height="8" fill="#4B5563" />
			<rect x="66" y="58" width="12" height="6" fill="#FFD4A3" />

			{/* -- Bouquet in Right Hand -- (scaled 2x + enhanced) */}
			{/* Stems */}
			<rect x="108" y="64" width="4" height="12" fill="#166534" />

			{/* Leaves */}
			<rect x="112" y="60" width="6" height="6" fill="#22C55E" />
			<rect x="106" y="60" width="4" height="4" fill="#22C55E" />

			{/* Flowers (Pink/Red mix) */}
			<rect x="108" y="72" width="8" height="8" fill="#EC4899" />
			<rect x="114" y="68" width="6" height="6" fill="#F43F5E" />
			<rect x="104" y="70" width="6" height="6" fill="#F472B6" />

			{/* NEW: Flower centers */}
			<rect x="110" y="74" width="4" height="4" fill="#FBCFE8" />
			<rect x="116" y="70" width="2" height="2" fill="#FFB6C1" />

			{/* -- Head -- (scaled 2x) */}
			{/* Neck */}
			<rect x="88" y="48" width="8" height="4" fill="#FFD4A3" />

			{/* Face */}
			<rect x="84" y="28" width="18" height="20" fill="#FFD4A3" />

			{/* Face Features */}
			<rect x="86" y="34" width="4" height="4" fill="#1F2937" />
			<rect x="94" y="34" width="4" height="4" fill="#1F2937" />

			{/* NEW: Eye highlights */}
			<rect x="87" y="35" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			<rect x="95" y="35" width="2" height="2" fill="#FFFFFF" opacity="0.6" />

			{/* Smile */}
			<rect x="88" y="42" width="8" height="2" fill="#000000" opacity="0.3" />

			{/* Hair (Dark) (scaled 2x + enhanced) */}
			<rect x="82" y="20" width="22" height="10" fill="#2C1810" />
			<rect x="82" y="24" width="2" height="8" fill="#2C1810" />
			<rect x="100" y="24" width="2" height="6" fill="#2C1810" />
			<rect x="84" y="22" width="8" height="2" fill="#4A2C20" />

			{/* NEW: Hair texture */}
			<rect x="90" y="22" width="6" height="4" fill="#3D241A" />

			{/* === HANDS JOINED === (scaled 2x + enhanced) */}
			<rect x="64" y="58" width="6" height="6" fill="#E0B88A" />

			{/* NEW: Hand detail */}
			<rect x="66" y="60" width="4" height="4" fill="#FFD4A3" />
			<rect x="62" y="60" width="2" height="4" fill="#E8C090" />
		</svg>
	);
}
