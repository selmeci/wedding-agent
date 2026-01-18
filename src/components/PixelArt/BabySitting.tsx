export function BabySitting({ className = "" }: { className?: string }) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Bábätko sediace"
		>
			{/* === LEGS (Sitting position) === (scaled 2x) */}
			{/* Left Leg (bent forward) */}
			<rect x="44" y="104" width="12" height="8" fill="#FFD4A3" />
			<rect x="40" y="108" width="8" height="8" fill="#FFD4A3" />
			<rect x="44" y="112" width="4" height="4" fill="#E0B88A" />

			{/* NEW: Left leg detail */}
			<rect x="46" y="106" width="4" height="4" fill="#E8C090" opacity="0.4" />

			{/* Right Leg (bent forward) */}
			<rect x="72" y="104" width="12" height="8" fill="#FFD4A3" />
			<rect x="80" y="108" width="8" height="8" fill="#FFD4A3" />
			<rect x="80" y="112" width="4" height="4" fill="#E0B88A" />

			{/* NEW: Right leg detail */}
			<rect x="74" y="106" width="4" height="4" fill="#E8C090" opacity="0.4" />

			{/* Shadow under baby (scaled 2x) */}
			<rect x="40" y="116" width="48" height="4" fill="#E5E7EB" opacity="0.6" />

			{/* === BODY / DRESS === (scaled 2x) */}
			{/* Main Dress Body (Pink) */}
			<rect x="48" y="84" width="32" height="24" fill="#FFE3E8" />

			{/* Dress Bottom Folds/Shadows (scaled 2x + enhanced) */}
			<rect x="48" y="104" width="32" height="4" fill="#FFC9D4" />
			<rect x="56" y="104" width="4" height="4" fill="#FF9BB0" />
			<rect x="68" y="104" width="4" height="4" fill="#FF9BB0" />

			{/* NEW: Dress pattern */}
			<rect x="52" y="90" width="4" height="4" fill="#FFCCD8" opacity="0.5" />
			<rect x="72" y="92" width="4" height="4" fill="#FFCCD8" opacity="0.5" />
			<rect x="60" y="96" width="4" height="4" fill="#FFCCD8" opacity="0.5" />

			{/* Collar / Bib (scaled 2x + enhanced) */}
			<rect x="52" y="84" width="24" height="8" fill="#FFFFFF" />
			<rect x="60" y="88" width="8" height="4" fill="#FFE3E8" />

			{/* NEW: Collar lace detail */}
			<rect x="54" y="86" width="4" height="2" fill="#F3F4F6" />
			<rect x="70" y="86" width="4" height="2" fill="#F3F4F6" />

			{/* === ARMS === (scaled 2x) */}
			{/* Left Arm (resting on leg/ground) */}
			<rect x="40" y="88" width="8" height="12" fill="#FFD4A3" />
			<rect x="36" y="96" width="10" height="6" fill="#FFD4A3" />
			<rect x="48" y="88" width="4" height="4" fill="#FFE3E8" />

			{/* === LEFT HAND (chubby baby fingers resting) === */}
			<rect x="34" y="100" width="10" height="6" fill="#FFE8C9" />
			{/* Palm shadow */}
			<rect x="36" y="102" width="4" height="3" fill="#E8C090" opacity="0.4" />
			{/* Chubby baby thumb */}
			<rect x="32" y="101" width="3" height="4" fill="#FFD4A3" />
			<rect x="32" y="102" width="1" height="2" fill="#E8C090" opacity="0.4" />
			{/* Chubby fingers (4 visible, rounded) */}
			<rect x="34" y="106" width="3" height="4" fill="#FFD4A3" />
			<rect x="37" y="106" width="3" height="5" fill="#FFD4A3" />
			<rect x="40" y="106" width="3" height="4" fill="#FFD4A3" />
			<rect x="43" y="107" width="2" height="3" fill="#FFD4A3" />
			{/* Finger padding */}
			<rect x="35" y="109" width="2" height="1" fill="#FFE8C9" opacity="0.6" />
			<rect x="38" y="110" width="2" height="1" fill="#FFE8C9" opacity="0.6" />
			<rect x="41" y="109" width="2" height="1" fill="#FFE8C9" opacity="0.6" />
			{/* Chubby creases */}
			<rect x="36" y="106" width="1" height="1" fill="#E8C090" opacity="0.4" />
			<rect x="39" y="106" width="1" height="1" fill="#E8C090" opacity="0.4" />
			<rect x="42" y="106" width="1" height="1" fill="#E8C090" opacity="0.4" />

			{/* Right Arm (raised slightly/waving) */}
			<rect x="80" y="84" width="8" height="12" fill="#FFD4A3" />
			<rect x="84" y="76" width="10" height="8" fill="#FFD4A3" />
			<rect x="76" y="84" width="4" height="4" fill="#FFE3E8" />

			{/* === RIGHT HAND (chubby baby waving) === */}
			<rect x="88" y="72" width="10" height="6" fill="#FFE8C9" />
			{/* Palm shadow */}
			<rect x="90" y="74" width="4" height="3" fill="#E8C090" opacity="0.4" />
			{/* Chubby baby thumb */}
			<rect x="86" y="74" width="3" height="4" fill="#FFD4A3" />
			<rect x="86" y="75" width="1" height="2" fill="#E8C090" opacity="0.4" />
			{/* Chubby waving fingers (spread out) */}
			<rect x="88" y="68" width="3" height="5" fill="#FFD4A3" />
			<rect x="91" y="67" width="3" height="6" fill="#FFD4A3" />
			<rect x="94" y="68" width="3" height="5" fill="#FFD4A3" />
			<rect x="97" y="70" width="2" height="3" fill="#FFD4A3" />
			{/* Finger padding */}
			<rect x="89" y="68" width="2" height="1" fill="#FFE8C9" opacity="0.6" />
			<rect x="92" y="67" width="2" height="1" fill="#FFE8C9" opacity="0.6" />
			<rect x="95" y="68" width="2" height="1" fill="#FFE8C9" opacity="0.6" />
			{/* Chubby creases */}
			<rect x="90" y="71" width="1" height="1" fill="#E8C090" opacity="0.4" />
			<rect x="93" y="71" width="1" height="1" fill="#E8C090" opacity="0.4" />
			<rect x="96" y="71" width="1" height="1" fill="#E8C090" opacity="0.4" />

			{/* === HEAD === (scaled 2x) */}
			{/* Neck */}
			<rect x="56" y="80" width="16" height="4" fill="#FFD4A3" />

			{/* Face Shape */}
			<rect x="48" y="48" width="32" height="32" fill="#FFD4A3" />

			{/* NEW: Face shading */}
			<rect x="48" y="50" width="4" height="26" fill="#E8C090" opacity="0.4" />
			<rect x="76" y="50" width="4" height="26" fill="#E8C090" opacity="0.4" />

			{/* === BABY FACE FEATURES (128-bit - cute big eyes) === */}

			{/* === LEFT EYE (big baby eye 10x8) === */}
			<rect x="52" y="58" width="10" height="8" fill="#FFFFFF" />
			{/* Iris (large, cute - blue for baby girl) */}
			<rect x="54" y="59" width="8" height="6" fill="#5B7A8A" />
			<rect x="55" y="60" width="6" height="4" fill="#7B9AAA" />
			{/* Pupil */}
			<rect x="56" y="61" width="4" height="3" fill="#0F0F0F" />
			{/* Big sparkly highlights (makes eyes look innocent) */}
			<rect x="54" y="59" width="3" height="2" fill="#FFFFFF" />
			<rect x="59" y="63" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			{/* Upper eyelid */}
			<rect x="52" y="57" width="10" height="1" fill="#2C1810" opacity="0.4" />
			{/* Baby girl lashes (long, cute) */}
			<rect x="51" y="56" width="1" height="2" fill="#2C1810" opacity="0.5" />
			<rect x="53" y="55" width="1" height="3" fill="#2C1810" opacity="0.6" />
			<rect x="56" y="55" width="1" height="3" fill="#2C1810" opacity="0.6" />
			<rect x="59" y="55" width="1" height="3" fill="#2C1810" opacity="0.6" />
			<rect x="61" y="56" width="1" height="2" fill="#2C1810" opacity="0.5" />

			{/* === RIGHT EYE (mirrored) === */}
			<rect x="66" y="58" width="10" height="8" fill="#FFFFFF" />
			<rect x="66" y="59" width="8" height="6" fill="#5B7A8A" />
			<rect x="67" y="60" width="6" height="4" fill="#7B9AAA" />
			<rect x="68" y="61" width="4" height="3" fill="#0F0F0F" />
			<rect x="66" y="59" width="3" height="2" fill="#FFFFFF" />
			<rect x="71" y="63" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			<rect x="66" y="57" width="10" height="1" fill="#2C1810" opacity="0.4" />
			{/* Baby girl lashes */}
			<rect x="65" y="56" width="1" height="2" fill="#2C1810" opacity="0.5" />
			<rect x="68" y="55" width="1" height="3" fill="#2C1810" opacity="0.6" />
			<rect x="71" y="55" width="1" height="3" fill="#2C1810" opacity="0.6" />
			<rect x="74" y="55" width="1" height="3" fill="#2C1810" opacity="0.6" />
			<rect x="76" y="56" width="1" height="2" fill="#2C1810" opacity="0.5" />

			{/* Curious eyebrows (raised slightly) */}
			<rect x="53" y="53" width="8" height="2" fill="#D4A574" opacity="0.4" />
			<rect x="54" y="52" width="4" height="1" fill="#D4A574" opacity="0.3" />
			<rect x="67" y="53" width="8" height="2" fill="#D4A574" opacity="0.4" />
			<rect x="70" y="52" width="4" height="1" fill="#D4A574" opacity="0.3" />

			{/* === BABY NOSE (tiny, cute button) === */}
			<rect x="62" y="66" width="4" height="3" fill="#E8C090" opacity="0.4" />
			<rect x="63" y="67" width="2" height="1" fill="#FFE0B8" opacity="0.3" />
			{/* Tiny nostril hints */}
			<rect x="62" y="68" width="1" height="1" fill="#D4A574" opacity="0.4" />
			<rect x="65" y="68" width="1" height="1" fill="#D4A574" opacity="0.4" />

			{/* === CHUBBY CHEEKS (very rosy) === */}
			<rect x="50" y="68" width="8" height="6" fill="#FF9BB0" opacity="0.5" />
			<rect x="52" y="70" width="4" height="3" fill="#FFAFC0" opacity="0.3" />
			<rect x="70" y="68" width="8" height="6" fill="#FF9BB0" opacity="0.5" />
			<rect x="72" y="70" width="4" height="3" fill="#FFAFC0" opacity="0.3" />

			{/* === BABY MOUTH (happy smile) === */}
			{/* Outer lip */}
			<rect x="58" y="72" width="12" height="4" fill="#E87080" opacity="0.7" />
			{/* Inner mouth (smiling) */}
			<rect x="60" y="73" width="8" height="2" fill="#F09098" opacity="0.6" />
			{/* Lower lip highlight */}
			<rect x="62" y="74" width="4" height="1" fill="#FFAFC0" opacity="0.4" />
			{/* Smile corners */}
			<rect x="56" y="73" width="2" height="2" fill="#E87080" opacity="0.4" />
			<rect x="70" y="73" width="2" height="2" fill="#E87080" opacity="0.4" />

			{/* === HAIR (Bride - Blonde) === (scaled 2x + enhanced) */}
			{/* Main Hair */}
			<rect x="44" y="40" width="40" height="12" fill="#F4E4C1" />
			<rect x="40" y="48" width="8" height="16" fill="#F4E4C1" />
			<rect x="80" y="48" width="8" height="16" fill="#F4E4C1" />

			{/* NEW: Hair texture */}
			<rect x="48" y="42" width="8" height="4" fill="#FAF0DC" />
			<rect x="68" y="44" width="8" height="4" fill="#FAF0DC" />

			{/* Bangs (scaled 2x + enhanced) */}
			<rect x="48" y="44" width="8" height="8" fill="#F4E4C1" />
			<rect x="60" y="44" width="8" height="6" fill="#F4E4C1" />
			<rect x="72" y="44" width="8" height="8" fill="#F4E4C1" />

			{/* NEW: Bangs detail */}
			<rect x="50" y="46" width="4" height="4" fill="#E6D4B0" />
			<rect x="74" y="46" width="4" height="4" fill="#E6D4B0" />

			{/* === BABY BLONDE HAIR STRANDS (1px width - silky baby hair) === */}
			{/* Front bang strands */}
			<rect x="49" y="46" width="1" height="6" fill="#E6D4B0" />
			<rect x="52" y="45" width="1" height="7" fill="#FAF0DC" />
			<rect x="55" y="46" width="1" height="6" fill="#E6D4B0" />
			<rect x="58" y="45" width="1" height="7" fill="#FAF0DC" />
			<rect x="61" y="46" width="1" height="5" fill="#E6D4B0" />
			<rect x="64" y="45" width="1" height="6" fill="#FAF0DC" />
			<rect x="67" y="46" width="1" height="6" fill="#E6D4B0" />
			<rect x="70" y="45" width="1" height="7" fill="#FAF0DC" />
			<rect x="73" y="46" width="1" height="6" fill="#E6D4B0" />
			<rect x="76" y="45" width="1" height="7" fill="#FAF0DC" />
			<rect x="79" y="46" width="1" height="5" fill="#E6D4B0" />

			{/* Top fluffy strands */}
			<rect x="46" y="41" width="1" height="5" fill="#E6D4B0" />
			<rect x="50" y="40" width="1" height="6" fill="#FAF0DC" />
			<rect x="54" y="41" width="1" height="5" fill="#E6D4B0" />
			<rect x="58" y="40" width="1" height="6" fill="#FFFDF5" />
			<rect x="62" y="41" width="1" height="5" fill="#FAF0DC" />
			<rect x="66" y="40" width="1" height="6" fill="#FFFDF5" />
			<rect x="70" y="41" width="1" height="5" fill="#FAF0DC" />
			<rect x="74" y="40" width="1" height="6" fill="#E6D4B0" />
			<rect x="78" y="41" width="1" height="5" fill="#FAF0DC" />
			<rect x="82" y="42" width="1" height="4" fill="#E6D4B0" />

			{/* Baby hair highlight strands (lighter, shiny) */}
			<rect x="51" y="43" width="1" height="4" fill="#FFFDF5" opacity="0.7" />
			<rect x="57" y="42" width="1" height="5" fill="#FFFDF5" opacity="0.6" />
			<rect x="63" y="43" width="1" height="4" fill="#FFFDF5" opacity="0.7" />
			<rect x="69" y="42" width="1" height="5" fill="#FFFDF5" opacity="0.6" />
			<rect x="75" y="43" width="1" height="4" fill="#FFFDF5" opacity="0.7" />

			{/* Side wispy baby hair */}
			<rect x="41" y="50" width="1" height="8" fill="#E6D4B0" />
			<rect x="42" y="52" width="1" height="7" fill="#FAF0DC" />
			<rect x="43" y="54" width="1" height="5" fill="#E6D4B0" />
			<rect x="84" y="50" width="1" height="8" fill="#E6D4B0" />
			<rect x="85" y="52" width="1" height="7" fill="#FAF0DC" />
			<rect x="86" y="54" width="1" height="5" fill="#E6D4B0" />

			{/* Big Pink Bow (scaled 2x + enhanced) */}
			<rect x="60" y="32" width="8" height="8" fill="#FF6B8E" />
			<rect x="52" y="32" width="8" height="8" fill="#FF6B8E" />
			<rect x="68" y="32" width="8" height="8" fill="#FF6B8E" />
			<rect x="56" y="36" width="4" height="2" fill="#FF9BB0" />
			<rect x="72" y="36" width="4" height="2" fill="#FF9BB0" />

			{/* NEW: Bow center knot */}
			<rect x="62" y="34" width="4" height="4" fill="#E6215C" />
			<rect x="63" y="35" width="2" height="2" fill="#FF6B8E" />

			{/* NEW: Bow ribbon tails */}
			<rect x="54" y="40" width="4" height="4" fill="#FF6B8E" />
			<rect x="70" y="40" width="4" height="4" fill="#FF6B8E" />

			{/* ENHANCED: Bow sparkles */}
			<g opacity="0.9">
				<rect x="52" y="30" width="2" height="2" fill="#FFFFFF" />
				<rect x="74" y="30" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
				<rect x="64" y="28" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			</g>

			{/* ENHANCED: Cute floating elements */}
			<g opacity="0.6">
				{/* Small stars */}
				<rect x="28" y="52" width="4" height="4" fill="#FBCFE8" />
				<rect x="30" y="50" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
				<rect x="30" y="56" width="2" height="2" fill="#FFFFFF" opacity="0.6" />

				<rect x="100" y="60" width="4" height="4" fill="#FBCFE8" />
				<rect
					x="102"
					y="58"
					width="2"
					height="2"
					fill="#FFFFFF"
					opacity="0.8"
				/>

				{/* Tiny hearts */}
				<rect x="22" y="72" width="2" height="2" fill="#FF9BB0" />
				<rect x="104" y="44" width="2" height="2" fill="#FF9BB0" />
			</g>

			{/* ENHANCED: Eye sparkle highlights */}
			<rect x="57" y="61" width="1" height="1" fill="#FFFFFF" opacity="0.9" />
			<rect x="71" y="61" width="1" height="1" fill="#FFFFFF" opacity="0.9" />

			{/* ENHANCED: Dress shimmer */}
			<rect x="58" y="88" width="2" height="2" fill="#FFFFFF" opacity="0.4" />
			<rect x="66" y="94" width="2" height="2" fill="#FFFFFF" opacity="0.3" />

			{/* ENHANCED: Waving hand motion lines */}
			<g opacity="0.4">
				<rect x="94" y="72" width="4" height="2" fill="#FFD4A3" />
				<rect x="96" y="78" width="4" height="2" fill="#FFD4A3" />
			</g>

			{/* ENHANCED: Soft floor shadow */}
			<rect x="36" y="118" width="56" height="2" fill="#D1D5DB" opacity="0.3" />
		</svg>
	);
}
