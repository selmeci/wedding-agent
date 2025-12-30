export function CoupleWalking({ className = "" }: { className?: string }) {
	return (
		<svg
			width="64"
			height="64"
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Pár držiaci sa za ruky"
		>
			{/* === BRIDE (Left) === */}
			{/* -- Legs & Shoes -- */}
			<rect x="18" y="50" width="3" height="10" fill="#FFD4A3" />
			<rect x="24" y="50" width="3" height="10" fill="#FFD4A3" />
			{/* Shoes (Pink flats/sandals) */}
			<rect x="18" y="60" width="4" height="2" fill="#EC4899" />
			<rect x="24" y="60" width="4" height="2" fill="#EC4899" />
			{/* -- Dress (Summer Pink) -- */}
			{/* Skirt */}
			<rect x="15" y="38" width="16" height="12" fill="#FF9BB0" />
			<rect x="14" y="40" width="18" height="10" fill="#FF9BB0" />
			{/* Folds/Shadows */}
			<rect x="17" y="38" width="1" height="12" fill="#FF6B8E" opacity="0.6" />
			<rect x="22" y="38" width="1" height="12" fill="#FF6B8E" opacity="0.6" />
			<rect x="28" y="38" width="1" height="12" fill="#FF6B8E" opacity="0.6" />
			{/* Torso */}
			<rect x="17" y="26" width="12" height="12" fill="#FF9BB0" />
			{/* Neckline */}
			<rect x="20" y="26" width="6" height="2" fill="#FFD4A3" />
			{/* -- Arms -- */}
			{/* Left arm (down by side) */}
			<rect x="15" y="27" width="2" height="10" fill="#FFD4A3" />
			{/* Right arm (reaching for groom) */}
			<rect x="28" y="29" width="6" height="3" fill="#FFD4A3" />
			{/* -- Head -- */}
			{/* Neck */}
			<rect x="21" y="24" width="4" height="2" fill="#FFD4A3" />
			{/* Face */}
			<rect x="19" y="14" width="9" height="10" fill="#FFD4A3" />
			<rect x="20" y="20" width="2" height="1" fill="#FF9BB0" opacity="0.5" />{" "}
			{/* Cheek */}
			{/* Face Features */}
			{/* Left Eye */}
			<rect x="20" y="17" width="2" height="2" fill="#1F2937" />
			{/* Right Eye */}
			<rect x="24" y="17" width="2" height="2" fill="#1F2937" />
			{/* Smile */}
			<rect x="21" y="21" width="4" height="1" fill="#D97706" opacity="0.6" />
			{/* Hair (Blonde) */}
			<rect x="18" y="12" width="12" height="4" fill="#F4E4C1" />
			<rect x="17" y="13" width="2" height="8" fill="#F4E4C1" />
			<rect x="28" y="13" width="2" height="6" fill="#F4E4C1" />
			{/* Highlight */}
			<rect x="20" y="12" width="4" height="1" fill="#FFFFFF" opacity="0.4" />
			{/* === GROOM (Right) === */}
			{/* -- Legs (Jeans) -- */}
			<rect x="40" y="44" width="5" height="16" fill="#2563EB" />
			<rect x="47" y="44" width="5" height="16" fill="#2563EB" />
			{/* Jeans details/shadows */}
			<rect x="40" y="44" width="1" height="16" fill="#1E40AF" opacity="0.5" />
			<rect x="51" y="44" width="1" height="16" fill="#1E40AF" opacity="0.5" />
			{/* Shoes (Sneakers) */}
			<rect x="39" y="60" width="6" height="2" fill="#374151" />
			<rect x="47" y="60" width="6" height="2" fill="#374151" />
			<rect x="39" y="61" width="6" height="1" fill="#FFFFFF" opacity="0.8" />{" "}
			{/* White sole */}
			<rect x="47" y="61" width="6" height="1" fill="#FFFFFF" opacity="0.8" />
			{/* -- Torso (Casual Shirt) -- */}
			<rect x="39" y="26" width="14" height="18" fill="#4B5563" />
			<rect x="45" y="26" width="2" height="4" fill="#374151" opacity="0.3" />{" "}
			{/* Buttons line */}
			{/* -- Arms -- */}
			{/* Right arm (down - holding bouquet) */}
			<rect x="53" y="27" width="3" height="8" fill="#FFD4A3" />
			<rect x="53" y="26" width="3" height="3" fill="#4B5563" /> {/* Sleeve */}
			{/* Left arm (holding hands) */}
			<rect x="36" y="26" width="3" height="4" fill="#4B5563" /> {/* Sleeve */}
			<rect x="33" y="29" width="6" height="3" fill="#FFD4A3" />
			{/* -- Bouquet in Right Hand -- */}
			{/* Stems */}
			<rect x="54" y="32" width="2" height="6" fill="#166534" />
			{/* Leaves */}
			<rect x="56" y="30" width="3" height="3" fill="#22C55E" />
			<rect x="53" y="30" width="2" height="2" fill="#22C55E" />
			{/* Flowers (Pink/Red mix) */}
			<rect x="54" y="36" width="4" height="4" fill="#EC4899" />{" "}
			{/* Main flower */}
			<rect x="57" y="34" width="3" height="3" fill="#F43F5E" />{" "}
			{/* Side flower */}
			<rect x="52" y="35" width="3" height="3" fill="#F472B6" />{" "}
			{/* Small flower */}
			{/* -- Head -- */}
			{/* Neck */}
			<rect x="44" y="24" width="4" height="2" fill="#FFD4A3" />
			{/* Face */}
			<rect x="42" y="14" width="9" height="10" fill="#FFD4A3" />
			{/* Face Features */}
			{/* Left Eye */}
			<rect x="43" y="17" width="2" height="2" fill="#1F2937" />
			{/* Right Eye */}
			<rect x="47" y="17" width="2" height="2" fill="#1F2937" />
			{/* Smile */}
			<rect x="44" y="21" width="4" height="1" fill="#000000" opacity="0.3" />
			{/* Hair (Dark) */}
			<rect x="41" y="10" width="11" height="5" fill="#2C1810" />
			<rect x="41" y="12" width="1" height="4" fill="#2C1810" />
			<rect x="50" y="12" width="1" height="3" fill="#2C1810" />
			<rect x="42" y="11" width="4" height="1" fill="#4A2C20" />{" "}
			{/* Highlight */}
			{/* === HANDS JOINED === */}
			{/* The overlapping area where hands meet */}
			<rect x="32" y="29" width="3" height="3" fill="#E0B88A" />{" "}
			{/* Hand clasp shadow */}
		</svg>
	);
}
