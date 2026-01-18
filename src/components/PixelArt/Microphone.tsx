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
	const accentColor = recording ? "#FF5555" : "#FF5580";
	const darkOutline = recording ? "#CC1A1A" : "#CC1A50";

	return (
		<svg
			width="128"
			height="128"
			viewBox="0 0 128 128"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`pixel-art ${className} ${animated || recording ? "animate-pulse" : ""}`}
			role="img"
			aria-label="Mikrofón"
		>
			{/* Microphone head - rounded top (scaled 4x) */}
			<rect x="48" y="16" width="32" height="8" fill={primaryColor} />
			<rect x="40" y="24" width="48" height="8" fill={primaryColor} />

			{/* NEW: Head top curve detail */}
			<rect x="52" y="12" width="24" height="4" fill={primaryColor} />
			<rect x="56" y="8" width="16" height="4" fill={accentColor} />

			{/* Microphone body (scaled 4x) */}
			<rect x="40" y="32" width="48" height="8" fill={secondaryColor} />
			<rect x="40" y="40" width="48" height="8" fill={secondaryColor} />
			<rect x="40" y="48" width="48" height="8" fill={tertiaryColor} />
			<rect x="40" y="56" width="48" height="8" fill={tertiaryColor} />

			{/* NEW: Body gradient layers */}
			<rect x="44" y="36" width="40" height="4" fill={accentColor} />
			<rect x="44" y="52" width="40" height="4" fill={secondaryColor} />

			{/* Microphone bottom (scaled 4x) */}
			<rect x="48" y="64" width="32" height="8" fill={tertiaryColor} />

			{/* Microphone outline (scaled 4x) */}
			<rect x="40" y="16" width="8" height="8" fill={outlineColor} />
			<rect x="80" y="16" width="8" height="8" fill={outlineColor} />
			<rect x="32" y="24" width="8" height="48" fill={outlineColor} />
			<rect x="88" y="24" width="8" height="48" fill={outlineColor} />
			<rect x="40" y="64" width="8" height="8" fill={outlineColor} />
			<rect x="80" y="64" width="8" height="8" fill={outlineColor} />

			{/* NEW: Inner outline for depth */}
			<rect x="44" y="20" width="4" height="4" fill={darkOutline} />
			<rect x="80" y="20" width="4" height="4" fill={darkOutline} />
			<rect x="36" y="28" width="4" height="40" fill={darkOutline} />
			<rect x="88" y="28" width="4" height="40" fill={darkOutline} />

			{/* Stand (scaled 4x) */}
			<rect x="56" y="72" width="16" height="16" fill={secondaryColor} />
			<rect x="48" y="72" width="8" height="8" fill={outlineColor} />
			<rect x="72" y="72" width="8" height="8" fill={outlineColor} />

			{/* NEW: Stand neck detail */}
			<rect x="52" y="72" width="4" height="16" fill={outlineColor} />
			<rect x="72" y="72" width="4" height="16" fill={outlineColor} />
			<rect x="60" y="76" width="8" height="8" fill={tertiaryColor} />

			{/* Base (scaled 4x) */}
			<rect x="40" y="88" width="48" height="8" fill={primaryColor} />
			<rect x="32" y="96" width="64" height="8" fill={outlineColor} />

			{/* NEW: Base detail */}
			<rect x="44" y="90" width="40" height="4" fill={accentColor} />
			<rect x="36" y="100" width="56" height="4" fill={darkOutline} />

			{/* NEW: Base feet/support */}
			<rect x="28" y="104" width="8" height="8" fill={outlineColor} />
			<rect x="92" y="104" width="8" height="8" fill={outlineColor} />
			<rect x="32" y="108" width="4" height="4" fill={darkOutline} />
			<rect x="92" y="108" width="4" height="4" fill={darkOutline} />

			{/* Highlight (scaled 4x + enhanced) */}
			<rect x="48" y="24" width="8" height="8" fill={highlightColor} />
			<rect x="48" y="32" width="8" height="8" fill={highlightColor} />

			{/* NEW: Additional highlights for 3D effect */}
			<rect x="52" y="28" width="4" height="4" fill="#FFF5F7" />
			<rect x="52" y="36" width="4" height="4" fill="#FFDDE5" />
			<rect
				x="56"
				y="44"
				width="8"
				height="4"
				fill={highlightColor}
				opacity="0.6"
			/>

			{/* NEW: Mesh/grill pattern on mic head */}
			<rect
				x="52"
				y="28"
				width="4"
				height="4"
				fill={tertiaryColor}
				opacity="0.3"
			/>
			<rect
				x="60"
				y="28"
				width="4"
				height="4"
				fill={tertiaryColor}
				opacity="0.3"
			/>
			<rect
				x="68"
				y="28"
				width="4"
				height="4"
				fill={tertiaryColor}
				opacity="0.3"
			/>
			<rect
				x="76"
				y="28"
				width="4"
				height="4"
				fill={tertiaryColor}
				opacity="0.3"
			/>
			<rect
				x="56"
				y="36"
				width="4"
				height="4"
				fill={tertiaryColor}
				opacity="0.3"
			/>
			<rect
				x="64"
				y="36"
				width="4"
				height="4"
				fill={tertiaryColor}
				opacity="0.3"
			/>
			<rect
				x="72"
				y="36"
				width="4"
				height="4"
				fill={tertiaryColor}
				opacity="0.3"
			/>

			{/* Sound waves when recording (scaled 4x + enhanced) */}
			{recording && (
				<>
					{/* Left waves */}
					<rect x="16" y="40" width="8" height="8" fill={primaryColor} />
					<rect x="16" y="56" width="8" height="8" fill={primaryColor} />
					<rect x="8" y="48" width="8" height="8" fill={accentColor} />
					{/* Right waves */}
					<rect x="104" y="40" width="8" height="8" fill={primaryColor} />
					<rect x="104" y="56" width="8" height="8" fill={primaryColor} />
					<rect x="112" y="48" width="8" height="8" fill={accentColor} />
					{/* Extra wave details */}
					<rect x="20" y="32" width="4" height="4" fill={secondaryColor} />
					<rect x="20" y="64" width="4" height="4" fill={secondaryColor} />
					<rect x="104" y="32" width="4" height="4" fill={secondaryColor} />
					<rect x="104" y="64" width="4" height="4" fill={secondaryColor} />
				</>
			)}

			{/* ENHANCED: Sparkle effects on mic head */}
			<g opacity="0.85">
				{/* Top left sparkle */}
				<rect x="42" y="8" width="4" height="4" fill="#FFFFFF" />
				<rect x="40" y="10" width="2" height="6" fill="#FFFFFF" opacity="0.5" />
				<rect x="36" y="12" width="8" height="2" fill="#FFFFFF" opacity="0.5" />

				{/* Small accent sparkles */}
				<rect x="56" y="18" width="2" height="2" fill="#FFFFFF" />
				<rect x="76" y="24" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
				<rect x="46" y="44" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
			</g>

			{/* ENHANCED: Shine streak on mic body */}
			<rect x="50" y="28" width="2" height="28" fill="#FFFFFF" opacity="0.25" />

			{/* ENHANCED: Base reflection */}
			<rect
				x="44"
				y="92"
				width="8"
				height="2"
				fill={highlightColor}
				opacity="0.4"
			/>

			{/* ENHANCED: Recording indicator light */}
			{recording && (
				<>
					<rect x="60" y="68" width="8" height="4" fill="#FF0000" />
					<rect x="62" y="69" width="4" height="2" fill="#FF6666" />
				</>
			)}
		</svg>
	);
}
