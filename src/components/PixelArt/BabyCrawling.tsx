export function BabyCrawling({ className = "" }: { className?: string }) {
	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Bábätko lezúce"
		>
			{/* === BODY & LEGS === (scaled 2x) */}
			{/* Rear Leg (Left - background) */}
			<rect x="20" y="100" width="16" height="8" fill="#E0B88A" />
			<rect x="16" y="108" width="8" height="4" fill="#E0B88A" />

			{/* NEW: Rear leg toes */}
			<rect x="14" y="110" width="4" height="2" fill="#D4A574" />

			{/* Diaper Shadow (underneath) */}
			<rect x="28" y="104" width="24" height="8" fill="#E5E7EB" />

			{/* Main Body/Torso (scaled 2x) */}
			<rect x="32" y="88" width="40" height="24" fill="#FFD4A3" />

			{/* NEW: Body shading */}
			<rect x="34" y="90" width="8" height="20" fill="#E8C090" opacity="0.4" />

			{/* Diaper (White with folds) (scaled 2x + enhanced) */}
			<rect x="28" y="92" width="24" height="20" fill="#FFFFFF" />
			<rect x="50" y="96" width="4" height="8" fill="#F3F4F6" />

			{/* NEW: Diaper details */}
			<rect x="32" y="94" width="16" height="2" fill="#E5E7EB" />
			<rect x="36" y="100" width="8" height="2" fill="#F9FAFB" />
			<rect x="30" y="108" width="20" height="2" fill="#E5E7EB" />

			{/* Front Leg (Right - foreground) (scaled 2x) */}
			<rect x="28" y="108" width="16" height="8" fill="#FFD4A3" />
			<rect x="28" y="116" width="8" height="4" fill="#FFD4A3" />
			<rect x="24" y="116" width="4" height="4" fill="#FFD4A3" />

			{/* NEW: Front leg details */}
			<rect x="30" y="110" width="4" height="6" fill="#E8C090" opacity="0.4" />
			<rect x="24" y="118" width="2" height="2" fill="#E8C090" />

			{/* --- ARMS --- (scaled 2x) */}
			{/* Left Arm (supporting - slightly darker) */}
			<rect x="68" y="92" width="8" height="20" fill="#E0B88A" />
			<rect x="64" y="112" width="12" height="4" fill="#E0B88A" />

			{/* NEW: Supporting arm detail */}
			<rect x="70" y="94" width="4" height="16" fill="#D4A574" opacity="0.4" />

			{/* Right Arm (reaching) (scaled 2x) */}
			<rect x="76" y="84" width="12" height="12" fill="#FFD4A3" />
			<rect x="84" y="92" width="8" height="16" fill="#FFD4A3" />
			<rect x="88" y="108" width="8" height="8" fill="#FFE8C9" />

			{/* NEW: Reaching arm details */}
			<rect x="78" y="86" width="4" height="8" fill="#E8C090" opacity="0.4" />

			{/* === BABY REACHING HAND (chubby fingers) === */}
			<rect x="88" y="108" width="10" height="6" fill="#FFE8C9" />
			{/* Chubby baby thumb */}
			<rect x="86" y="110" width="3" height="4" fill="#FFD4A3" />
			<rect x="86" y="111" width="1" height="2" fill="#E8C090" opacity="0.4" />
			{/* Chubby fingers (4 visible, rounded) */}
			<rect x="88" y="114" width="3" height="4" fill="#FFD4A3" />
			<rect x="91" y="114" width="3" height="5" fill="#FFD4A3" />
			<rect x="94" y="114" width="3" height="4" fill="#FFD4A3" />
			<rect x="97" y="115" width="2" height="3" fill="#FFD4A3" />
			{/* Finger padding/softness */}
			<rect x="89" y="117" width="2" height="1" fill="#FFE8C9" opacity="0.6" />
			<rect x="92" y="118" width="2" height="1" fill="#FFE8C9" opacity="0.6" />
			<rect x="95" y="117" width="2" height="1" fill="#FFE8C9" opacity="0.6" />
			{/* Chubby creases */}
			<rect x="90" y="114" width="1" height="1" fill="#E8C090" opacity="0.4" />
			<rect x="93" y="114" width="1" height="1" fill="#E8C090" opacity="0.4" />
			<rect x="96" y="114" width="1" height="1" fill="#E8C090" opacity="0.4" />

			{/* === HEAD === (scaled 2x) */}
			{/* Neck Area */}
			<rect x="56" y="80" width="20" height="8" fill="#E0B88A" />

			{/* Head Shape */}
			<rect x="52" y="48" width="40" height="36" fill="#FFD4A3" />

			{/* NEW: Face shading */}
			<rect x="52" y="50" width="4" height="30" fill="#E8C090" opacity="0.4" />
			<rect x="88" y="50" width="4" height="30" fill="#E8C090" opacity="0.4" />

			{/* === BABY FACE FEATURES (128-bit - cute big eyes) === */}

			{/* === LEFT EYE (big baby eye 10x8) === */}
			<rect x="58" y="59" width="10" height="8" fill="#FFFFFF" />
			{/* Iris (large, cute) */}
			<rect x="60" y="60" width="8" height="6" fill="#4A3520" />
			<rect x="61" y="61" width="6" height="4" fill="#6B5030" />
			{/* Pupil */}
			<rect x="62" y="62" width="4" height="3" fill="#0F0F0F" />
			{/* Big sparkly highlights (makes eyes look innocent) */}
			<rect x="60" y="60" width="3" height="2" fill="#FFFFFF" />
			<rect x="65" y="64" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			{/* Upper eyelid */}
			<rect x="58" y="58" width="10" height="1" fill="#2C1810" opacity="0.5" />

			{/* === RIGHT EYE (mirrored) === */}
			<rect x="80" y="59" width="10" height="8" fill="#FFFFFF" />
			<rect x="80" y="60" width="8" height="6" fill="#4A3520" />
			<rect x="81" y="61" width="6" height="4" fill="#6B5030" />
			<rect x="82" y="62" width="4" height="3" fill="#0F0F0F" />
			<rect x="80" y="60" width="3" height="2" fill="#FFFFFF" />
			<rect x="85" y="64" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			<rect x="80" y="58" width="10" height="1" fill="#2C1810" opacity="0.5" />

			{/* Curious eyebrows (raised slightly) */}
			<rect x="59" y="55" width="8" height="2" fill="#2C1810" opacity="0.5" />
			<rect x="60" y="54" width="4" height="1" fill="#2C1810" opacity="0.3" />
			<rect x="81" y="55" width="8" height="2" fill="#2C1810" opacity="0.5" />
			<rect x="84" y="54" width="4" height="1" fill="#2C1810" opacity="0.3" />

			{/* === BABY NOSE (tiny, cute button) === */}
			<rect x="72" y="68" width="4" height="3" fill="#E8C090" opacity="0.4" />
			<rect x="73" y="69" width="2" height="1" fill="#FFE0B8" opacity="0.3" />
			{/* Tiny nostril hints */}
			<rect x="72" y="70" width="1" height="1" fill="#D4A574" opacity="0.4" />
			<rect x="75" y="70" width="1" height="1" fill="#D4A574" opacity="0.4" />

			{/* === CHUBBY CHEEKS (very rosy) === */}
			<rect x="54" y="70" width="8" height="6" fill="#FF9BB0" opacity="0.5" />
			<rect x="56" y="72" width="4" height="3" fill="#FFAFC0" opacity="0.3" />
			<rect x="86" y="70" width="8" height="6" fill="#FF9BB0" opacity="0.5" />
			<rect x="88" y="72" width="4" height="3" fill="#FFAFC0" opacity="0.3" />

			{/* === BABY MOUTH (open, babbling) === */}
			{/* Outer lip */}
			<rect x="68" y="76" width="12" height="5" fill="#E87080" opacity="0.7" />
			{/* Inner mouth (open) */}
			<rect x="70" y="77" width="8" height="3" fill="#C06070" opacity="0.6" />
			{/* Tongue hint */}
			<rect x="72" y="78" width="4" height="2" fill="#E88090" opacity="0.5" />
			{/* Smile corners */}
			<rect x="66" y="77" width="2" height="2" fill="#E87080" opacity="0.4" />
			<rect x="80" y="77" width="2" height="2" fill="#E87080" opacity="0.4" />

			{/* Ear (scaled 2x) */}
			<rect x="48" y="64" width="4" height="8" fill="#FFD4A3" />
			<rect x="49" y="66" width="2" height="4" fill="#E8C090" />

			{/* === HAIR (Groom - Dark Brown) === (scaled 2x + enhanced) */}
			{/* Top mop */}
			<rect x="52" y="40" width="36" height="12" fill="#2C1810" />
			<rect x="48" y="44" width="4" height="16" fill="#2C1810" />
			<rect x="88" y="48" width="4" height="12" fill="#2C1810" />

			{/* Cute Cowlick/Spike (scaled 2x + enhanced) */}
			<rect x="64" y="32" width="8" height="8" fill="#2C1810" />
			<rect x="68" y="28" width="4" height="4" fill="#2C1810" />

			{/* NEW: Extra cowlick detail */}
			<rect x="70" y="26" width="2" height="2" fill="#2C1810" />
			<rect x="62" y="34" width="4" height="4" fill="#3D241A" />

			{/* Highlights (scaled 2x + enhanced) */}
			<rect x="60" y="44" width="12" height="4" fill="#4A2C20" />

			{/* NEW: Additional hair texture */}
			<rect x="76" y="42" width="8" height="4" fill="#3D241A" />
			<rect x="56" y="46" width="6" height="2" fill="#4A2C20" />

			{/* === BABY HAIR STRANDS (1px width - fluffy baby hair) === */}
			{/* Front wispy strands */}
			<rect x="54" y="42" width="1" height="4" fill="#3D241A" />
			<rect x="57" y="41" width="1" height="5" fill="#4A2C20" />
			<rect x="60" y="42" width="1" height="4" fill="#3D241A" />
			<rect x="63" y="41" width="1" height="5" fill="#4A2C20" />
			<rect x="66" y="42" width="1" height="4" fill="#3D241A" />
			<rect x="69" y="41" width="1" height="5" fill="#4A2C20" />
			<rect x="72" y="42" width="1" height="4" fill="#3D241A" />
			<rect x="75" y="41" width="1" height="5" fill="#4A2C20" />
			<rect x="78" y="42" width="1" height="4" fill="#3D241A" />
			<rect x="81" y="43" width="1" height="3" fill="#4A2C20" />
			<rect x="84" y="44" width="1" height="3" fill="#3D241A" />

			{/* Cowlick strands (sticking up) */}
			<rect x="65" y="30" width="1" height="6" fill="#3D241A" />
			<rect x="67" y="28" width="1" height="8" fill="#4A2C20" />
			<rect x="69" y="26" width="1" height="10" fill="#3D241A" />
			<rect x="71" y="27" width="1" height="9" fill="#4A2C20" />
			<rect x="73" y="30" width="1" height="6" fill="#3D241A" />

			{/* Baby hair highlight strands (lighter, fluffy) */}
			<rect x="58" y="43" width="1" height="3" fill="#5C3D2E" opacity="0.7" />
			<rect x="64" y="42" width="1" height="4" fill="#6B4D3A" opacity="0.6" />
			<rect x="70" y="43" width="1" height="3" fill="#5C3D2E" opacity="0.7" />
			<rect x="76" y="42" width="1" height="4" fill="#6B4D3A" opacity="0.6" />
			<rect x="68" y="29" width="1" height="5" fill="#5C3D2E" opacity="0.6" />

			{/* Side fluffy baby hair */}
			<rect x="50" y="46" width="1" height="6" fill="#3D241A" />
			<rect x="51" y="48" width="1" height="5" fill="#4A2C20" />
			<rect x="86" y="50" width="1" height="5" fill="#3D241A" />
			<rect x="87" y="52" width="1" height="4" fill="#4A2C20" />

			{/* ENHANCED: Cute exploration sparkles */}
			<g opacity="0.7">
				{/* Curiosity sparkles near reaching hand */}
				<rect x="98" y="104" width="4" height="4" fill="#FCD34D" />
				<rect x="100" y="102" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
				<rect x="100" y="108" width="2" height="2" fill="#FFFFFF" opacity="0.6" />

				<rect x="104" y="112" width="2" height="2" fill="#FCD34D" opacity="0.6" />
				<rect x="106" y="108" width="2" height="2" fill="#FFFFFF" opacity="0.5" />
			</g>

			{/* ENHANCED: Eye sparkle highlights */}
			<rect x="65" y="61" width="2" height="2" fill="#FFFFFF" />
			<rect x="85" y="61" width="2" height="2" fill="#FFFFFF" />

			{/* ENHANCED: Cute motion lines (crawling) */}
			<g opacity="0.4">
				<rect x="10" y="106" width="4" height="2" fill="#E5E7EB" />
				<rect x="8" y="110" width="6" height="2" fill="#E5E7EB" />
				<rect x="12" y="114" width="4" height="2" fill="#E5E7EB" />
			</g>

			{/* ENHANCED: Diaper shine */}
			<rect x="34" y="96" width="4" height="2" fill="#FFFFFF" opacity="0.4" />

			{/* ENHANCED: Baby drool/babble effect */}
			<rect x="72" y="80" width="2" height="2" fill="#E5E7EB" opacity="0.5" />

			{/* ENHANCED: Floor shadow */}
			<rect x="18" y="118" width="76" height="2" fill="#D1D5DB" opacity="0.3" />

			{/* ENHANCED: Hair shine */}
			<rect x="66" y="36" width="4" height="2" fill="#4A2C20" opacity="0.6" />
			<rect x="58" y="44" width="2" height="2" fill="#5C3D2E" opacity="0.4" />
		</svg>
	);
}
