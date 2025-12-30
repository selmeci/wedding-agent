export function BabyCrawling({ className = "" }: { className?: string }) {
	return (
		<svg
			width="64"
			height="64"
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Bábätko lezúce"
		>
			{/* === BODY & LEGS === */}
			{/* Rear Leg (Left - background) */}
			<rect x="10" y="50" width="8" height="4" fill="#E0B88A" />{" "}
			{/* Thigh shadow */}
			<rect x="8" y="54" width="4" height="2" fill="#E0B88A" />{" "}
			{/* Foot shadow */}
			{/* Diaper Shadow (underneath) */}
			<rect x="14" y="52" width="12" height="4" fill="#E5E7EB" />
			{/* Main Body/Torso */}
			<rect x="16" y="44" width="20" height="12" fill="#FFD4A3" />
			{/* Diaper (White with folds) */}
			<rect x="14" y="46" width="12" height="10" fill="#FFFFFF" />
			<rect x="25" y="48" width="2" height="4" fill="#F3F4F6" />{" "}
			{/* Side fold */}
			{/* Front Leg (Right - foreground) */}
			<rect x="14" y="54" width="8" height="4" fill="#FFD4A3" /> {/* Thigh */}
			<rect x="14" y="58" width="4" height="2" fill="#FFD4A3" /> {/* Knee */}
			<rect x="12" y="58" width="2" height="2" fill="#FFD4A3" /> {/* Foot */}
			{/* --- ARMS --- */}
			{/* Left Arm (supporting - slightly darker) */}
			<rect x="34" y="46" width="4" height="10" fill="#E0B88A" />
			<rect x="32" y="56" width="6" height="2" fill="#E0B88A" /> {/* Hand */}
			{/* Right Arm (reaching) */}
			<rect x="38" y="42" width="6" height="6" fill="#FFD4A3" />{" "}
			{/* Shoulder */}
			<rect x="42" y="46" width="4" height="8" fill="#FFD4A3" /> {/* Forearm */}
			<rect x="44" y="54" width="4" height="4" fill="#FFE8C9" />{" "}
			{/* Hand highlight */}
			{/* === HEAD === */}
			{/* Neck Area */}
			<rect x="28" y="40" width="10" height="4" fill="#E0B88A" />
			{/* Head Shape */}
			<rect x="26" y="24" width="20" height="18" fill="#FFD4A3" />
			{/* Face Features */}
			{/* Left Eye (our left) */}
			<rect x="30" y="30" width="4" height="4" fill="#1F2937" />
			<rect x="32" y="30" width="2" height="2" fill="#FFFFFF" opacity="0.9" />{" "}
			{/* Glint */}
			{/* Right Eye (our right) */}
			<rect x="40" y="30" width="4" height="4" fill="#1F2937" />
			<rect x="42" y="30" width="2" height="2" fill="#FFFFFF" opacity="0.9" />{" "}
			{/* Glint */}
			{/* Cheeks (rosy) */}
			<rect x="28" y="36" width="4" height="2" fill="#FF9BB0" opacity="0.5" />
			<rect x="42" y="36" width="4" height="2" fill="#FF9BB0" opacity="0.5" />
			{/* Mouth (smile) */}
			<rect x="34" y="38" width="6" height="2" fill="#D97706" opacity="0.6" />
			<rect x="34" y="38" width="1" height="1" fill="#D97706" /> {/* Corner */}
			<rect x="39" y="38" width="1" height="1" fill="#D97706" /> {/* Corner */}
			{/* Ear */}
			<rect x="24" y="32" width="2" height="4" fill="#FFD4A3" />
			{/* === HAIR (Groom - Dark Brown) === */}
			{/* Top mop */}
			<rect x="26" y="20" width="18" height="6" fill="#2C1810" />
			<rect x="24" y="22" width="2" height="8" fill="#2C1810" />
			<rect x="44" y="24" width="2" height="6" fill="#2C1810" />
			{/* Cute Cowlick/Spike */}
			<rect x="32" y="16" width="4" height="4" fill="#2C1810" />
			<rect x="34" y="14" width="2" height="2" fill="#2C1810" />
			{/* Highlights */}
			<rect x="30" y="22" width="6" height="2" fill="#4A2C20" />
		</svg>
	);
}
