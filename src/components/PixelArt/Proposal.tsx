export function Proposal({ className = "" }: { className?: string }) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Žiadosť o ruku"
		>
			{/* === BRIDE (Left - Surprised) === */}
			{/* -- Legs -- (scaled 2x) */}
			<rect x="28" y="100" width="6" height="20" fill="#FFD4A3" />
			<rect x="40" y="100" width="6" height="20" fill="#FFD4A3" />

			{/* NEW: Leg shading */}
			<rect x="30" y="102" width="2" height="16" fill="#E8C090" opacity="0.4" />
			<rect x="42" y="102" width="2" height="16" fill="#E8C090" opacity="0.4" />

			{/* Shoes (Pink Heels) */}
			<rect x="28" y="120" width="8" height="4" fill="#BE185D" />
			<rect x="40" y="120" width="8" height="4" fill="#BE185D" />

			{/* NEW: Heel detail */}
			<rect x="28" y="122" width="2" height="4" fill="#9F1239" />
			<rect x="40" y="122" width="2" height="4" fill="#9F1239" />

			{/* -- Dress (Pink/Magenta Cocktail Dress) -- (scaled 2x) */}
			<rect x="24" y="68" width="28" height="32" fill="#EC4899" />
			<rect x="26" y="52" width="24" height="16" fill="#EC4899" />

			{/* Dress Shadows */}
			<rect x="28" y="68" width="2" height="32" fill="#BE185D" opacity="0.5" />
			<rect x="44" y="68" width="2" height="32" fill="#BE185D" opacity="0.5" />

			{/* NEW: Dress detail */}
			<rect x="32" y="70" width="12" height="4" fill="#F472B6" opacity="0.4" />
			<rect x="30" y="86" width="16" height="2" fill="#DB2777" opacity="0.3" />

			{/* -- Head -- (scaled 2x) */}
			{/* Neck */}
			<rect x="34" y="48" width="8" height="4" fill="#FFD4A3" />

			{/* Face */}
			<rect x="30" y="28" width="20" height="20" fill="#FFD4A3" />

			{/* NEW: Face shading */}
			<rect x="30" y="30" width="2" height="14" fill="#E8C090" opacity="0.4" />

			{/* === BRIDE FACE - SURPRISED EXPRESSION (128-bit) === */}
			{/* Left eye - wide with surprise */}
			<rect x="31" y="33" width="6" height="5" fill="#FFFFFF" />
			<rect x="32" y="34" width="4" height="3" fill="#5B7A8A" />
			<rect x="33" y="35" width="2" height="2" fill="#0F0F0F" />
			<rect x="32" y="34" width="2" height="1" fill="#FFFFFF" />
			<rect x="31" y="32" width="6" height="1" fill="#1F2937" />
			{/* Surprised lashes (raised) */}
			<rect x="31" y="31" width="1" height="2" fill="#1F2937" />
			<rect x="33" y="30" width="1" height="3" fill="#1F2937" />
			<rect x="35" y="31" width="1" height="2" fill="#1F2937" />

			{/* Right eye - wide with surprise */}
			<rect x="41" y="33" width="6" height="5" fill="#FFFFFF" />
			<rect x="42" y="34" width="4" height="3" fill="#5B7A8A" />
			<rect x="43" y="35" width="2" height="2" fill="#0F0F0F" />
			<rect x="42" y="34" width="2" height="1" fill="#FFFFFF" />
			<rect x="41" y="32" width="6" height="1" fill="#1F2937" />
			{/* Surprised lashes */}
			<rect x="42" y="31" width="1" height="2" fill="#1F2937" />
			<rect x="44" y="30" width="1" height="3" fill="#1F2937" />
			<rect x="46" y="31" width="1" height="2" fill="#1F2937" />

			{/* Eyebrows - raised high (surprised) */}
			<rect x="31" y="28" width="5" height="1" fill="#A08060" />
			<rect x="32" y="27" width="3" height="1" fill="#A08060" opacity="0.6" />
			<rect x="42" y="28" width="5" height="1" fill="#A08060" />
			<rect x="43" y="27" width="3" height="1" fill="#A08060" opacity="0.6" />

			{/* Nose (delicate) */}
			<rect x="38" y="36" width="2" height="2" fill="#E8C090" opacity="0.3" />
			<rect x="37" y="38" width="4" height="2" fill="#E8C090" opacity="0.35" />
			<rect x="37" y="39" width="2" height="1" fill="#D4A574" opacity="0.4" />
			<rect x="39" y="39" width="2" height="1" fill="#D4A574" opacity="0.4" />

			{/* Surprised "O" mouth */}
			<rect x="37" y="42" width="6" height="5" fill="#E87080" opacity="0.8" />
			<rect x="38" y="43" width="4" height="3" fill="#C06070" opacity="0.6" />
			<rect x="39" y="44" width="2" height="1" fill="#1F1510" opacity="0.4" />

			{/* -- Arms (Surprise Gesture) -- (scaled 2x) */}
			{/* Left arm (down/bent) */}
			<rect x="22" y="54" width="4" height="16" fill="#FFD4A3" />

			{/* Right arm (Hand to mouth - Shock!) */}
			<rect x="46" y="56" width="6" height="8" fill="#FFD4A3" />
			<rect x="40" y="48" width="8" height="6" fill="#FFD4A3" />

			{/* NEW: Hand covering mouth detail */}
			<rect x="42" y="50" width="4" height="4" fill="#E8C090" />

			{/* === BRIDE HAIR (blonde with strands) === */}
			<rect x="28" y="20" width="24" height="10" fill="#F4E4C1" />
			<rect x="26" y="24" width="4" height="16" fill="#F4E4C1" />
			<rect x="48" y="24" width="4" height="16" fill="#F4E4C1" />

			{/* Hair highlight layers */}
			<rect x="32" y="22" width="8" height="4" fill="#FAF0DC" />
			<rect x="42" y="24" width="4" height="4" fill="#FAF0DC" />

			{/* Hair strands (1px) */}
			<rect x="30" y="18" width="1" height="4" fill="#E6D4B0" />
			<rect x="34" y="17" width="1" height="5" fill="#FAF0DC" />
			<rect x="38" y="18" width="1" height="4" fill="#E6D4B0" />
			<rect x="42" y="17" width="1" height="5" fill="#F4E4C1" />
			<rect x="46" y="18" width="1" height="4" fill="#E6D4B0" />
			{/* Golden shine strands */}
			<rect x="36" y="21" width="1" height="4" fill="#FFFDF5" opacity="0.8" />
			<rect x="44" y="22" width="1" height="4" fill="#FFFDF5" opacity="0.7" />
			{/* Side strands (flowing) */}
			<rect x="27" y="26" width="1" height="10" fill="#E6D4B0" />
			<rect x="50" y="26" width="1" height="10" fill="#E6D4B0" />

			{/* === GROOM (Right - Kneeling) === */}
			{/* -- Legs (Kneeling Pose) -- (scaled 2x) */}
			{/* Back leg (Kneeling on ground) */}
			<rect x="96" y="104" width="20" height="8" fill="#1F2937" />
			<rect x="96" y="112" width="8" height="8" fill="#1F2937" />
			<rect x="116" y="108" width="4" height="8" fill="#111827" />

			{/* Front leg (Bent upright) */}
			<rect x="76" y="100" width="8" height="20" fill="#1F2937" />
			<rect x="80" y="92" width="16" height="8" fill="#1F2937" />
			<rect x="72" y="120" width="12" height="4" fill="#111827" />

			{/* NEW: Trouser details */}
			<rect x="78" y="102" width="2" height="16" fill="#374151" opacity="0.3" />
			<rect x="98" y="106" width="2" height="12" fill="#374151" opacity="0.3" />

			{/* -- Torso -- (scaled 2x) */}
			<rect x="80" y="56" width="24" height="36" fill="#374151" />
			<rect x="80" y="88" width="24" height="8" fill="#374151" />

			{/* NEW: Jacket details */}
			<rect x="84" y="60" width="16" height="4" fill="#4B5563" opacity="0.3" />
			<rect x="90" y="70" width="4" height="4" fill="#4B5563" opacity="0.5" />

			{/* -- Head -- (scaled 2x) */}
			<rect x="88" y="52" width="8" height="4" fill="#FFD4A3" />
			<rect x="84" y="32" width="18" height="20" fill="#FFD4A3" />

			{/* === GROOM FACE - HOPEFUL/SMILING (128-bit) === */}
			{/* Left eye */}
			<rect x="85" y="38" width="6" height="4" fill="#FFFFFF" />
			<rect x="86" y="39" width="4" height="2" fill="#4A3520" />
			<rect x="87" y="39" width="2" height="2" fill="#0F0F0F" />
			<rect x="86" y="39" width="2" height="1" fill="#FFFFFF" />
			<rect x="85" y="37" width="6" height="1" fill="#1F2937" />

			{/* Right eye */}
			<rect x="93" y="38" width="6" height="4" fill="#FFFFFF" />
			<rect x="94" y="39" width="4" height="2" fill="#4A3520" />
			<rect x="95" y="39" width="2" height="2" fill="#0F0F0F" />
			<rect x="94" y="39" width="2" height="1" fill="#FFFFFF" />
			<rect x="93" y="37" width="6" height="1" fill="#1F2937" />

			{/* Hopeful eyebrows (slightly raised inner) */}
			<rect x="85" y="35" width="6" height="2" fill="#2C1810" />
			<rect x="93" y="35" width="6" height="2" fill="#2C1810" />
			<rect x="86" y="36" width="2" height="1" fill="#3D241A" opacity="0.5" />
			<rect x="96" y="36" width="2" height="1" fill="#3D241A" opacity="0.5" />

			{/* Nose */}
			<rect x="91" y="40" width="2" height="2" fill="#E8C090" opacity="0.3" />
			<rect x="90" y="42" width="4" height="2" fill="#E8C090" opacity="0.4" />
			<rect x="90" y="43" width="2" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="92" y="43" width="2" height="1" fill="#D4A574" opacity="0.5" />

			{/* Hopeful smile (wider, genuine) */}
			<rect x="88" y="46" width="8" height="1" fill="#C87060" />
			<rect x="89" y="47" width="6" height="1" fill="#D88878" opacity="0.8" />
			<rect x="90" y="46" width="4" height="1" fill="#E09080" opacity="0.4" />
			{/* Smile upturn at corners */}
			<rect x="86" y="45" width="2" height="2" fill="#C87060" opacity="0.5" />
			<rect x="96" y="45" width="2" height="2" fill="#C87060" opacity="0.5" />

			{/* === GROOM HAIR (dark brown with strands) === */}
			<rect x="82" y="24" width="22" height="10" fill="#2C1810" />
			<rect x="102" y="28" width="2" height="8" fill="#2C1810" />

			{/* Hair texture layers */}
			<rect x="86" y="26" width="8" height="4" fill="#4A2C20" />

			{/* Hair strands (1px) */}
			<rect x="84" y="22" width="1" height="4" fill="#3D241A" />
			<rect x="88" y="21" width="1" height="5" fill="#4A2C20" />
			<rect x="92" y="22" width="1" height="4" fill="#3D241A" />
			<rect x="96" y="21" width="1" height="5" fill="#2C1810" />
			<rect x="100" y="22" width="1" height="4" fill="#3D241A" />
			{/* Highlight strands */}
			<rect x="90" y="25" width="1" height="3" fill="#5C3D2E" opacity="0.7" />
			<rect x="94" y="24" width="1" height="4" fill="#6B4D3A" opacity="0.6" />
			{/* Shadow strands */}
			<rect x="86" y="27" width="1" height="4" fill="#1F1510" opacity="0.4" />
			<rect x="98" y="26" width="1" height="5" fill="#1F1510" opacity="0.3" />

			{/* -- Arms -- (scaled 2x) */}
			{/* Right arm (back/balance) */}
			<rect x="104" y="60" width="6" height="20" fill="#374151" />

			{/* Left arm (EXTENDED with Ring) */}
			<rect x="72" y="64" width="12" height="6" fill="#374151" />
			{/* Cuff */}
			<rect x="70" y="64" width="2" height="4" fill="#FFFFFF" opacity="0.7" />

			{/* === EXTENDED HAND (holding ring box - 5 fingers) === */}
			<rect x="64" y="62" width="8" height="5" fill="#FFD4A3" />
			<rect x="64" y="64" width="2" height="3" fill="#E8C090" opacity="0.4" />
			{/* Thumb (supporting box) */}
			<rect x="62" y="64" width="2" height="4" fill="#FFD4A3" />
			<rect x="62" y="65" width="1" height="2" fill="#E8C090" opacity="0.4" />
			{/* Fingers (visible under box) */}
			<rect x="64" y="67" width="2" height="3" fill="#FFD4A3" />
			<rect x="66" y="67" width="2" height="4" fill="#FFD4A3" />
			<rect x="68" y="67" width="2" height="3" fill="#FFD4A3" />
			<rect x="70" y="68" width="2" height="2" fill="#FFD4A3" />
			{/* Finger shadows */}
			<rect x="65" y="67" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="67" y="67" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="69" y="67" width="1" height="1" fill="#D4A574" opacity="0.5" />

			{/* === THE RING & BOX === (scaled 2x + enhanced) */}
			{/* Ring Box (Black/Velvet) */}
			<rect x="60" y="60" width="8" height="6" fill="#111827" />

			{/* NEW: Box velvet texture */}
			<rect x="62" y="62" width="4" height="2" fill="#1F2937" />

			{/* Gold Band */}
			<rect x="62" y="56" width="4" height="4" fill="#F59E0B" />

			{/* NEW: Gold shine */}
			<rect x="63" y="57" width="2" height="2" fill="#FCD34D" />

			{/* THE DIAMOND (Big & Sparkly) */}
			<rect x="62" y="52" width="4" height="4" fill="#E0F2FE" />
			<rect x="60" y="50" width="8" height="8" fill="#FFFFFF" opacity="0.6" />

			{/* Sparkles/Glints (scaled 2x + enhanced) */}
			<rect x="62" y="48" width="4" height="2" fill="#FFFFFF" />
			<rect x="62" y="58" width="4" height="2" fill="#FFFFFF" />
			<rect x="58" y="52" width="2" height="4" fill="#FFFFFF" />
			<rect x="68" y="52" width="2" height="4" fill="#FFFFFF" />

			{/* NEW: Extra sparkle rays */}
			<rect x="56" y="50" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
			<rect x="70" y="50" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
			<rect x="60" y="46" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			<rect x="66" y="46" width="2" height="2" fill="#FFFFFF" opacity="0.6" />

			{/* ENHANCED: Diamond sparkle cross pattern */}
			<g opacity="0.9">
				<rect x="62" y="44" width="2" height="8" fill="#FFFFFF" opacity="0.4" />
				<rect x="56" y="54" width="8" height="2" fill="#FFFFFF" opacity="0.4" />

				{/* Diagonal sparkles */}
				<rect x="58" y="48" width="2" height="2" fill="#BFDBFE" opacity="0.6" />
				<rect x="68" y="48" width="2" height="2" fill="#BFDBFE" opacity="0.6" />
				<rect x="58" y="58" width="2" height="2" fill="#BFDBFE" opacity="0.5" />
				<rect x="68" y="58" width="2" height="2" fill="#BFDBFE" opacity="0.5" />
			</g>

			{/* ENHANCED: Floating hearts */}
			<g opacity="0.7">
				{/* Heart 1 - top left */}
				<rect x="14" y="16" width="4" height="4" fill="#EC4899" />
				<rect x="18" y="16" width="4" height="4" fill="#EC4899" />
				<rect x="16" y="20" width="4" height="4" fill="#EC4899" />
				<rect x="18" y="24" width="2" height="2" fill="#EC4899" />

				{/* Heart 2 - top right */}
				<rect x="106" y="12" width="3" height="3" fill="#F472B6" />
				<rect x="109" y="12" width="3" height="3" fill="#F472B6" />
				<rect x="107" y="15" width="3" height="3" fill="#F472B6" />
				<rect x="108" y="18" width="2" height="2" fill="#F472B6" />

				{/* Small hearts */}
				<rect x="54" y="26" width="2" height="2" fill="#FBCFE8" />
				<rect x="120" y="44" width="2" height="2" fill="#FBCFE8" />
			</g>

			{/* ENHANCED: Bride cheek blush - surprised/happy */}
			<rect x="34" y="40" width="4" height="2" fill="#FF9BB0" opacity="0.5" />
			<rect x="44" y="40" width="4" height="2" fill="#FF9BB0" opacity="0.5" />

			{/* ENHANCED: Dress shimmer */}
			<rect x="36" y="74" width="2" height="2" fill="#F9A8D4" opacity="0.6" />
			<rect x="32" y="88" width="2" height="2" fill="#F9A8D4" opacity="0.5" />
			<rect x="40" y="82" width="2" height="2" fill="#F9A8D4" opacity="0.5" />

			{/* ENHANCED: Ground shadow */}
			<rect x="24" y="124" width="96" height="2" fill="#1F2937" opacity="0.2" />

			{/* ENHANCED: Groom suit highlight */}
			<rect x="82" y="58" width="2" height="8" fill="#6B7280" opacity="0.3" />

			{/* ENHANCED: Ring box inner glow */}
			<rect x="61" y="61" width="6" height="4" fill="#7C3AED" opacity="0.15" />
		</svg>
	);
}
