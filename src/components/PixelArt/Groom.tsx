export function Groom({ className = "" }: { className?: string }) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Ženích"
		>
			{/* === LEGS & SHOES === (scaled 2x) */}
			{/* Left Leg */}
			<rect x="48" y="88" width="12" height="36" fill="#1F2937" />
			<rect x="44" y="124" width="16" height="4" fill="#111827" />
			<rect x="52" y="88" width="2" height="36" fill="#111827" opacity="0.3" />

			{/* NEW: Trouser details */}
			<rect x="48" y="100" width="12" height="2" fill="#111827" opacity="0.2" />
			<rect x="50" y="110" width="2" height="14" fill="#374151" opacity="0.3" />

			{/* Right Leg */}
			<rect x="68" y="88" width="12" height="36" fill="#1F2937" />
			<rect x="68" y="124" width="16" height="4" fill="#111827" />
			<rect x="74" y="88" width="2" height="36" fill="#111827" opacity="0.3" />

			{/* NEW: Trouser details */}
			<rect x="68" y="100" width="12" height="2" fill="#111827" opacity="0.2" />
			<rect x="76" y="110" width="2" height="14" fill="#374151" opacity="0.3" />

			{/* NEW: Shoe shine highlights */}
			<rect x="46" y="125" width="4" height="2" fill="#374151" opacity="0.4" />
			<rect x="70" y="125" width="4" height="2" fill="#374151" opacity="0.4" />

			{/* === TORSO (Suit) === (scaled 2x) */}
			<rect x="44" y="52" width="40" height="36" fill="#1F2937" />

			{/* Jacket Shadow/Shape */}
			<rect x="44" y="84" width="40" height="4" fill="#111827" opacity="0.4" />

			{/* NEW: Jacket structure details */}
			<rect x="46" y="56" width="2" height="28" fill="#111827" opacity="0.3" />
			<rect x="80" y="56" width="2" height="28" fill="#111827" opacity="0.3" />

			{/* White Shirt Area (scaled 2x) */}
			<rect x="56" y="52" width="16" height="20" fill="#FFFFFF" />

			{/* NEW: Shirt texture */}
			<rect x="58" y="54" width="12" height="16" fill="#F9FAFB" />
			<rect x="62" y="56" width="4" height="12" fill="#FFFFFF" />

			{/* Lapels (scaled 2x + enhanced) */}
			<rect x="52" y="52" width="4" height="20" fill="#111827" />
			<rect x="72" y="52" width="4" height="20" fill="#111827" />

			{/* NEW: Lapel shading */}
			<rect x="54" y="54" width="2" height="16" fill="#1F2937" />
			<rect x="72" y="54" width="2" height="16" fill="#1F2937" />

			{/* Bow Tie (scaled 2x + enhanced) */}
			<rect x="60" y="54" width="8" height="4" fill="#111827" />
			<rect x="58" y="52" width="12" height="2" fill="#111827" />

			{/* NEW: Bow tie detail */}
			<rect x="62" y="55" width="4" height="2" fill="#374151" />
			<rect x="58" y="54" width="2" height="2" fill="#1F2937" />
			<rect x="68" y="54" width="2" height="2" fill="#1F2937" />

			{/* Buttons (scaled 2x + enhanced) */}
			<rect x="62" y="64" width="4" height="4" fill="#D1D5DB" />
			<rect x="62" y="76" width="4" height="4" fill="#1F2937" />

			{/* NEW: Button shine */}
			<rect x="63" y="65" width="2" height="2" fill="#E5E7EB" />

			{/* Flower in Lapel (Boutonnière) (scaled 2x + enhanced) */}
			<rect x="74" y="60" width="4" height="4" fill="#F472B6" />
			<rect x="74" y="64" width="2" height="4" fill="#22C55E" />

			{/* NEW: Flower detail */}
			<rect x="75" y="61" width="2" height="2" fill="#FBCFE8" />
			<rect x="72" y="62" width="2" height="2" fill="#F9A8D4" />
			<rect x="78" y="62" width="2" height="2" fill="#F9A8D4" />

			{/* === ARMS === (scaled 2x) */}
			{/* Left Arm */}
			<rect x="36" y="56" width="8" height="24" fill="#1F2937" />
			<rect x="36" y="76" width="8" height="4" fill="#FFFFFF" opacity="0.8" />
			{/* Arm shadow detail */}
			<rect x="38" y="58" width="2" height="18" fill="#111827" opacity="0.3" />

			{/* === LEFT HAND (5 fingers) === */}
			{/* Palm base */}
			<rect x="34" y="80" width="10" height="6" fill="#FFD4A3" />
			{/* Palm shadow */}
			<rect x="34" y="82" width="3" height="4" fill="#E8C090" opacity="0.4" />
			{/* Thumb (side, pointing out) */}
			<rect x="32" y="81" width="2" height="5" fill="#FFD4A3" />
			<rect x="32" y="82" width="1" height="3" fill="#E8C090" opacity="0.4" />
			{/* Index finger */}
			<rect x="34" y="86" width="2" height="5" fill="#FFD4A3" />
			<rect x="34" y="89" width="1" height="2" fill="#E8C090" opacity="0.3" />
			{/* Middle finger (longest) */}
			<rect x="36" y="86" width="2" height="6" fill="#FFD4A3" />
			<rect x="36" y="90" width="1" height="2" fill="#E8C090" opacity="0.3" />
			{/* Ring finger */}
			<rect x="38" y="86" width="2" height="5" fill="#FFD4A3" />
			<rect x="38" y="89" width="1" height="2" fill="#E8C090" opacity="0.3" />
			{/* Pinky (shortest) */}
			<rect x="40" y="87" width="2" height="4" fill="#FFD4A3" />
			{/* Finger gaps / knuckle shadows */}
			<rect x="35" y="86" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="37" y="86" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="39" y="86" width="1" height="1" fill="#D4A574" opacity="0.5" />

			{/* Right Arm */}
			<rect x="84" y="56" width="8" height="24" fill="#1F2937" />
			<rect x="84" y="76" width="8" height="4" fill="#FFFFFF" opacity="0.8" />
			{/* Arm shadow detail */}
			<rect x="88" y="58" width="2" height="18" fill="#111827" opacity="0.3" />

			{/* === RIGHT HAND (5 fingers - mirrored) === */}
			{/* Palm base */}
			<rect x="84" y="80" width="10" height="6" fill="#FFD4A3" />
			{/* Palm shadow */}
			<rect x="91" y="82" width="3" height="4" fill="#E8C090" opacity="0.4" />
			{/* Thumb (side, pointing out) */}
			<rect x="94" y="81" width="2" height="5" fill="#FFD4A3" />
			<rect x="95" y="82" width="1" height="3" fill="#E8C090" opacity="0.4" />
			{/* Pinky */}
			<rect x="84" y="87" width="2" height="4" fill="#FFD4A3" />
			{/* Ring finger */}
			<rect x="86" y="86" width="2" height="5" fill="#FFD4A3" />
			<rect x="87" y="89" width="1" height="2" fill="#E8C090" opacity="0.3" />
			{/* Middle finger (longest) */}
			<rect x="88" y="86" width="2" height="6" fill="#FFD4A3" />
			<rect x="89" y="90" width="1" height="2" fill="#E8C090" opacity="0.3" />
			{/* Index finger */}
			<rect x="90" y="86" width="2" height="5" fill="#FFD4A3" />
			<rect x="91" y="89" width="1" height="2" fill="#E8C090" opacity="0.3" />
			{/* Finger gaps / knuckle shadows */}
			<rect x="85" y="86" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="87" y="86" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="89" y="86" width="1" height="1" fill="#D4A574" opacity="0.5" />

			{/* === HEAD === (scaled 2x) */}
			{/* Neck */}
			<rect x="56" y="48" width="16" height="4" fill="#FFD4A3" />

			{/* Face Shape */}
			<rect x="52" y="24" width="24" height="24" fill="#FFD4A3" />

			{/* NEW: Face shading */}
			<rect x="52" y="24" width="2" height="20" fill="#E8C090" opacity="0.5" />
			<rect x="74" y="24" width="2" height="20" fill="#E8C090" opacity="0.5" />

			{/* Ears (scaled 2x) */}
			<rect x="48" y="32" width="4" height="8" fill="#FFD4A3" />
			<rect x="76" y="32" width="4" height="8" fill="#FFD4A3" />

			{/* NEW: Ear inner detail */}
			<rect x="49" y="34" width="2" height="4" fill="#E8C090" />
			<rect x="77" y="34" width="2" height="4" fill="#E8C090" />

			{/* === TRUE 128-BIT FACE FEATURES === */}

			{/* === LEFT EYE (8x6 full anatomy) === */}
			{/* Sclera (white of eye) */}
			<rect x="54" y="31" width="8" height="6" fill="#FFFFFF" />
			{/* Iris outer ring */}
			<rect x="55" y="32" width="6" height="4" fill="#4A3520" />
			{/* Iris inner */}
			<rect x="56" y="33" width="4" height="2" fill="#6B5030" />
			{/* Pupil (dark center) */}
			<rect x="57" y="33" width="2" height="2" fill="#0F0F0F" />
			{/* Primary highlight (top-left catchlight) */}
			<rect x="55" y="32" width="2" height="1" fill="#FFFFFF" />
			{/* Secondary highlight (bottom-right, subtle) */}
			<rect x="60" y="35" width="1" height="1" fill="#FFFFFF" opacity="0.4" />
			{/* Upper eyelid / lash line */}
			<rect x="54" y="30" width="8" height="1" fill="#1F2937" />
			{/* Lower eyelid subtle line */}
			<rect x="55" y="37" width="6" height="1" fill="#E8C090" opacity="0.3" />

			{/* === RIGHT EYE (8x6 full anatomy - mirrored) === */}
			{/* Sclera */}
			<rect x="66" y="31" width="8" height="6" fill="#FFFFFF" />
			{/* Iris outer ring */}
			<rect x="67" y="32" width="6" height="4" fill="#4A3520" />
			{/* Iris inner */}
			<rect x="68" y="33" width="4" height="2" fill="#6B5030" />
			{/* Pupil */}
			<rect x="69" y="33" width="2" height="2" fill="#0F0F0F" />
			{/* Primary highlight */}
			<rect x="67" y="32" width="2" height="1" fill="#FFFFFF" />
			{/* Secondary highlight */}
			<rect x="72" y="35" width="1" height="1" fill="#FFFFFF" opacity="0.4" />
			{/* Upper eyelid / lash line */}
			<rect x="66" y="30" width="8" height="1" fill="#1F2937" />
			{/* Lower eyelid */}
			<rect x="67" y="37" width="6" height="1" fill="#E8C090" opacity="0.3" />

			{/* === EYEBROWS (expressive) === */}
			<rect x="54" y="28" width="8" height="2" fill="#2C1810" />
			<rect x="66" y="28" width="8" height="2" fill="#2C1810" />
			{/* Eyebrow inner detail */}
			<rect x="55" y="29" width="2" height="1" fill="#3D241A" opacity="0.6" />
			<rect x="71" y="29" width="2" height="1" fill="#3D241A" opacity="0.6" />

			{/* === NOSE (with nostrils) === */}
			{/* Nose bridge (top, narrow) */}
			<rect x="63" y="34" width="2" height="2" fill="#E8C090" opacity="0.3" />
			{/* Nose body (wider) */}
			<rect x="62" y="36" width="4" height="3" fill="#E8C090" opacity="0.4" />
			{/* Nose tip highlight */}
			<rect x="63" y="37" width="2" height="1" fill="#FFE0B8" opacity="0.3" />
			{/* Left nostril */}
			<rect x="61" y="38" width="2" height="2" fill="#D4A574" opacity="0.6" />
			{/* Right nostril */}
			<rect x="65" y="38" width="2" height="2" fill="#D4A574" opacity="0.6" />
			{/* Nostril depth (darkest points) */}
			<rect x="62" y="39" width="1" height="1" fill="#C49060" opacity="0.5" />
			<rect x="65" y="39" width="1" height="1" fill="#C49060" opacity="0.5" />

			{/* === MOUTH (with lip detail) === */}
			{/* Upper lip outline */}
			<rect x="58" y="42" width="12" height="1" fill="#C87060" />
			{/* Upper lip body */}
			<rect x="59" y="43" width="10" height="1" fill="#D08070" opacity="0.8" />
			{/* Cupid's bow highlight */}
			<rect x="62" y="42" width="4" height="1" fill="#E09080" opacity="0.5" />
			{/* Mouth line (where lips meet) */}
			<rect x="58" y="44" width="12" height="1" fill="#A05040" opacity="0.7" />
			{/* Lower lip body */}
			<rect x="59" y="45" width="10" height="2" fill="#D88878" opacity="0.6" />
			{/* Lower lip highlight (center shine) */}
			<rect x="62" y="45" width="4" height="1" fill="#E8A098" opacity="0.4" />
			{/* Smile corners (slight upturn) */}
			<rect x="56" y="43" width="2" height="2" fill="#C87060" opacity="0.4" />
			<rect x="70" y="43" width="2" height="2" fill="#C87060" opacity="0.4" />

			{/* === HAIR (TRUE 128-BIT with strands) === */}
			{/* Base hair shape */}
			<rect x="48" y="16" width="32" height="8" fill="#2C1810" />
			<rect x="48" y="24" width="4" height="8" fill="#2C1810" />
			<rect x="76" y="24" width="4" height="8" fill="#2C1810" />

			{/* Hair volume layers */}
			<rect x="52" y="16" width="8" height="4" fill="#4A2C20" />
			<rect x="62" y="18" width="6" height="2" fill="#4A2C20" />
			<rect x="70" y="16" width="4" height="4" fill="#3D241A" />

			{/* === HAIR STRANDS (1px width) - front spikes === */}
			<rect x="50" y="13" width="1" height="5" fill="#3D241A" />
			<rect x="53" y="12" width="1" height="6" fill="#4A2C20" />
			<rect x="56" y="13" width="1" height="5" fill="#3D241A" />
			<rect x="59" y="11" width="1" height="7" fill="#2C1810" />
			<rect x="62" y="12" width="1" height="6" fill="#3D241A" />
			<rect x="65" y="13" width="1" height="5" fill="#4A2C20" />
			<rect x="68" y="12" width="1" height="6" fill="#3D241A" />
			<rect x="71" y="13" width="1" height="5" fill="#2C1810" />
			<rect x="74" y="14" width="1" height="4" fill="#3D241A" />
			<rect x="77" y="15" width="1" height="3" fill="#4A2C20" />

			{/* === HIGHLIGHT STRANDS (shine) === */}
			<rect x="54" y="16" width="1" height="4" fill="#5C3D2E" opacity="0.8" />
			<rect x="58" y="17" width="1" height="3" fill="#6B4D3A" opacity="0.7" />
			<rect x="63" y="16" width="1" height="4" fill="#5C3D2E" opacity="0.8" />
			<rect x="69" y="17" width="1" height="3" fill="#6B4D3A" opacity="0.7" />

			{/* === SHADOW STRANDS (depth) === */}
			<rect x="51" y="19" width="1" height="5" fill="#1F1510" opacity="0.5" />
			<rect x="57" y="18" width="1" height="6" fill="#1F1510" opacity="0.4" />
			<rect x="64" y="19" width="1" height="5" fill="#1F1510" opacity="0.5" />
			<rect x="72" y="18" width="1" height="6" fill="#1F1510" opacity="0.4" />

			{/* === SIDE HAIR TEXTURE === */}
			{/* Left side strands */}
			<rect x="49" y="24" width="1" height="6" fill="#3D241A" />
			<rect x="50" y="26" width="1" height="4" fill="#4A2C20" opacity="0.7" />
			{/* Right side strands */}
			<rect x="78" y="24" width="1" height="6" fill="#3D241A" />
			<rect x="77" y="26" width="1" height="4" fill="#4A2C20" opacity="0.7" />

			{/* ENHANCED: Suit fabric shine/highlights */}
			<g opacity="0.4">
				{/* Shoulder highlight */}
				<rect x="46" y="54" width="4" height="2" fill="#4B5563" />
				<rect x="78" y="54" width="4" height="2" fill="#4B5563" />

				{/* Lapel shine */}
				<rect x="53" y="56" width="2" height="8" fill="#374151" />
				<rect x="73" y="56" width="2" height="8" fill="#374151" />
			</g>

			{/* ENHANCED: Sparkle effects */}
			<g opacity="0.85">
				{/* Tie sparkle */}
				<rect x="60" y="52" width="2" height="2" fill="#FFFFFF" />

				{/* Button sparkle */}
				<rect x="64" y="66" width="2" height="2" fill="#FFFFFF" opacity="0.6" />

				{/* Boutonnière sparkle */}
				<rect x="75" y="60" width="1" height="1" fill="#FFFFFF" />
			</g>

			{/* ENHANCED: Shoe shine effects */}
			<rect x="48" y="125" width="6" height="1" fill="#374151" opacity="0.5" />
			<rect x="72" y="125" width="6" height="1" fill="#374151" opacity="0.5" />

			{/* ENHANCED: Soft shadow under figure */}
			<rect x="44" y="126" width="40" height="2" fill="#111827" opacity="0.3" />

			{/* ENHANCED: Hair highlights */}
			<rect x="54" y="18" width="2" height="2" fill="#6B4D3A" opacity="0.6" />
			<rect x="68" y="18" width="2" height="2" fill="#6B4D3A" opacity="0.5" />
		</svg>
	);
}
