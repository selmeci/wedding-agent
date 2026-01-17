interface BrokenHeartProps {
	className?: string;
}

export function BrokenHeart({ className = "" }: BrokenHeartProps) {
	return (
		<svg
			viewBox="0 0 128 128"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			style={{ imageRendering: "pixelated" }}
			aria-label="Broken heart"
		>
			{/* Color palette */}
			<defs>
				{/* Pink gradients */}
				<linearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" style={{ stopColor: "#FF8FB3", stopOpacity: 1 }} />
					<stop
						offset="100%"
						style={{ stopColor: "#FF6B9D", stopOpacity: 1 }}
					/>
				</linearGradient>
			</defs>

			{/* Left half of broken heart (scaled 2x) */}
			<g>
				{/* Outer dark outline - left top lobe */}
				<rect x="16" y="32" width="8" height="8" fill="#D94A7A" />
				<rect x="16" y="40" width="8" height="8" fill="#D94A7A" />
				<rect x="24" y="24" width="8" height="8" fill="#D94A7A" />
				<rect x="32" y="24" width="8" height="8" fill="#D94A7A" />
				<rect x="40" y="24" width="8" height="8" fill="#D94A7A" />
				<rect x="48" y="24" width="8" height="8" fill="#D94A7A" />

				{/* Top lobe shading - left */}
				<rect x="24" y="32" width="8" height="8" fill="#FF8FB3" />
				<rect x="24" y="40" width="8" height="8" fill="#FF8FB3" />
				<rect x="32" y="32" width="8" height="16" fill="#FFB5D5" />
				<rect x="40" y="32" width="8" height="16" fill="#FFB5D5" />
				<rect x="48" y="32" width="8" height="16" fill="#FFB5D5" />

				{/* Heart body - left side with gradient effect */}
				<rect x="16" y="48" width="8" height="8" fill="#D94A7A" />
				<rect x="24" y="48" width="8" height="16" fill="#FF8FB3" />
				<rect x="32" y="48" width="8" height="24" fill="#FFB5D5" />
				<rect x="40" y="48" width="8" height="32" fill="#FFB5D5" />
				<rect x="48" y="48" width="8" height="40" fill="#FFD4E8" />

				{/* Darker shading on left edge */}
				<rect x="16" y="56" width="8" height="8" fill="#D94A7A" />
				<rect x="16" y="64" width="8" height="8" fill="#D94A7A" />
				<rect x="24" y="64" width="8" height="8" fill="#FF6B9D" />
				<rect x="24" y="72" width="8" height="8" fill="#FF6B9D" />
				<rect x="32" y="72" width="8" height="8" fill="#FF6B9D" />
				<rect x="32" y="80" width="8" height="8" fill="#FF6B9D" />
				<rect x="40" y="80" width="8" height="8" fill="#FF8FB3" />
				<rect x="40" y="88" width="8" height="8" fill="#FF8FB3" />
				<rect x="48" y="88" width="8" height="8" fill="#FF8FB3" />

				{/* Highlights on left */}
				<rect x="40" y="40" width="4" height="4" fill="#FFFFFF" opacity="0.6" />
				<rect x="32" y="48" width="4" height="4" fill="#FFFFFF" opacity="0.4" />

				{/* NEW: Additional left side detail */}
				<rect x="28" y="36" width="4" height="4" fill="#FFCCE0" opacity="0.5" />
				<rect x="44" y="44" width="4" height="4" fill="#FFE8F0" opacity="0.4" />
			</g>

			{/* Crack/break in the middle with depth (scaled 2x + enhanced) */}
			<g>
				{/* Dark crack shadow */}
				<rect x="56" y="32" width="8" height="8" fill="#6B3A47" />
				<rect x="56" y="40" width="8" height="16" fill="#6B3A47" />
				<rect x="64" y="48" width="8" height="8" fill="#6B3A47" />
				<rect x="56" y="56" width="8" height="8" fill="#6B3A47" />
				<rect x="56" y="64" width="8" height="16" fill="#6B3A47" />
				<rect x="64" y="72" width="8" height="8" fill="#6B3A47" />

				{/* Mid-tone crack */}
				<rect x="64" y="40" width="8" height="8" fill="#8B4A5A" />
				<rect x="64" y="56" width="8" height="8" fill="#8B4A5A" />
				<rect x="64" y="64" width="8" height="8" fill="#8B4A5A" />

				{/* Jagged crack edges */}
				<rect x="60" y="36" width="4" height="4" fill="#4A2A35" />
				<rect x="60" y="52" width="4" height="4" fill="#4A2A35" />
				<rect x="60" y="68" width="4" height="4" fill="#4A2A35" />

				{/* NEW: Enhanced crack depth */}
				<rect x="58" y="44" width="2" height="4" fill="#3D2028" />
				<rect x="66" y="60" width="2" height="4" fill="#3D2028" />
				<rect x="58" y="76" width="2" height="4" fill="#3D2028" />

				{/* NEW: Crack highlight edges */}
				<rect x="70" y="42" width="2" height="4" fill="#9B5A6A" opacity="0.6" />
				<rect x="70" y="58" width="2" height="4" fill="#9B5A6A" opacity="0.6" />
			</g>

			{/* Right half of broken heart (offset for break effect) (scaled 2x) */}
			<g transform="translate(8, 8)">
				{/* Outer dark outline - right top lobe */}
				<rect x="64" y="16" width="8" height="8" fill="#D94A7A" />
				<rect x="72" y="16" width="8" height="8" fill="#D94A7A" />
				<rect x="80" y="16" width="8" height="8" fill="#D94A7A" />
				<rect x="88" y="16" width="8" height="8" fill="#D94A7A" />
				<rect x="96" y="24" width="8" height="8" fill="#D94A7A" />
				<rect x="96" y="32" width="8" height="8" fill="#D94A7A" />

				{/* Top lobe shading - right */}
				<rect x="64" y="24" width="8" height="16" fill="#FFB5D5" />
				<rect x="72" y="24" width="8" height="16" fill="#FFB5D5" />
				<rect x="80" y="24" width="8" height="16" fill="#FFB5D5" />
				<rect x="88" y="24" width="8" height="8" fill="#FF8FB3" />
				<rect x="88" y="32" width="8" height="8" fill="#FF8FB3" />

				{/* Heart body - right side */}
				<rect x="64" y="40" width="8" height="40" fill="#FFD4E8" />
				<rect x="72" y="40" width="8" height="32" fill="#FFB5D5" />
				<rect x="80" y="40" width="8" height="24" fill="#FFB5D5" />
				<rect x="88" y="40" width="8" height="16" fill="#FF8FB3" />
				<rect x="96" y="40" width="8" height="8" fill="#D94A7A" />

				{/* Darker shading on right edge */}
				<rect x="64" y="80" width="8" height="8" fill="#FF8FB3" />
				<rect x="72" y="72" width="8" height="8" fill="#FF8FB3" />
				<rect x="80" y="64" width="8" height="8" fill="#FF6B9D" />
				<rect x="88" y="56" width="8" height="8" fill="#FF6B9D" />
				<rect x="96" y="48" width="8" height="8" fill="#D94A7A" />

				{/* Highlights on right */}
				<rect x="72" y="32" width="4" height="4" fill="#FFFFFF" opacity="0.6" />
				<rect x="80" y="40" width="4" height="4" fill="#FFFFFF" opacity="0.4" />

				{/* NEW: Additional right side detail */}
				<rect x="76" y="28" width="4" height="4" fill="#FFE8F0" opacity="0.5" />
				<rect x="68" y="48" width="4" height="4" fill="#FFCCE0" opacity="0.4" />
			</g>

			{/* Enhanced teardrops with gradient (scaled 2x + enhanced) */}
			<g>
				{/* Left teardrop - larger and more detailed */}
				<rect x="32" y="96" width="8" height="8" fill="#5DADE2" />
				<rect x="32" y="104" width="8" height="8" fill="#5DADE2" />
				<rect x="40" y="104" width="8" height="8" fill="#85C1E9" />
				<rect x="40" y="112" width="8" height="8" fill="#85C1E9" />
				<rect x="36" y="100" width="4" height="4" fill="#FFFFFF" opacity="0.7" />

				{/* NEW: Left teardrop depth */}
				<rect x="34" y="106" width="4" height="6" fill="#3498DB" opacity="0.5" />

				{/* Left small tear splash */}
				<rect x="24" y="112" width="4" height="4" fill="#AED6F1" />
				<rect x="48" y="116" width="4" height="4" fill="#AED6F1" />

				{/* NEW: Extra splash details */}
				<rect x="20" y="116" width="2" height="2" fill="#D4E6F1" />
				<rect x="52" y="120" width="2" height="2" fill="#D4E6F1" />

				{/* Right teardrop - larger and more detailed */}
				<rect x="80" y="104" width="8" height="8" fill="#5DADE2" />
				<rect x="80" y="112" width="8" height="8" fill="#5DADE2" />
				<rect x="72" y="112" width="8" height="8" fill="#85C1E9" />
				<rect x="72" y="120" width="8" height="8" fill="#85C1E9" />
				<rect x="84" y="108" width="4" height="4" fill="#FFFFFF" opacity="0.7" />

				{/* NEW: Right teardrop depth */}
				<rect x="82" y="114" width="4" height="6" fill="#3498DB" opacity="0.5" />

				{/* Right small tear splash */}
				<rect x="88" y="120" width="4" height="4" fill="#AED6F1" />
				<rect x="64" y="124" width="4" height="4" fill="#AED6F1" />

				{/* NEW: Extra splash details */}
				<rect x="92" y="124" width="2" height="2" fill="#D4E6F1" />
				<rect x="60" y="126" width="2" height="2" fill="#D4E6F1" />
			</g>

			{/* Sparkle/shimmer effects (scaled 2x + enhanced) */}
			<g opacity="0.8">
				{/* Small sparkles around break */}
				<rect x="52" y="28" width="4" height="4" fill="#FFFFFF" />
				<rect x="76" y="36" width="4" height="4" fill="#FFFFFF" />
				<rect x="60" y="76" width="4" height="4" fill="#FFFFFF" />

				{/* Tiny sparkle dots */}
				<rect x="28" y="44" width="2" height="2" fill="#FFFFFF" />
				<rect x="92" y="52" width="2" height="2" fill="#FFFFFF" />

				{/* NEW: Additional sparkles */}
				<rect x="48" y="20" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
				<rect x="84" y="28" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
				<rect x="36" y="60" width="2" height="2" fill="#FFFFFF" opacity="0.5" />
				<rect x="100" y="44" width="2" height="2" fill="#FFFFFF" opacity="0.5" />

				{/* NEW: Cross-shaped sparkles */}
				<rect x="54" y="22" width="2" height="6" fill="#FFFFFF" opacity="0.4" />
				<rect x="52" y="24" width="6" height="2" fill="#FFFFFF" opacity="0.4" />
			</g>

			{/* NEW: Floating heart particles */}
			<g opacity="0.6">
				<rect x="22" y="24" width="4" height="4" fill="#FFB5D5" />
				<rect x="100" y="20" width="4" height="4" fill="#FFB5D5" />
				<rect x="18" y="84" width="3" height="3" fill="#FF8FB3" />
				<rect x="106" y="76" width="3" height="3" fill="#FF8FB3" />
			</g>
		</svg>
	);
}
