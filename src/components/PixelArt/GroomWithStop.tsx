export function GroomWithStop({ className = "" }: { className?: string }) {
	return (
		<svg
			width="64"
			height="64"
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Ženích so STOP značkou"
		>
			{/* === GROOM (left side) === */}
			{/* Hair */}
			<rect x="8" y="12" width="12" height="2" fill="#2C1810" />
			<rect x="6" y="14" width="16" height="4" fill="#2C1810" />

			{/* Face */}
			<rect x="8" y="18" width="12" height="8" fill="#FFD4A3" />

			{/* Eyes */}
			<rect x="10" y="20" width="2" height="2" fill="#111827" />
			<rect x="16" y="20" width="2" height="2" fill="#111827" />

			{/* Smile */}
			<rect x="12" y="24" width="4" height="1" fill="#111827" />

			{/* Neck */}
			<rect x="12" y="26" width="4" height="2" fill="#FFD4A3" />

			{/* Bow tie */}
			<rect x="11" y="28" width="2" height="2" fill="#111827" />
			<rect x="15" y="28" width="2" height="2" fill="#111827" />
			<rect x="13" y="28" width="2" height="2" fill="#FFFFFF" />

			{/* Suit jacket */}
			<rect x="8" y="30" width="12" height="6" fill="#1F2937" />
			<rect x="6" y="32" width="16" height="4" fill="#1F2937" />

			{/* Shirt (white center) */}
			<rect x="12" y="30" width="4" height="4" fill="#FFFFFF" />

			{/* Buttons */}
			<rect x="13" y="31" width="2" height="1" fill="#D1D5DB" />
			<rect x="13" y="33" width="2" height="1" fill="#D1D5DB" />

			{/* Left arm */}
			<rect x="6" y="30" width="2" height="4" fill="#1F2937" />
			<rect x="4" y="34" width="2" height="2" fill="#FFD4A3" />

			{/* Right arm - extended toward STOP sign */}
			<rect x="20" y="30" width="2" height="4" fill="#1F2937" />
			<rect x="22" y="32" width="8" height="2" fill="#FFD4A3" />

			{/* === STOP SIGN (right side) === */}
			{/* Red octagon background */}
			<polygon
				points="44,18 50,16 56,18 58,24 56,30 50,32 44,30 42,24"
				fill="#DC2626"
			/>

			{/* Darker red outline */}
			<polygon
				points="44,18 50,16 56,18 58,24 56,30 50,32 44,30 42,24"
				fill="none"
				stroke="#991B1B"
				strokeWidth="1"
			/>

			{/* White border inside */}
			<polygon
				points="44.5,19 50,17 55.5,19 57,24 55.5,29 50,31 44.5,29 43,24"
				fill="none"
				stroke="#FFFFFF"
				strokeWidth="0.5"
			/>

			{/* "STOP" text in pixel art style */}
			{/* Letter S */}
			<rect x="45" y="21" width="3" height="1" fill="#FFFFFF" />
			<rect x="45" y="22" width="1" height="1" fill="#FFFFFF" />
			<rect x="45" y="23" width="3" height="1" fill="#FFFFFF" />
			<rect x="47" y="24" width="1" height="1" fill="#FFFFFF" />
			<rect x="45" y="25" width="3" height="1" fill="#FFFFFF" />

			{/* Letter T */}
			<rect x="49" y="21" width="3" height="1" fill="#FFFFFF" />
			<rect x="50" y="22" width="1" height="4" fill="#FFFFFF" />

			{/* Letter O */}
			<rect x="45" y="27" width="3" height="1" fill="#FFFFFF" />
			<rect x="45" y="28" width="1" height="3" fill="#FFFFFF" />
			<rect x="47" y="28" width="1" height="3" fill="#FFFFFF" />
			<rect x="45" y="30" width="3" height="1" fill="#FFFFFF" />

			{/* Letter P */}
			<rect x="49" y="27" width="1" height="4" fill="#FFFFFF" />
			<rect x="50" y="27" width="2" height="1" fill="#FFFFFF" />
			<rect x="51" y="28" width="1" height="1" fill="#FFFFFF" />
			<rect x="50" y="29" width="2" height="1" fill="#FFFFFF" />

			{/* Sign post */}
			<rect x="48" y="32" width="4" height="12" fill="#6B7280" />
			<rect x="46" y="44" width="8" height="2" fill="#4B5563" />
		</svg>
	);
}
