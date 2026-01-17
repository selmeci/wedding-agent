export function WeddingCouple({ className = "" }: { className?: string }) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Svadobný pár"
		>
			{/* === GROOM (Left) === */}
			{/* -- Legs & Shoes -- (scaled 2x) */}
			{/* Left leg (back) */}
			<rect x="44" y="96" width="10" height="28" fill="#1F2937" />
			<rect x="42" y="124" width="12" height="4" fill="#111827" />
			{/* Right leg (front) */}
			<rect x="58" y="96" width="10" height="28" fill="#1F2937" />
			<rect x="58" y="124" width="12" height="4" fill="#111827" />

			{/* NEW: Trouser creases */}
			<rect x="48" y="98" width="2" height="24" fill="#111827" opacity="0.3" />
			<rect x="62" y="98" width="2" height="24" fill="#111827" opacity="0.3" />

			{/* -- Torso / Suit -- (scaled 2x) */}
			<rect x="42" y="56" width="28" height="40" fill="#1F2937" />

			{/* Lapels (Shadow) */}
			<rect x="48" y="58" width="2" height="16" fill="#111827" opacity="0.5" />
			<rect x="62" y="58" width="2" height="16" fill="#111827" opacity="0.5" />

			{/* Shirt (White V) */}
			<rect x="52" y="56" width="8" height="12" fill="#FFFFFF" />

			{/* Bow Tie (scaled 2x + enhanced) */}
			<rect x="54" y="58" width="4" height="2" fill="#111827" />
			<rect x="52" y="56" width="2" height="2" fill="#111827" />
			<rect x="58" y="56" width="2" height="2" fill="#111827" />

			{/* NEW: Bow tie center */}
			<rect x="55" y="57" width="2" height="2" fill="#374151" />

			{/* -- Arms -- (scaled 2x) */}
			{/* Left Arm (down by side) */}
			<rect x="38" y="58" width="6" height="22" fill="#1F2937" />
			{/* Arm shadow detail */}
			<rect x="40" y="60" width="2" height="16" fill="#111827" opacity="0.3" />
			{/* Cuff */}
			<rect x="38" y="78" width="6" height="2" fill="#FFFFFF" opacity="0.7" />

			{/* === GROOM LEFT HAND (fingers visible) === */}
			<rect x="36" y="80" width="8" height="5" fill="#FFD4A3" />
			{/* Fingers */}
			<rect x="36" y="85" width="2" height="4" fill="#FFD4A3" />
			<rect x="38" y="85" width="2" height="5" fill="#FFD4A3" />
			<rect x="40" y="85" width="2" height="4" fill="#FFD4A3" />
			<rect x="42" y="86" width="2" height="3" fill="#FFD4A3" />
			{/* Thumb */}
			<rect x="34" y="81" width="2" height="4" fill="#FFD4A3" />
			{/* Finger shadows */}
			<rect x="37" y="85" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="39" y="85" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="41" y="85" width="1" height="1" fill="#D4A574" opacity="0.5" />

			{/* Right Arm (reaching for bride) */}
			<rect x="68" y="64" width="14" height="6" fill="#1F2937" />

			{/* NEW: Sleeve cuff */}
			<rect x="38" y="80" width="6" height="2" fill="#FFFFFF" opacity="0.6" />

			{/* -- Head -- (scaled 2x) */}
			{/* Neck */}
			<rect x="52" y="52" width="8" height="4" fill="#FFD4A3" />

			{/* Face */}
			<rect x="48" y="32" width="18" height="20" fill="#FFD4A3" />

			{/* Ear */}
			<rect x="46" y="40" width="2" height="6" fill="#E0B88A" />

			{/* === GROOM FACE FEATURES (profile view - 128-bit detail) === */}
			{/* Eye with anatomy (visible eye only) */}
			<rect x="57" y="38" width="6" height="4" fill="#FFFFFF" />
			<rect x="58" y="39" width="4" height="2" fill="#4A3520" />
			<rect x="59" y="39" width="2" height="2" fill="#0F0F0F" />
			<rect x="58" y="39" width="2" height="1" fill="#FFFFFF" />
			<rect x="57" y="37" width="6" height="1" fill="#1F2937" />

			{/* Eyebrow */}
			<rect x="57" y="35" width="6" height="2" fill="#2C1810" />
			<rect x="58" y="36" width="2" height="1" fill="#3D241A" opacity="0.5" />

			{/* Nose (profile) */}
			<rect x="62" y="40" width="2" height="3" fill="#E8C090" opacity="0.4" />
			<rect x="63" y="42" width="1" height="2" fill="#D4A574" opacity="0.5" />

			{/* Mouth with lips */}
			<rect x="58" y="46" width="6" height="1" fill="#C87060" />
			<rect x="59" y="47" width="4" height="1" fill="#D88878" opacity="0.7" />
			<rect x="60" y="46" width="2" height="1" fill="#E09080" opacity="0.4" />

			{/* === GROOM HAIR (with strands) === */}
			<rect x="46" y="28" width="20" height="8" fill="#2C1810" />
			<rect x="46" y="30" width="4" height="12" fill="#2C1810" />
			<rect x="48" y="26" width="16" height="4" fill="#4A2C20" />

			{/* Hair texture layers */}
			<rect x="52" y="28" width="6" height="4" fill="#3D241A" />

			{/* Hair strands (1px) */}
			<rect x="49" y="25" width="1" height="4" fill="#3D241A" />
			<rect x="52" y="24" width="1" height="5" fill="#4A2C20" />
			<rect x="55" y="25" width="1" height="4" fill="#3D241A" />
			<rect x="58" y="24" width="1" height="5" fill="#2C1810" />
			<rect x="61" y="25" width="1" height="4" fill="#3D241A" />
			{/* Highlight strands */}
			<rect x="53" y="27" width="1" height="3" fill="#5C3D2E" opacity="0.7" />
			<rect x="59" y="28" width="1" height="3" fill="#6B4D3A" opacity="0.6" />
			{/* Shadow strands */}
			<rect x="50" y="30" width="1" height="4" fill="#1F1510" opacity="0.4" />
			<rect x="56" y="29" width="1" height="5" fill="#1F1510" opacity="0.3" />

			{/* === BRIDE (Right) === */}
			{/* -- Dress (Bottom/Skirt) -- (scaled 2x) */}
			{/* Main flowy shape */}
			<rect x="84" y="88" width="28" height="40" fill="#FFFFFF" />
			<rect x="80" y="96" width="4" height="32" fill="#FFFFFF" />
			<rect x="112" y="96" width="4" height="32" fill="#FFFFFF" />

			{/* Shadows / Folds in dress */}
			<rect x="90" y="92" width="2" height="32" fill="#F3F4F6" />
			<rect x="104" y="92" width="2" height="32" fill="#F3F4F6" />
			<rect x="96" y="104" width="4" height="20" fill="#F3F4F6" />

			{/* NEW: Lace detail */}
			<rect x="86" y="120" width="24" height="2" fill="#E5E7EB" />
			<rect x="88" y="116" width="4" height="2" fill="#E5E7EB" />
			<rect x="104" y="116" width="4" height="2" fill="#E5E7EB" />

			{/* -- Torso -- (scaled 2x) */}
			<rect x="88" y="58" width="20" height="30" fill="#FFFFFF" />
			<rect x="92" y="60" width="12" height="8" fill="#FFE3E8" opacity="0.3" />

			{/* NEW: Bodice detail */}
			<rect x="94" y="62" width="8" height="4" fill="#FBCFE8" opacity="0.3" />

			{/* -- Arms -- (scaled 2x) */}
			{/* Right Arm (down) */}
			<rect x="108" y="64" width="6" height="20" fill="#FFD4A3" />

			{/* Left Arm (holding groom) */}
			<rect x="82" y="64" width="8" height="6" fill="#FFD4A3" />

			{/* === BRIDE HAND (holding groom - fingers visible) === */}
			<rect x="78" y="65" width="6" height="5" fill="#FFD4A3" />
			{/* Fingers wrapping around */}
			<rect x="76" y="66" width="2" height="4" fill="#FFD4A3" />
			<rect x="78" y="70" width="2" height="3" fill="#FFD4A3" />
			<rect x="80" y="70" width="2" height="3" fill="#FFD4A3" />
			<rect x="82" y="70" width="2" height="2" fill="#FFD4A3" />
			{/* Finger shadows */}
			<rect x="79" y="70" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="81" y="70" width="1" height="1" fill="#D4A574" opacity="0.5" />
			{/* Fingernails (feminine pink) */}
			<rect x="78" y="72" width="2" height="1" fill="#FFCCD0" opacity="0.5" />
			<rect x="80" y="72" width="2" height="1" fill="#FFCCD0" opacity="0.5" />

			{/* -- Head -- (scaled 2x) */}
			{/* Neck */}
			<rect x="94" y="54" width="8" height="4" fill="#FFD4A3" />

			{/* Face */}
			<rect x="90" y="34" width="18" height="20" fill="#FFD4A3" />

			{/* === BRIDE FACE FEATURES (profile view - 128-bit feminine) === */}
			{/* Eye with anatomy + feminine lashes */}
			<rect x="91" y="40" width="6" height="4" fill="#FFFFFF" />
			<rect x="92" y="41" width="4" height="2" fill="#5B7A8A" />
			<rect x="93" y="41" width="2" height="2" fill="#0F0F0F" />
			<rect x="92" y="41" width="2" height="1" fill="#FFFFFF" />
			<rect x="91" y="39" width="6" height="1" fill="#1F2937" />
			{/* Feminine lashes */}
			<rect x="91" y="38" width="1" height="2" fill="#1F2937" />
			<rect x="93" y="37" width="1" height="3" fill="#1F2937" />
			<rect x="95" y="38" width="1" height="2" fill="#1F2937" />

			{/* Eyebrow (feminine - thinner) */}
			<rect x="91" y="36" width="5" height="1" fill="#A08060" />

			{/* Cheek blush */}
			<rect x="92" y="44" width="4" height="3" fill="#FF9BB0" opacity="0.5" />
			<rect x="93" y="45" width="2" height="1" fill="#FFAFC0" opacity="0.3" />

			{/* Nose (delicate) */}
			<rect x="88" y="42" width="2" height="2" fill="#E8C090" opacity="0.35" />
			<rect x="87" y="43" width="1" height="2" fill="#D4A574" opacity="0.4" />

			{/* Mouth with pink lips */}
			<rect x="88" y="48" width="5" height="1" fill="#E87080" />
			<rect x="89" y="49" width="3" height="1" fill="#F08090" opacity="0.8" />
			<rect x="90" y="48" width="2" height="1" fill="#F5A0A8" opacity="0.5" />

			{/* === BRIDE HAIR (blonde with strands) === */}
			<rect x="88" y="30" width="24" height="12" fill="#F4E4C1" />
			<rect x="108" y="36" width="8" height="24" fill="#F4E4C1" />
			<rect x="86" y="34" width="4" height="12" fill="#F4E4C1" />

			{/* Hair highlight layers */}
			<rect x="92" y="32" width="8" height="4" fill="#FAF0DC" />

			{/* Hair strands (1px) - flowing style */}
			<rect x="90" y="28" width="1" height="5" fill="#E6D4B0" />
			<rect x="94" y="27" width="1" height="6" fill="#FAF0DC" />
			<rect x="98" y="28" width="1" height="5" fill="#E6D4B0" />
			<rect x="102" y="27" width="1" height="6" fill="#F4E4C1" />
			<rect x="106" y="28" width="1" height="5" fill="#E6D4B0" />
			{/* Flowing side strands */}
			<rect x="109" y="38" width="1" height="10" fill="#E6D4B0" />
			<rect x="111" y="40" width="1" height="12" fill="#FFFDF5" opacity="0.6" />
			<rect x="113" y="42" width="1" height="10" fill="#D4C4A0" opacity="0.5" />
			{/* Highlight strands (golden shine) */}
			<rect x="96" y="31" width="1" height="4" fill="#FFFDF5" opacity="0.8" />
			<rect x="100" y="30" width="1" height="5" fill="#FFFDF5" opacity="0.7" />

			{/* Veil (scaled 2x) */}
			<rect x="88" y="28" width="28" height="4" fill="#FFFFFF" opacity="0.7" />
			<rect x="112" y="32" width="16" height="60" fill="#FFFFFF" opacity="0.4" />

			{/* NEW: Veil sparkles */}
			<rect x="116" y="40" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
			<rect x="120" y="56" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
			<rect x="114" y="72" width="2" height="2" fill="#FFFFFF" opacity="0.8" />

			{/* Flower in hair (scaled 2x + enhanced) */}
			<rect x="106" y="30" width="6" height="6" fill="#FFFFFF" />
			<rect x="108" y="32" width="2" height="2" fill="#FF9BB0" />

			{/* NEW: Extra flower petals */}
			<rect x="104" y="32" width="2" height="2" fill="#FBCFE8" />
			<rect x="110" y="28" width="2" height="2" fill="#FBCFE8" />

			{/* === HEART (Floating above) === (scaled 2x + enhanced) */}
			{/* Shadow/Outline */}
			<rect x="72" y="12" width="4" height="4" fill="#BE185D" />
			<rect x="80" y="12" width="4" height="4" fill="#BE185D" />
			<rect x="70" y="14" width="16" height="8" fill="#BE185D" />
			<rect x="72" y="22" width="12" height="4" fill="#BE185D" />
			<rect x="76" y="26" width="4" height="4" fill="#BE185D" />

			{/* Main Pink */}
			<rect x="72" y="14" width="4" height="4" fill="#EC4899" />
			<rect x="80" y="14" width="4" height="4" fill="#EC4899" />
			<rect x="72" y="16" width="12" height="6" fill="#EC4899" />
			<rect x="74" y="22" width="8" height="4" fill="#EC4899" />
			<rect x="76" y="26" width="4" height="2" fill="#EC4899" />

			{/* Highlight */}
			<rect x="74" y="16" width="2" height="2" fill="#FFFFFF" opacity="0.8" />

			{/* NEW: Additional heart detail */}
			<rect x="76" y="18" width="4" height="2" fill="#F472B6" />
			<rect x="72" y="14" width="2" height="2" fill="#F9A8D4" />

			{/* ENHANCED: Heart sparkles and glow */}
			<g opacity="0.9">
				{/* Heart sparkle top */}
				<rect x="68" y="8" width="2" height="2" fill="#FFFFFF" />
				<rect x="66" y="10" width="2" height="4" fill="#FFFFFF" opacity="0.5" />
				<rect x="62" y="12" width="6" height="2" fill="#FFFFFF" opacity="0.5" />

				{/* Heart sparkle right */}
				<rect x="86" y="14" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
			</g>

			{/* ENHANCED: Floating love particles */}
			<g opacity="0.6">
				<rect x="36" y="20" width="2" height="2" fill="#FF6B9D" />
				<rect x="124" y="24" width="2" height="2" fill="#FF6B9D" />
				<rect x="28" y="44" width="2" height="2" fill="#FBCFE8" />
				<rect x="118" y="52" width="2" height="2" fill="#FBCFE8" />
			</g>

			{/* ENHANCED: Dress sparkles on bride */}
			<g opacity="0.8">
				<rect x="92" y="96" width="2" height="2" fill="#FFFFFF" />
				<rect x="102" y="108" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
				<rect x="86" y="114" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			</g>

			{/* ENHANCED: Suit highlight on groom */}
			<rect x="44" y="58" width="2" height="4" fill="#374151" opacity="0.4" />

			{/* ENHANCED: Hand holding detail - interlinked */}
			<rect x="78" y="66" width="4" height="4" fill="#FFE8D0" />

			{/* ENHANCED: Ground shadow */}
			<rect x="40" y="126" width="76" height="2" fill="#1F2937" opacity="0.2" />

			{/* ENHANCED: Additional veil flow sparkles */}
			<rect x="118" y="48" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			<rect x="122" y="68" width="2" height="2" fill="#FFFFFF" opacity="0.5" />
		</svg>
	);
}
