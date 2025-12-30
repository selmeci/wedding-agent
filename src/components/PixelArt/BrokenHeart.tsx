interface BrokenHeartProps {
	className?: string;
}

export function BrokenHeart({ className = "" }: BrokenHeartProps) {
	return (
		<svg
			viewBox="0 0 64 64"
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

			{/* Left half of broken heart */}
			<g>
				{/* Outer dark outline - left top lobe */}
				<rect x="8" y="16" width="4" height="4" fill="#D94A7A" />
				<rect x="8" y="20" width="4" height="4" fill="#D94A7A" />
				<rect x="12" y="12" width="4" height="4" fill="#D94A7A" />
				<rect x="16" y="12" width="4" height="4" fill="#D94A7A" />
				<rect x="20" y="12" width="4" height="4" fill="#D94A7A" />
				<rect x="24" y="12" width="4" height="4" fill="#D94A7A" />

				{/* Top lobe shading - left */}
				<rect x="12" y="16" width="4" height="4" fill="#FF8FB3" />
				<rect x="12" y="20" width="4" height="4" fill="#FF8FB3" />
				<rect x="16" y="16" width="4" height="8" fill="#FFB5D5" />
				<rect x="20" y="16" width="4" height="8" fill="#FFB5D5" />
				<rect x="24" y="16" width="4" height="8" fill="#FFB5D5" />

				{/* Heart body - left side with gradient effect */}
				<rect x="8" y="24" width="4" height="4" fill="#D94A7A" />
				<rect x="12" y="24" width="4" height="8" fill="#FF8FB3" />
				<rect x="16" y="24" width="4" height="12" fill="#FFB5D5" />
				<rect x="20" y="24" width="4" height="16" fill="#FFB5D5" />
				<rect x="24" y="24" width="4" height="20" fill="#FFD4E8" />

				{/* Darker shading on left edge */}
				<rect x="8" y="28" width="4" height="4" fill="#D94A7A" />
				<rect x="8" y="32" width="4" height="4" fill="#D94A7A" />
				<rect x="12" y="32" width="4" height="4" fill="#FF6B9D" />
				<rect x="12" y="36" width="4" height="4" fill="#FF6B9D" />
				<rect x="16" y="36" width="4" height="4" fill="#FF6B9D" />
				<rect x="16" y="40" width="4" height="4" fill="#FF6B9D" />
				<rect x="20" y="40" width="4" height="4" fill="#FF8FB3" />
				<rect x="20" y="44" width="4" height="4" fill="#FF8FB3" />
				<rect x="24" y="44" width="4" height="4" fill="#FF8FB3" />

				{/* Highlights on left */}
				<rect x="20" y="20" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
				<rect x="16" y="24" width="2" height="2" fill="#FFFFFF" opacity="0.4" />
			</g>

			{/* Crack/break in the middle with depth */}
			<g>
				{/* Dark crack shadow */}
				<rect x="28" y="16" width="4" height="4" fill="#6B3A47" />
				<rect x="28" y="20" width="4" height="8" fill="#6B3A47" />
				<rect x="32" y="24" width="4" height="4" fill="#6B3A47" />
				<rect x="28" y="28" width="4" height="4" fill="#6B3A47" />
				<rect x="28" y="32" width="4" height="8" fill="#6B3A47" />
				<rect x="32" y="36" width="4" height="4" fill="#6B3A47" />

				{/* Mid-tone crack */}
				<rect x="32" y="20" width="4" height="4" fill="#8B4A5A" />
				<rect x="32" y="28" width="4" height="4" fill="#8B4A5A" />
				<rect x="32" y="32" width="4" height="4" fill="#8B4A5A" />

				{/* Jagged crack edges */}
				<rect x="30" y="18" width="2" height="2" fill="#4A2A35" />
				<rect x="30" y="26" width="2" height="2" fill="#4A2A35" />
				<rect x="30" y="34" width="2" height="2" fill="#4A2A35" />
			</g>

			{/* Right half of broken heart (offset for break effect) */}
			<g transform="translate(4, 4)">
				{/* Outer dark outline - right top lobe */}
				<rect x="32" y="8" width="4" height="4" fill="#D94A7A" />
				<rect x="36" y="8" width="4" height="4" fill="#D94A7A" />
				<rect x="40" y="8" width="4" height="4" fill="#D94A7A" />
				<rect x="44" y="8" width="4" height="4" fill="#D94A7A" />
				<rect x="48" y="12" width="4" height="4" fill="#D94A7A" />
				<rect x="48" y="16" width="4" height="4" fill="#D94A7A" />

				{/* Top lobe shading - right */}
				<rect x="32" y="12" width="4" height="8" fill="#FFB5D5" />
				<rect x="36" y="12" width="4" height="8" fill="#FFB5D5" />
				<rect x="40" y="12" width="4" height="8" fill="#FFB5D5" />
				<rect x="44" y="12" width="4" height="4" fill="#FF8FB3" />
				<rect x="44" y="16" width="4" height="4" fill="#FF8FB3" />

				{/* Heart body - right side */}
				<rect x="32" y="20" width="4" height="20" fill="#FFD4E8" />
				<rect x="36" y="20" width="4" height="16" fill="#FFB5D5" />
				<rect x="40" y="20" width="4" height="12" fill="#FFB5D5" />
				<rect x="44" y="20" width="4" height="8" fill="#FF8FB3" />
				<rect x="48" y="20" width="4" height="4" fill="#D94A7A" />

				{/* Darker shading on right edge */}
				<rect x="32" y="40" width="4" height="4" fill="#FF8FB3" />
				<rect x="36" y="36" width="4" height="4" fill="#FF8FB3" />
				<rect x="40" y="32" width="4" height="4" fill="#FF6B9D" />
				<rect x="44" y="28" width="4" height="4" fill="#FF6B9D" />
				<rect x="48" y="24" width="4" height="4" fill="#D94A7A" />

				{/* Highlights on right */}
				<rect x="36" y="16" width="2" height="2" fill="#FFFFFF" opacity="0.6" />
				<rect x="40" y="20" width="2" height="2" fill="#FFFFFF" opacity="0.4" />
			</g>

			{/* Enhanced teardrops with gradient */}
			<g>
				{/* Left teardrop - larger and more detailed */}
				<rect x="16" y="48" width="4" height="4" fill="#5DADE2" />
				<rect x="16" y="52" width="4" height="4" fill="#5DADE2" />
				<rect x="20" y="52" width="4" height="4" fill="#85C1E9" />
				<rect x="20" y="56" width="4" height="4" fill="#85C1E9" />
				<rect x="18" y="50" width="2" height="2" fill="#FFFFFF" opacity="0.7" />

				{/* Left small tear splash */}
				<rect x="12" y="56" width="2" height="2" fill="#AED6F1" />
				<rect x="24" y="58" width="2" height="2" fill="#AED6F1" />

				{/* Right teardrop - larger and more detailed */}
				<rect x="40" y="52" width="4" height="4" fill="#5DADE2" />
				<rect x="40" y="56" width="4" height="4" fill="#5DADE2" />
				<rect x="36" y="56" width="4" height="4" fill="#85C1E9" />
				<rect x="36" y="60" width="4" height="4" fill="#85C1E9" />
				<rect x="42" y="54" width="2" height="2" fill="#FFFFFF" opacity="0.7" />

				{/* Right small tear splash */}
				<rect x="44" y="60" width="2" height="2" fill="#AED6F1" />
				<rect x="32" y="62" width="2" height="2" fill="#AED6F1" />
			</g>

			{/* Sparkle/shimmer effects */}
			<g opacity="0.8">
				{/* Small sparkles around break */}
				<rect x="26" y="14" width="2" height="2" fill="#FFFFFF" />
				<rect x="38" y="18" width="2" height="2" fill="#FFFFFF" />
				<rect x="30" y="38" width="2" height="2" fill="#FFFFFF" />

				{/* Tiny sparkle dots */}
				<rect x="14" y="22" width="1" height="1" fill="#FFFFFF" />
				<rect x="46" y="26" width="1" height="1" fill="#FFFFFF" />
			</g>
		</svg>
	);
}
