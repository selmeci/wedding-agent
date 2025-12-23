export function Groom({ className = "" }: { className?: string }) {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className}`}
			role="img"
			aria-label="Ženích"
		>
			{/* Hair */}
			<rect x="10" y="6" width="12" height="2" fill="#2C1810" />
			<rect x="8" y="8" width="16" height="4" fill="#2C1810" />

			{/* Face */}
			<rect x="10" y="12" width="12" height="8" fill="#FFD4A3" />

			{/* Eyes */}
			<rect x="12" y="14" width="2" height="2" fill="#111827" />
			<rect x="18" y="14" width="2" height="2" fill="#111827" />

			{/* Smile */}
			<rect x="14" y="18" width="4" height="1" fill="#111827" />

			{/* Neck */}
			<rect x="14" y="20" width="4" height="2" fill="#FFD4A3" />

			{/* Bow tie */}
			<rect x="13" y="22" width="2" height="2" fill="#111827" />
			<rect x="17" y="22" width="2" height="2" fill="#111827" />
			<rect x="15" y="22" width="2" height="2" fill="#FFFFFF" />

			{/* Suit jacket */}
			<rect x="10" y="24" width="12" height="6" fill="#1F2937" />
			<rect x="8" y="26" width="16" height="4" fill="#1F2937" />

			{/* Shirt (white center) */}
			<rect x="14" y="24" width="4" height="4" fill="#FFFFFF" />

			{/* Buttons */}
			<rect x="15" y="25" width="2" height="1" fill="#D1D5DB" />
			<rect x="15" y="27" width="2" height="1" fill="#D1D5DB" />

			{/* Arms */}
			<rect x="8" y="24" width="2" height="4" fill="#1F2937" />
			<rect x="22" y="24" width="2" height="4" fill="#1F2937" />

			{/* Hands */}
			<rect x="6" y="28" width="2" height="2" fill="#FFD4A3" />
			<rect x="24" y="28" width="2" height="2" fill="#FFD4A3" />
		</svg>
	);
}
