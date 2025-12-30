interface GuestProps {
	className?: string;
	isThrowing?: boolean; // true = throwing phase, false = ready phase
}

export function Guest({ className = "", isThrowing = false }: GuestProps) {
	return (
		<svg
			viewBox="0 0 64 64"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			style={{ imageRendering: "pixelated" }}
			role="img"
			aria-label="Guest with camera"
		>
			{/* Head */}
			<g>
				{/* Hair - brown */}
				<rect x="20" y="12" width="24" height="4" fill="#4A3728" />
				<rect x="16" y="16" width="32" height="4" fill="#4A3728" />
				<rect x="16" y="20" width="4" height="8" fill="#4A3728" />
				<rect x="44" y="20" width="4" height="8" fill="#4A3728" />

				{/* Face - skin tone */}
				<rect x="20" y="16" width="24" height="4" fill="#FDBCB4" />
				<rect x="20" y="20" width="24" height="12" fill="#FDBCB4" />

				{/* Eyes */}
				<rect x="24" y="22" width="4" height="4" fill="#2C2C2C" />
				<rect x="36" y="22" width="4" height="4" fill="#2C2C2C" />
				<rect x="26" y="24" width="2" height="2" fill="#FFFFFF" />
				<rect x="38" y="24" width="2" height="2" fill="#FFFFFF" />

				{/* Smile */}
				<rect x="26" y="28" width="2" height="2" fill="#D17A6B" />
				<rect x="28" y="29" width="8" height="2" fill="#D17A6B" />
				<rect x="36" y="28" width="2" height="2" fill="#D17A6B" />

				{/* Ears */}
				<rect x="16" y="24" width="4" height="6" fill="#F49E8D" />
				<rect x="44" y="24" width="4" height="6" fill="#F49E8D" />
			</g>

			{/* Body - Blue shirt */}
			<g>
				{/* Neck */}
				<rect x="26" y="32" width="12" height="4" fill="#FDBCB4" />

				{/* Shirt - collar */}
				<rect x="24" y="36" width="16" height="4" fill="#4A90E2" />

				{/* Shirt - body */}
				<rect x="20" y="40" width="24" height="12" fill="#4A90E2" />

				{/* Shirt - darker shading */}
				<rect x="20" y="44" width="4" height="8" fill="#357ABD" />
				<rect x="40" y="44" width="4" height="8" fill="#357ABD" />

				{/* Shirt - buttons */}
				<rect x="31" y="42" width="2" height="2" fill="#2E6BA8" />
				<rect x="31" y="46" width="2" height="2" fill="#2E6BA8" />
			</g>

			{/* Arms - different positions based on throwing state */}
			{isThrowing ? (
				// Throwing pose - right arm up
				<g>
					{/* Left arm - down */}
					<rect x="16" y="40" width="4" height="12" fill="#FDBCB4" />
					<rect x="16" y="52" width="4" height="4" fill="#F49E8D" />

					{/* Right arm - up (throwing) */}
					<rect x="44" y="24" width="4" height="8" fill="#FDBCB4" />
					<rect x="44" y="20" width="4" height="4" fill="#F49E8D" />
					<rect x="48" y="16" width="4" height="4" fill="#F49E8D" />

					{/* Camera in raised hand */}
					<rect x="48" y="12" width="8" height="6" fill="#2C2C2C" />
					<rect x="52" y="14" width="2" height="2" fill="#FF4444" />
				</g>
			) : (
				// Ready pose - camera at chest
				<g>
					{/* Left arm */}
					<rect x="16" y="40" width="4" height="8" fill="#FDBCB4" />
					<rect x="16" y="48" width="4" height="4" fill="#F49E8D" />

					{/* Right arm */}
					<rect x="44" y="40" width="4" height="8" fill="#FDBCB4" />
					<rect x="44" y="48" width="4" height="4" fill="#F49E8D" />

					{/* Camera at chest - black body */}
					<rect x="26" y="44" width="12" height="8" fill="#2C2C2C" />
					<rect x="24" y="46" width="2" height="4" fill="#1A1A1A" />
					<rect x="38" y="46" width="2" height="4" fill="#1A1A1A" />

					{/* Camera - red lens */}
					<rect x="30" y="46" width="4" height="4" fill="#FF4444" />
					<rect
						x="32"
						y="48"
						width="2"
						height="2"
						fill="#FFFFFF"
						opacity="0.6"
					/>

					{/* Camera - viewfinder */}
					<rect x="28" y="45" width="2" height="2" fill="#357ABD" />
				</g>
			)}

			{/* Legs - Brown pants */}
			<g>
				<rect x="22" y="52" width="8" height="8" fill="#8B6F47" />
				<rect x="34" y="52" width="8" height="8" fill="#8B6F47" />

				{/* Darker shading */}
				<rect x="22" y="56" width="2" height="4" fill="#6B5437" />
				<rect x="40" y="56" width="2" height="4" fill="#6B5437" />

				{/* Shoes - dark */}
				<rect x="20" y="60" width="10" height="4" fill="#2C2C2C" />
				<rect x="34" y="60" width="10" height="4" fill="#2C2C2C" />
			</g>
		</svg>
	);
}
