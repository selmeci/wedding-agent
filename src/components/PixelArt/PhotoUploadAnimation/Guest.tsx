interface GuestProps {
	className?: string;
	isThrowing?: boolean; // true = throwing phase, false = ready phase
}

export function Guest({ className = "", isThrowing = false }: GuestProps) {
	return (
		<svg
			viewBox="0 0 128 128"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			style={{ imageRendering: "pixelated" }}
			role="img"
			aria-label="Guest with camera"
		>
			{/* Head */}
			<g>
				{/* Hair - brown (scaled 2x + enhanced) */}
				<rect x="40" y="24" width="48" height="8" fill="#4A3728" />
				<rect x="32" y="32" width="64" height="8" fill="#4A3728" />
				<rect x="32" y="40" width="8" height="16" fill="#4A3728" />
				<rect x="88" y="40" width="8" height="16" fill="#4A3728" />

				{/* NEW: Hair texture */}
				<rect x="44" y="26" width="12" height="4" fill="#5A4738" />
				<rect x="68" y="28" width="16" height="4" fill="#3A2718" />
				<rect x="34" y="42" width="4" height="10" fill="#3A2718" />

				{/* Face - skin tone (scaled 2x) */}
				<rect x="40" y="32" width="48" height="8" fill="#FDBCB4" />
				<rect x="40" y="40" width="48" height="24" fill="#FDBCB4" />

				{/* NEW: Face shading */}
				<rect
					x="40"
					y="40"
					width="4"
					height="20"
					fill="#E8A99A"
					opacity="0.4"
				/>
				<rect
					x="84"
					y="40"
					width="4"
					height="20"
					fill="#E8A99A"
					opacity="0.4"
				/>

				{/* Eyes (scaled 2x + enhanced) */}
				<rect x="48" y="44" width="8" height="8" fill="#2C2C2C" />
				<rect x="72" y="44" width="8" height="8" fill="#2C2C2C" />
				<rect x="52" y="48" width="4" height="4" fill="#FFFFFF" />
				<rect x="76" y="48" width="4" height="4" fill="#FFFFFF" />

				{/* NEW: Eyebrows */}
				<rect x="47" y="42" width="10" height="2" fill="#3A2718" />
				<rect x="71" y="42" width="10" height="2" fill="#3A2718" />

				{/* Smile (scaled 2x + enhanced) */}
				<rect x="52" y="56" width="4" height="4" fill="#D17A6B" />
				<rect x="56" y="58" width="16" height="4" fill="#D17A6B" />
				<rect x="72" y="56" width="4" height="4" fill="#D17A6B" />

				{/* NEW: Smile detail */}
				<rect x="60" y="60" width="8" height="2" fill="#C06A5B" />

				{/* Ears (scaled 2x) */}
				<rect x="32" y="48" width="8" height="12" fill="#F49E8D" />
				<rect x="88" y="48" width="8" height="12" fill="#F49E8D" />

				{/* NEW: Ear detail */}
				<rect x="34" y="50" width="4" height="8" fill="#E08E7D" />
				<rect x="90" y="50" width="4" height="8" fill="#E08E7D" />
			</g>

			{/* Body - Blue shirt (scaled 2x + enhanced) */}
			<g>
				{/* Neck */}
				<rect x="52" y="64" width="24" height="8" fill="#FDBCB4" />

				{/* Shirt - collar */}
				<rect x="48" y="72" width="32" height="8" fill="#4A90E2" />

				{/* NEW: Collar detail */}
				<rect x="52" y="74" width="24" height="4" fill="#5AA0F2" />

				{/* Shirt - body */}
				<rect x="40" y="80" width="48" height="24" fill="#4A90E2" />

				{/* Shirt - darker shading */}
				<rect x="40" y="88" width="8" height="16" fill="#357ABD" />
				<rect x="80" y="88" width="8" height="16" fill="#357ABD" />

				{/* Shirt - buttons (scaled 2x) */}
				<rect x="62" y="84" width="4" height="4" fill="#2E6BA8" />
				<rect x="62" y="92" width="4" height="4" fill="#2E6BA8" />

				{/* NEW: Button shine */}
				<rect x="63" y="85" width="2" height="2" fill="#3E7BB8" />
				<rect x="63" y="93" width="2" height="2" fill="#3E7BB8" />
			</g>

			{/* Arms - different positions based on throwing state (scaled 2x + enhanced) */}
			{isThrowing ? (
				// Throwing pose - right arm up
				<g>
					{/* Left arm - down */}
					<rect x="32" y="80" width="8" height="24" fill="#FDBCB4" />
					<rect x="32" y="104" width="8" height="8" fill="#F49E8D" />

					{/* NEW: Left arm shading */}
					<rect
						x="34"
						y="82"
						width="4"
						height="20"
						fill="#E8A99A"
						opacity="0.4"
					/>
					<rect x="34" y="106" width="4" height="4" fill="#E08E7D" />

					{/* Right arm - up (throwing) */}
					<rect x="88" y="48" width="8" height="16" fill="#FDBCB4" />
					<rect x="88" y="40" width="8" height="8" fill="#F49E8D" />
					<rect x="96" y="32" width="8" height="8" fill="#F49E8D" />

					{/* NEW: Right arm shading */}
					<rect
						x="90"
						y="50"
						width="4"
						height="12"
						fill="#E8A99A"
						opacity="0.4"
					/>
					<rect x="98" y="34" width="4" height="4" fill="#E08E7D" />

					{/* Camera in raised hand (scaled 2x + enhanced) */}
					<rect x="96" y="24" width="16" height="12" fill="#2C2C2C" />
					<rect x="104" y="28" width="4" height="4" fill="#FF4444" />

					{/* NEW: Camera details */}
					<rect x="98" y="26" width="4" height="4" fill="#3C3C3C" />
					<rect x="110" y="26" width="2" height="6" fill="#404040" />
					<rect
						x="105"
						y="29"
						width="2"
						height="2"
						fill="#FFFFFF"
						opacity="0.5"
					/>
				</g>
			) : (
				// Ready pose - camera at chest
				<g>
					{/* Left arm */}
					<rect x="32" y="80" width="8" height="16" fill="#FDBCB4" />
					<rect x="32" y="96" width="8" height="8" fill="#F49E8D" />

					{/* NEW: Left arm shading */}
					<rect
						x="34"
						y="82"
						width="4"
						height="12"
						fill="#E8A99A"
						opacity="0.4"
					/>

					{/* Right arm */}
					<rect x="88" y="80" width="8" height="16" fill="#FDBCB4" />
					<rect x="88" y="96" width="8" height="8" fill="#F49E8D" />

					{/* NEW: Right arm shading */}
					<rect
						x="90"
						y="82"
						width="4"
						height="12"
						fill="#E8A99A"
						opacity="0.4"
					/>

					{/* Camera at chest - black body (scaled 2x + enhanced) */}
					<rect x="52" y="88" width="24" height="16" fill="#2C2C2C" />
					<rect x="48" y="92" width="4" height="8" fill="#1A1A1A" />
					<rect x="76" y="92" width="4" height="8" fill="#1A1A1A" />

					{/* NEW: Camera body detail */}
					<rect x="54" y="90" width="20" height="2" fill="#3C3C3C" />

					{/* Camera - red lens (scaled 2x + enhanced) */}
					<rect x="60" y="92" width="8" height="8" fill="#FF4444" />
					<rect
						x="64"
						y="96"
						width="4"
						height="4"
						fill="#FFFFFF"
						opacity="0.6"
					/>

					{/* NEW: Lens ring */}
					<rect x="58" y="90" width="12" height="2" fill="#1A1A1A" />
					<rect x="62" y="94" width="4" height="2" fill="#FF6666" />

					{/* Camera - viewfinder (scaled 2x) */}
					<rect x="56" y="90" width="4" height="4" fill="#357ABD" />

					{/* NEW: Viewfinder detail */}
					<rect x="57" y="91" width="2" height="2" fill="#4A90E2" />
				</g>
			)}

			{/* Legs - Brown pants (scaled 2x + enhanced) */}
			<g>
				<rect x="44" y="104" width="16" height="16" fill="#8B6F47" />
				<rect x="68" y="104" width="16" height="16" fill="#8B6F47" />

				{/* Darker shading */}
				<rect x="44" y="112" width="4" height="8" fill="#6B5437" />
				<rect x="80" y="112" width="4" height="8" fill="#6B5437" />

				{/* NEW: Pants crease */}
				<rect
					x="50"
					y="106"
					width="2"
					height="14"
					fill="#7B5F37"
					opacity="0.5"
				/>
				<rect
					x="76"
					y="106"
					width="2"
					height="14"
					fill="#7B5F37"
					opacity="0.5"
				/>

				{/* Shoes - dark (scaled 2x + enhanced) */}
				<rect x="40" y="120" width="20" height="8" fill="#2C2C2C" />
				<rect x="68" y="120" width="20" height="8" fill="#2C2C2C" />

				{/* NEW: Shoe detail */}
				<rect
					x="44"
					y="122"
					width="4"
					height="4"
					fill="#3C3C3C"
					opacity="0.5"
				/>
				<rect
					x="72"
					y="122"
					width="4"
					height="4"
					fill="#3C3C3C"
					opacity="0.5"
				/>
			</g>
		</svg>
	);
}
