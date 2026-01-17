export function Heart({
	className = "",
	animated = false,
}: {
	className?: string;
	animated?: boolean;
}) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className} ${animated ? "animate-pulse" : ""}`}
			role="img"
			aria-label="Srdce"
		>
			{/* === 5-LEVEL GRADIENT HEART (128-bit detail) === */}
			{/*
				Level 1 (darkest): #CC1A50
				Level 2 (dark):    #E6215C
				Level 3 (base):    #FF3D6F
				Level 4 (light):   #FF6B8E
				Level 5 (highlight): #FFE3E8
			*/}

			{/* === HEART BASE SHAPE - 5-level gradient from bottom to top === */}

			{/* Bottom tip - Level 5 (lightest, catching light) */}
			<rect x="60" y="84" width="8" height="4" fill="#FFE3E8" />
			<rect x="58" y="82" width="12" height="2" fill="#FFC9D4" />

			{/* Lower section - Level 4 */}
			<rect x="56" y="80" width="16" height="4" fill="#FFC9D4" />
			<rect x="52" y="78" width="24" height="2" fill="#FFADC0" />
			<rect x="48" y="72" width="32" height="6" fill="#FF9BB0" />

			{/* Middle section - Level 3 (base color) */}
			<rect x="44" y="70" width="40" height="2" fill="#FF8AAB" />
			<rect x="40" y="64" width="48" height="6" fill="#FF6B8E" />
			<rect x="36" y="62" width="56" height="2" fill="#FF7FA0" />
			<rect x="32" y="56" width="64" height="6" fill="#FF6B8E" />

			{/* Upper section - Level 2-3 transition */}
			<rect x="28" y="52" width="72" height="4" fill="#FF5580" />
			<rect x="24" y="48" width="80" height="4" fill="#FF4D7A" />
			<rect x="24" y="44" width="80" height="4" fill="#FF3D6F" />
			<rect x="24" y="40" width="80" height="4" fill="#FF3D6F" />

			{/* Top bulbs - Level 2-3 */}
			<rect x="32" y="32" width="24" height="8" fill="#FF3D6F" />
			<rect x="72" y="32" width="24" height="8" fill="#FF3D6F" />
			<rect x="36" y="34" width="16" height="4" fill="#FF4D7A" />
			<rect x="76" y="34" width="16" height="4" fill="#FF4D7A" />

			{/* === OUTLINE - Level 1 (darkest) with anti-aliasing === */}
			{/* Outer edge - solid */}
			<rect x="24" y="32" width="8" height="8" fill="#E6215C" />
			<rect x="96" y="32" width="8" height="8" fill="#E6215C" />
			<rect x="16" y="40" width="8" height="16" fill="#E6215C" />
			<rect x="104" y="40" width="8" height="16" fill="#E6215C" />
			<rect x="24" y="56" width="8" height="8" fill="#E6215C" />
			<rect x="96" y="56" width="8" height="8" fill="#E6215C" />
			<rect x="32" y="64" width="8" height="8" fill="#E6215C" />
			<rect x="88" y="64" width="8" height="8" fill="#E6215C" />
			<rect x="40" y="72" width="8" height="8" fill="#E6215C" />
			<rect x="80" y="72" width="8" height="8" fill="#E6215C" />
			<rect x="48" y="80" width="8" height="8" fill="#E6215C" />
			<rect x="72" y="80" width="8" height="8" fill="#E6215C" />
			<rect x="56" y="88" width="16" height="8" fill="#E6215C" />

			{/* Deepest outline - Level 1 */}
			<rect x="28" y="36" width="4" height="4" fill="#CC1A50" />
			<rect x="96" y="36" width="4" height="4" fill="#CC1A50" />
			<rect x="20" y="44" width="4" height="12" fill="#CC1A50" />
			<rect x="104" y="44" width="4" height="12" fill="#CC1A50" />
			<rect x="28" y="56" width="4" height="8" fill="#CC1A50" />
			<rect x="96" y="56" width="4" height="8" fill="#CC1A50" />

			{/* === ANTI-ALIASED EDGES (transitional pixels) === */}
			{/* Left edge anti-aliasing */}
			<rect x="23" y="40" width="1" height="16" fill="#FF3D6F" opacity="0.5" />
			<rect x="22" y="42" width="1" height="12" fill="#FF3D6F" opacity="0.25" />
			<rect x="31" y="56" width="1" height="8" fill="#FF6B8E" opacity="0.5" />
			<rect x="30" y="58" width="1" height="4" fill="#FF6B8E" opacity="0.25" />
			<rect x="39" y="64" width="1" height="8" fill="#FF9BB0" opacity="0.5" />
			<rect x="38" y="66" width="1" height="4" fill="#FF9BB0" opacity="0.25" />
			<rect x="47" y="72" width="1" height="8" fill="#FFC9D4" opacity="0.5" />
			<rect x="46" y="74" width="1" height="4" fill="#FFC9D4" opacity="0.25" />

			{/* Right edge anti-aliasing */}
			<rect x="104" y="40" width="1" height="16" fill="#FF3D6F" opacity="0.5" />
			<rect x="105" y="42" width="1" height="12" fill="#FF3D6F" opacity="0.25" />
			<rect x="96" y="56" width="1" height="8" fill="#FF6B8E" opacity="0.5" />
			<rect x="97" y="58" width="1" height="4" fill="#FF6B8E" opacity="0.25" />
			<rect x="88" y="64" width="1" height="8" fill="#FF9BB0" opacity="0.5" />
			<rect x="89" y="66" width="1" height="4" fill="#FF9BB0" opacity="0.25" />
			<rect x="80" y="72" width="1" height="8" fill="#FFC9D4" opacity="0.5" />
			<rect x="81" y="74" width="1" height="4" fill="#FFC9D4" opacity="0.25" />

			{/* Top curve anti-aliasing */}
			<rect x="32" y="31" width="24" height="1" fill="#FF3D6F" opacity="0.4" />
			<rect x="72" y="31" width="24" height="1" fill="#FF3D6F" opacity="0.4" />
			<rect x="56" y="39" width="16" height="1" fill="#FF4D7A" opacity="0.5" />

			{/* Bottom tip anti-aliasing */}
			<rect x="55" y="88" width="1" height="4" fill="#E6215C" opacity="0.5" />
			<rect x="72" y="88" width="1" height="4" fill="#E6215C" opacity="0.5" />
			<rect x="58" y="92" width="12" height="1" fill="#E6215C" opacity="0.4" />

			{/* === HIGHLIGHTS - Level 5 (brightest) === */}
			{/* Main highlight on left bulb */}
			<rect x="38" y="36" width="10" height="6" fill="#FFE3E8" />
			<rect x="40" y="38" width="6" height="4" fill="#FFF0F3" />
			<rect x="42" y="40" width="4" height="2" fill="#FFFFFF" />

			{/* Secondary highlight */}
			<rect x="44" y="44" width="8" height="6" fill="#FFE3E8" />
			<rect x="46" y="46" width="4" height="4" fill="#FFF5F7" />
			<rect x="48" y="48" width="2" height="2" fill="#FFFFFF" opacity="0.8" />

			{/* Tertiary highlight */}
			<rect x="50" y="52" width="6" height="4" fill="#FFDDE5" />
			<rect x="52" y="54" width="2" height="2" fill="#FFF0F3" opacity="0.7" />

			{/* Rim light on right side */}
			<rect x="88" y="38" width="4" height="4" fill="#FFB0C5" opacity="0.5" />
			<rect x="92" y="44" width="4" height="8" fill="#FFABC5" opacity="0.4" />

			{/* === INNER GLOW (soft radial gradient effect) === */}
			<rect x="56" y="44" width="16" height="6" fill="#FF8AAB" opacity="0.5" />
			<rect x="52" y="50" width="24" height="4" fill="#FF9BB0" opacity="0.4" />
			<rect x="48" y="54" width="32" height="4" fill="#FFABC5" opacity="0.35" />
			<rect x="44" y="58" width="40" height="4" fill="#FFB8CD" opacity="0.3" />

			{/* === SHADOW DETAIL (right side depth) === */}
			<rect x="86" y="42" width="6" height="12" fill="#CC1A50" opacity="0.25" />
			<rect x="82" y="54" width="6" height="8" fill="#CC1A50" opacity="0.2" />
			<rect x="76" y="62" width="6" height="8" fill="#D11A4A" opacity="0.15" />
			<rect x="70" y="70" width="6" height="6" fill="#D11A4A" opacity="0.1" />

			{/* === 1px DETAIL PIXELS (true 128-bit refinement) === */}
			{/* Gradient transition pixels */}
			<rect x="34" y="40" width="1" height="4" fill="#FF5580" />
			<rect x="36" y="42" width="1" height="4" fill="#FF6B8E" />
			<rect x="90" y="40" width="1" height="4" fill="#FF4D7A" />
			<rect x="92" y="42" width="1" height="4" fill="#FF5580" />

			{/* Subtle color variation pixels */}
			<rect x="58" y="62" width="2" height="2" fill="#FF7DA5" />
			<rect x="68" y="62" width="2" height="2" fill="#FF7DA5" />
			<rect x="54" y="68" width="2" height="2" fill="#FF9BB0" />
			<rect x="72" y="68" width="2" height="2" fill="#FF9BB0" />
			<rect x="60" y="74" width="2" height="2" fill="#FFADC0" />
			<rect x="66" y="74" width="2" height="2" fill="#FFADC0" />

			{/* Bottom center glow */}
			<rect x="62" y="86" width="4" height="2" fill="#FFE8ED" opacity="0.7" />

			{/* ENHANCED: Sparkle effects */}
			<g opacity="0.9">
				{/* Top left sparkle */}
				<rect x="28" y="24" width="4" height="4" fill="#FFFFFF" />
				<rect x="26" y="26" width="2" height="8" fill="#FFFFFF" opacity="0.6" />
				<rect x="22" y="28" width="8" height="2" fill="#FFFFFF" opacity="0.6" />

				{/* Top right sparkle */}
				<rect x="96" y="28" width="4" height="4" fill="#FFFFFF" />
				<rect x="98" y="26" width="2" height="8" fill="#FFFFFF" opacity="0.5" />
				<rect x="94" y="30" width="8" height="2" fill="#FFFFFF" opacity="0.5" />

				{/* Small accent sparkles */}
				<rect x="48" y="36" width="2" height="2" fill="#FFFFFF" />
				<rect x="80" y="44" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
				<rect x="36" y="48" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
			</g>

			{/* ENHANCED: Deeper shadow on right side */}
			<rect x="92" y="44" width="4" height="12" fill="#D11A4A" opacity="0.4" />
			<rect x="84" y="56" width="4" height="8" fill="#D11A4A" opacity="0.3" />
			<rect x="76" y="64" width="4" height="8" fill="#D11A4A" opacity="0.25" />

			{/* ENHANCED: Subtle reflection at bottom */}
			<rect x="58" y="86" width="12" height="2" fill="#FFABC5" opacity="0.5" />

			{/* ENHANCED: Inner heart glow */}
			<rect x="56" y="48" width="16" height="8" fill="#FF7090" opacity="0.3" />
			<rect x="52" y="56" width="24" height="4" fill="#FF8AAB" opacity="0.25" />
		</svg>
	);
}
