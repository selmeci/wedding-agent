export function Bride({ className = "" }: { className?: string }) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Nevesta"
		>
			{/* === DRESS (Bottom/Skirt) === */}
			{/* Main Bell Shape (scaled 2x) */}
			<rect x="40" y="88" width="48" height="40" fill="#FFFFFF" />
			<rect x="36" y="96" width="4" height="32" fill="#FFFFFF" />
			<rect x="88" y="96" width="4" height="32" fill="#FFFFFF" />

			{/* Shadows/Folds - Adds depth to fabric (scaled 2x + enhanced) */}
			<rect x="48" y="88" width="4" height="40" fill="#F3F4F6" />
			<rect x="60" y="92" width="8" height="36" fill="#F3F4F6" />
			<rect x="76" y="88" width="4" height="40" fill="#F3F4F6" />

			{/* NEW: Additional dress folds and lace details */}
			<rect x="52" y="94" width="2" height="32" fill="#E5E7EB" />
			<rect x="72" y="94" width="2" height="32" fill="#E5E7EB" />
			<rect x="44" y="100" width="2" height="24" fill="#F9FAFB" />
			<rect x="82" y="100" width="2" height="24" fill="#F9FAFB" />

			{/* NEW: Lace pattern on skirt */}
			<rect x="42" y="108" width="4" height="2" fill="#E5E7EB" />
			<rect x="50" y="108" width="4" height="2" fill="#E5E7EB" />
			<rect x="74" y="108" width="4" height="2" fill="#E5E7EB" />
			<rect x="82" y="108" width="4" height="2" fill="#E5E7EB" />
			<rect x="46" y="116" width="4" height="2" fill="#E5E7EB" />
			<rect x="78" y="116" width="4" height="2" fill="#E5E7EB" />

			{/* Hem trim (lace) (scaled 2x + enhanced) */}
			<rect x="36" y="124" width="56" height="4" fill="#E5E7EB" />
			<rect x="38" y="122" width="52" height="2" fill="#F3F4F6" />

			{/* === TORSO === (scaled 2x) */}
			<rect x="44" y="56" width="40" height="32" fill="#FFFFFF" />

			{/* Bodice details (scaled 2x + enhanced) */}
			<rect x="48" y="60" width="32" height="16" fill="#F9FAFB" />
			<rect x="52" y="64" width="24" height="8" fill="#FFE3E8" opacity="0.3" />

			{/* NEW: Bodice seams and structure */}
			<rect x="56" y="58" width="2" height="28" fill="#F3F4F6" />
			<rect x="70" y="58" width="2" height="28" fill="#F3F4F6" />
			<rect x="48" y="72" width="32" height="2" fill="#E5E7EB" />

			{/* NEW: Decorative details on bodice */}
			<rect x="60" y="62" width="8" height="2" fill="#FBCFE8" opacity="0.5" />
			<rect x="62" y="66" width="4" height="2" fill="#FBCFE8" opacity="0.4" />

			{/* Neckline (scaled 2x) */}
			<rect x="52" y="52" width="24" height="4" fill="#FFD4A3" />

			{/* === ARMS === (scaled 2x) */}
			{/* Left Arm */}
			<rect x="40" y="56" width="8" height="24" fill="#FFD4A3" />
			<rect x="38" y="58" width="2" height="20" fill="#E8C090" />

			{/* Right Arm */}
			<rect x="80" y="56" width="8" height="24" fill="#FFD4A3" />
			<rect x="88" y="58" width="2" height="20" fill="#E8C090" />

			{/* === HANDS HOLDING BOUQUET (5 fingers each) === */}
			{/* Left hand base */}
			<rect x="46" y="72" width="12" height="6" fill="#FFD4A3" />
			<rect x="46" y="74" width="3" height="4" fill="#E8C090" opacity="0.4" />
			{/* Left thumb (wrapping around bouquet) */}
			<rect x="44" y="74" width="2" height="4" fill="#FFD4A3" />
			<rect x="44" y="75" width="1" height="2" fill="#E8C090" opacity="0.4" />
			{/* Left fingers (4 visible, curled around stem) */}
			<rect x="46" y="78" width="2" height="4" fill="#FFD4A3" />
			<rect x="48" y="78" width="2" height="5" fill="#FFD4A3" />
			<rect x="50" y="78" width="2" height="5" fill="#FFD4A3" />
			<rect x="52" y="78" width="2" height="4" fill="#FFD4A3" />
			{/* Finger shadows */}
			<rect x="47" y="78" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="49" y="78" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="51" y="78" width="1" height="1" fill="#D4A574" opacity="0.5" />
			{/* Fingernails (subtle pink for feminine touch) */}
			<rect x="46" y="81" width="2" height="1" fill="#FFCCD0" opacity="0.6" />
			<rect x="48" y="82" width="2" height="1" fill="#FFCCD0" opacity="0.6" />
			<rect x="50" y="82" width="2" height="1" fill="#FFCCD0" opacity="0.6" />
			<rect x="52" y="81" width="2" height="1" fill="#FFCCD0" opacity="0.6" />

			{/* Right hand base */}
			<rect x="70" y="72" width="12" height="6" fill="#FFD4A3" />
			<rect x="79" y="74" width="3" height="4" fill="#E8C090" opacity="0.4" />
			{/* Right thumb */}
			<rect x="82" y="74" width="2" height="4" fill="#FFD4A3" />
			<rect x="83" y="75" width="1" height="2" fill="#E8C090" opacity="0.4" />
			{/* Right fingers */}
			<rect x="74" y="78" width="2" height="4" fill="#FFD4A3" />
			<rect x="76" y="78" width="2" height="5" fill="#FFD4A3" />
			<rect x="78" y="78" width="2" height="5" fill="#FFD4A3" />
			<rect x="80" y="78" width="2" height="4" fill="#FFD4A3" />
			{/* Finger shadows */}
			<rect x="75" y="78" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="77" y="78" width="1" height="1" fill="#D4A574" opacity="0.5" />
			<rect x="79" y="78" width="1" height="1" fill="#D4A574" opacity="0.5" />
			{/* Fingernails */}
			<rect x="74" y="81" width="2" height="1" fill="#FFCCD0" opacity="0.6" />
			<rect x="76" y="82" width="2" height="1" fill="#FFCCD0" opacity="0.6" />
			<rect x="78" y="82" width="2" height="1" fill="#FFCCD0" opacity="0.6" />
			<rect x="80" y="81" width="2" height="1" fill="#FFCCD0" opacity="0.6" />

			{/* === BOUQUET === (scaled 2x + enhanced) */}
			{/* Greenery */}
			<rect x="56" y="80" width="16" height="8" fill="#22C55E" />
			<rect x="60" y="88" width="8" height="8" fill="#15803D" />

			{/* NEW: More detailed leaves */}
			<rect x="52" y="82" width="4" height="4" fill="#16A34A" />
			<rect x="72" y="82" width="4" height="4" fill="#16A34A" />
			<rect x="54" y="78" width="2" height="4" fill="#22C55E" />
			<rect x="72" y="78" width="2" height="4" fill="#22C55E" />

			{/* Flowers (scaled 2x + enhanced) */}
			<rect x="58" y="76" width="6" height="6" fill="#EC4899" />
			<rect x="66" y="78" width="6" height="6" fill="#F43F5E" />
			<rect x="54" y="82" width="4" height="4" fill="#FBCFE8" />
			<rect x="70" y="82" width="4" height="4" fill="#FBCFE8" />

			{/* NEW: Flower centers */}
			<rect x="60" y="78" width="2" height="2" fill="#FFC0CB" />
			<rect x="68" y="80" width="2" height="2" fill="#FFB6C1" />

			{/* NEW: Small flower buds */}
			<rect x="56" y="74" width="2" height="2" fill="#F472B6" />
			<rect x="70" y="74" width="2" height="2" fill="#F472B6" />

			{/* === HEAD === (scaled 2x) */}
			{/* Neck */}
			<rect x="58" y="48" width="12" height="4" fill="#FFD4A3" />

			{/* Face Shape */}
			<rect x="52" y="28" width="24" height="24" fill="#FFD4A3" />

			{/* NEW: Face shading */}
			<rect x="52" y="28" width="2" height="20" fill="#E8C090" opacity="0.5" />
			<rect x="74" y="28" width="2" height="20" fill="#E8C090" opacity="0.5" />

			{/* === TRUE 128-BIT FACE FEATURES (Feminine) === */}

			{/* === LEFT EYE (8x6 with feminine lashes) === */}
			{/* Sclera */}
			<rect x="54" y="35" width="8" height="6" fill="#FFFFFF" />
			{/* Iris outer (blue-gray for bride) */}
			<rect x="55" y="36" width="6" height="4" fill="#5B7A8A" />
			{/* Iris inner */}
			<rect x="56" y="37" width="4" height="2" fill="#7B9AAA" />
			{/* Pupil */}
			<rect x="57" y="37" width="2" height="2" fill="#0F0F0F" />
			{/* Primary highlight (larger for feminine sparkle) */}
			<rect x="55" y="36" width="2" height="2" fill="#FFFFFF" />
			{/* Secondary highlight */}
			<rect x="60" y="39" width="1" height="1" fill="#FFFFFF" opacity="0.5" />
			{/* Upper eyelid - thicker for makeup effect */}
			<rect x="54" y="34" width="8" height="1" fill="#1F2937" />
			{/* Feminine eyeliner wing */}
			<rect x="53" y="34" width="1" height="1" fill="#1F2937" />
			{/* Lower eyelid */}
			<rect x="55" y="41" width="6" height="1" fill="#E8C090" opacity="0.3" />
			{/* Feminine lashes - longer, curved */}
			<rect x="54" y="33" width="1" height="2" fill="#1F2937" />
			<rect x="56" y="32" width="1" height="3" fill="#1F2937" />
			<rect x="58" y="32" width="1" height="3" fill="#1F2937" />
			<rect x="60" y="33" width="1" height="2" fill="#1F2937" />

			{/* === RIGHT EYE (mirrored feminine) === */}
			<rect x="66" y="35" width="8" height="6" fill="#FFFFFF" />
			<rect x="67" y="36" width="6" height="4" fill="#5B7A8A" />
			<rect x="68" y="37" width="4" height="2" fill="#7B9AAA" />
			<rect x="69" y="37" width="2" height="2" fill="#0F0F0F" />
			<rect x="67" y="36" width="2" height="2" fill="#FFFFFF" />
			<rect x="72" y="39" width="1" height="1" fill="#FFFFFF" opacity="0.5" />
			<rect x="66" y="34" width="8" height="1" fill="#1F2937" />
			<rect x="74" y="34" width="1" height="1" fill="#1F2937" />
			<rect x="67" y="41" width="6" height="1" fill="#E8C090" opacity="0.3" />
			{/* Feminine lashes */}
			<rect x="67" y="33" width="1" height="2" fill="#1F2937" />
			<rect x="69" y="32" width="1" height="3" fill="#1F2937" />
			<rect x="71" y="32" width="1" height="3" fill="#1F2937" />
			<rect x="73" y="33" width="1" height="2" fill="#1F2937" />

			{/* === EYEBROWS (feminine - thinner, arched) === */}
			<rect x="54" y="31" width="7" height="1" fill="#A08060" />
			<rect x="55" y="30" width="4" height="1" fill="#A08060" opacity="0.6" />
			<rect x="67" y="31" width="7" height="1" fill="#A08060" />
			<rect x="69" y="30" width="4" height="1" fill="#A08060" opacity="0.6" />

			{/* === NOSE (delicate feminine) === */}
			<rect x="63" y="38" width="2" height="2" fill="#E8C090" opacity="0.25" />
			<rect x="62" y="40" width="4" height="2" fill="#E8C090" opacity="0.35" />
			<rect x="63" y="41" width="2" height="1" fill="#FFE0B8" opacity="0.3" />
			{/* Subtle nostrils */}
			<rect x="61" y="41" width="2" height="2" fill="#D4A574" opacity="0.4" />
			<rect x="65" y="41" width="2" height="2" fill="#D4A574" opacity="0.4" />

			{/* === CHEEKS (rosy blush) === */}
			<rect x="54" y="42" width="4" height="4" fill="#FF9BB0" opacity="0.5" />
			<rect x="70" y="42" width="4" height="4" fill="#FF9BB0" opacity="0.5" />
			{/* Blush gradient */}
			<rect x="55" y="43" width="2" height="2" fill="#FFAFC0" opacity="0.3" />
			<rect x="71" y="43" width="2" height="2" fill="#FFAFC0" opacity="0.3" />

			{/* === MOUTH (feminine pink lips) === */}
			{/* Upper lip outline */}
			<rect x="58" y="46" width="12" height="1" fill="#E87080" />
			{/* Upper lip body (pink) */}
			<rect x="59" y="47" width="10" height="1" fill="#F08090" opacity="0.9" />
			{/* Cupid's bow (defined) */}
			<rect x="62" y="46" width="4" height="1" fill="#F5A0A8" opacity="0.6" />
			{/* Mouth line */}
			<rect x="58" y="48" width="12" height="1" fill="#C06070" opacity="0.6" />
			{/* Lower lip (fuller) */}
			<rect x="59" y="49" width="10" height="2" fill="#F09098" opacity="0.8" />
			{/* Lower lip highlight (glossy effect) */}
			<rect x="62" y="49" width="4" height="1" fill="#FFB8C0" opacity="0.5" />
			{/* Smile corners */}
			<rect x="56" y="47" width="2" height="2" fill="#E87080" opacity="0.4" />
			<rect x="70" y="47" width="2" height="2" fill="#E87080" opacity="0.4" />

			{/* === HAIR (Blonde - TRUE 128-BIT with strands) === */}
			{/* Base hair shape */}
			<rect x="48" y="20" width="32" height="12" fill="#F4E4C1" />
			<rect x="48" y="28" width="4" height="16" fill="#F4E4C1" />
			<rect x="76" y="28" width="4" height="16" fill="#F4E4C1" />

			{/* Hair volume layers */}
			<rect x="52" y="22" width="8" height="4" fill="#FAF0DC" />
			<rect x="64" y="24" width="6" height="4" fill="#FAF0DC" />

			{/* === HAIR STRANDS (1px width) - flowing style === */}
			{/* Front hairline strands */}
			<rect x="50" y="18" width="1" height="4" fill="#E6D4B0" />
			<rect x="53" y="17" width="1" height="5" fill="#F4E4C1" />
			<rect x="56" y="18" width="1" height="4" fill="#E6D4B0" />
			<rect x="60" y="17" width="1" height="5" fill="#FAF0DC" />
			<rect x="64" y="17" width="1" height="5" fill="#F4E4C1" />
			<rect x="68" y="18" width="1" height="4" fill="#E6D4B0" />
			<rect x="72" y="17" width="1" height="5" fill="#FAF0DC" />
			<rect x="76" y="18" width="1" height="4" fill="#F4E4C1" />

			{/* === HIGHLIGHT STRANDS (golden shine) === */}
			<rect x="54" y="22" width="1" height="6" fill="#FFFDF5" opacity="0.8" />
			<rect x="62" y="21" width="1" height="7" fill="#FFFDF5" opacity="0.9" />
			<rect x="70" y="22" width="1" height="6" fill="#FFFDF5" opacity="0.7" />

			{/* === SHADOW STRANDS (depth) === */}
			<rect x="51" y="24" width="1" height="6" fill="#D4C4A0" opacity="0.5" />
			<rect x="58" y="23" width="1" height="7" fill="#D4C4A0" opacity="0.4" />
			<rect x="66" y="24" width="1" height="6" fill="#D4C4A0" opacity="0.5" />
			<rect x="74" y="23" width="1" height="7" fill="#D4C4A0" opacity="0.4" />

			{/* === SIDE HAIR STRANDS (flowing down) === */}
			{/* Left side */}
			<rect x="49" y="30" width="1" height="10" fill="#E6D4B0" />
			<rect x="50" y="32" width="1" height="8" fill="#F4E4C1" opacity="0.8" />
			{/* Right side */}
			<rect x="78" y="30" width="1" height="10" fill="#E6D4B0" />
			<rect x="77" y="32" width="1" height="8" fill="#F4E4C1" opacity="0.8" />

			{/* === BUN / UPDO === */}
			<rect x="56" y="12" width="16" height="8" fill="#F4E4C1" />
			<rect x="58" y="10" width="12" height="4" fill="#F4E4C1" />

			{/* Bun detail and texture */}
			<rect x="60" y="14" width="8" height="4" fill="#E6D4B0" />
			<rect x="62" y="12" width="4" height="2" fill="#FAF0DC" />

			{/* Bun strands (spiral effect) */}
			<rect x="58" y="13" width="1" height="3" fill="#D4C4A0" opacity="0.5" />
			<rect x="61" y="11" width="1" height="4" fill="#FFFDF5" opacity="0.6" />
			<rect x="65" y="11" width="1" height="4" fill="#D4C4A0" opacity="0.4" />
			<rect x="68" y="13" width="1" height="3" fill="#FFFDF5" opacity="0.5" />
			<rect x="70" y="14" width="1" height="2" fill="#E6D4B0" opacity="0.6" />

			{/* === VEIL === (scaled 2x + enhanced) */}
			{/* Top part */}
			<rect x="48" y="16" width="32" height="4" fill="#FFFFFF" opacity="0.8" />

			{/* Flowing down back */}
			<rect x="40" y="20" width="8" height="40" fill="#FFFFFF" opacity="0.6" />
			<rect x="80" y="20" width="8" height="40" fill="#FFFFFF" opacity="0.6" />

			{/* Bottom of veil */}
			<rect x="32" y="56" width="8" height="20" fill="#FFFFFF" opacity="0.4" />
			<rect x="88" y="56" width="8" height="20" fill="#FFFFFF" opacity="0.4" />

			{/* NEW: Veil sparkles */}
			<rect x="36" y="60" width="2" height="2" fill="#FFFFFF" opacity="0.9" />
			<rect x="90" y="64" width="2" height="2" fill="#FFFFFF" opacity="0.9" />
			<rect x="42" y="50" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
			<rect x="84" y="48" width="2" height="2" fill="#FFFFFF" opacity="0.8" />

			{/* Tiara/Decoration (scaled 2x + enhanced) */}
			<rect x="56" y="18" width="16" height="2" fill="#E5E7EB" />
			<rect x="62" y="16" width="4" height="2" fill="#FBCFE8" />

			{/* NEW: Tiara jewels */}
			<rect x="58" y="17" width="2" height="2" fill="#F9A8D4" />
			<rect x="68" y="17" width="2" height="2" fill="#F9A8D4" />
			<rect x="63" y="15" width="2" height="2" fill="#FFFFFF" />

			{/* ENHANCED: Dress sparkle/glitter effects */}
			<g opacity="0.8">
				{/* Top sparkle near shoulder */}
				<rect x="44" y="58" width="3" height="3" fill="#FFFFFF" />
				<rect x="42" y="60" width="2" height="6" fill="#FFFFFF" opacity="0.5" />
				<rect x="38" y="62" width="6" height="2" fill="#FFFFFF" opacity="0.5" />

				{/* Skirt sparkles */}
				<rect x="56" y="96" width="2" height="2" fill="#FFFFFF" />
				<rect x="70" y="104" width="2" height="2" fill="#FFFFFF" />
				<rect x="48" y="112" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
				<rect x="78" y="108" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
				<rect x="62" y="118" width="2" height="2" fill="#FFFFFF" opacity="0.6" />

				{/* Bodice sparkles */}
				<rect x="50" y="66" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
				<rect x="76" y="64" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			</g>

			{/* ENHANCED: Hair shine streaks */}
			<rect x="54" y="24" width="2" height="6" fill="#FFFDF5" opacity="0.6" />
			<rect x="70" y="26" width="2" height="6" fill="#FFFDF5" opacity="0.5" />

			{/* ENHANCED: Bouquet glow */}
			<rect x="58" y="74" width="2" height="2" fill="#FFE4EC" />
			<rect x="68" y="76" width="2" height="2" fill="#FFE4EC" />

			{/* ENHANCED: Soft shadow under dress */}
			<rect x="40" y="126" width="48" height="2" fill="#D1D5DB" opacity="0.4" />
		</svg>
	);
}
