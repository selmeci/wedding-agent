export function Microphone({
	className = "",
	animated = false,
	recording = false,
}: {
	className?: string;
	animated?: boolean;
	recording?: boolean;
}) {
	// Use red colors when recording, pink when idle
	const primaryColor = recording ? "#FF3D3D" : "#FF3D6F";
	const secondaryColor = recording ? "#FF6B6B" : "#FF6B8E";
	const tertiaryColor = recording ? "#FF9B9B" : "#FF9BB0";
	const outlineColor = recording ? "#E62121" : "#E6215C";
	const highlightColor = recording ? "#FFE3E3" : "#FFE3E8";

	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className} ${animated || recording ? "animate-pulse" : ""}`}
			role="img"
			aria-label="Mikrofón"
		>
			{/* Microphone head - rounded top */}
			<rect x="12" y="4" width="8" height="2" fill={primaryColor} />
			<rect x="10" y="6" width="12" height="2" fill={primaryColor} />

			{/* Microphone body */}
			<rect x="10" y="8" width="12" height="2" fill={secondaryColor} />
			<rect x="10" y="10" width="12" height="2" fill={secondaryColor} />
			<rect x="10" y="12" width="12" height="2" fill={tertiaryColor} />
			<rect x="10" y="14" width="12" height="2" fill={tertiaryColor} />

			{/* Microphone bottom */}
			<rect x="12" y="16" width="8" height="2" fill={tertiaryColor} />

			{/* Microphone outline */}
			<rect x="10" y="4" width="2" height="2" fill={outlineColor} />
			<rect x="20" y="4" width="2" height="2" fill={outlineColor} />
			<rect x="8" y="6" width="2" height="12" fill={outlineColor} />
			<rect x="22" y="6" width="2" height="12" fill={outlineColor} />
			<rect x="10" y="16" width="2" height="2" fill={outlineColor} />
			<rect x="20" y="16" width="2" height="2" fill={outlineColor} />

			{/* Stand */}
			<rect x="14" y="18" width="4" height="4" fill={secondaryColor} />
			<rect x="12" y="18" width="2" height="2" fill={outlineColor} />
			<rect x="18" y="18" width="2" height="2" fill={outlineColor} />

			{/* Base */}
			<rect x="10" y="22" width="12" height="2" fill={primaryColor} />
			<rect x="8" y="24" width="16" height="2" fill={outlineColor} />

			{/* Highlight (lighter color) */}
			<rect x="12" y="6" width="2" height="2" fill={highlightColor} />
			<rect x="12" y="8" width="2" height="2" fill={highlightColor} />

			{/* Sound waves when recording */}
			{recording && (
				<>
					<rect x="4" y="10" width="2" height="2" fill={primaryColor} />
					<rect x="4" y="14" width="2" height="2" fill={primaryColor} />
					<rect x="26" y="10" width="2" height="2" fill={primaryColor} />
					<rect x="26" y="14" width="2" height="2" fill={primaryColor} />
				</>
			)}
		</svg>
	);
}
