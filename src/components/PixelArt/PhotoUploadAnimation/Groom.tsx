interface GroomProps {
	className?: string;
	isCatching?: boolean; // true = catching phase (hands up), false = waiting
}

export function Groom({ className = "", isCatching = false }: GroomProps) {
	return (
		<svg
			viewBox="0 0 64 64"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			style={{ imageRendering: "pixelated" }}
			role="img"
			aria-label="Groom in suit"
		>
			{/* Head */}
			<g>
				{/* Hair - dark brown */}
				<rect x="20" y="12" width="24" height="4" fill="#3A2818" />
				<rect x="16" y="16" width="32" height="4" fill="#3A2818" />
				<rect x="16" y="20" width="4" height="8" fill="#3A2818" />
				<rect x="44" y="20" width="4" height="8" fill="#3A2818" />

				{/* Face - skin tone */}
				<rect x="20" y="16" width="24" height="4" fill="#FDBCB4" />
				<rect x="20" y="20" width="24" height="12" fill="#FDBCB4" />

				{/* Eyes */}
				<rect x="24" y="22" width="4" height="4" fill="#2C2C2C" />
				<rect x="36" y="22" width="4" height="4" fill="#2C2C2C" />
				{isCatching && (
					<>
						{/* Happy eyes (^_^) when catching */}
						<rect x="24" y="22" width="4" height="2" fill="#2C2C2C" />
						<rect x="36" y="22" width="4" height="2" fill="#2C2C2C" />
					</>
				)}
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

			{/* Neck - white collar */}
			<g>
				<rect x="26" y="32" width="12" height="4" fill="#FDBCB4" />
				{/* Collar */}
				<rect x="24" y="36" width="6" height="4" fill="#FFFFFF" />
				<rect x="34" y="36" width="6" height="4" fill="#FFFFFF" />
			</g>

			{/* Tie - gold */}
			<g>
				<rect x="30" y="36" width="4" height="2" fill="#B8860B" />
				<rect x="30" y="38" width="4" height="8" fill="#B8860B" />
				<rect x="28" y="46" width="2" height="2" fill="#9A7209" />
				<rect x="34" y="46" width="2" height="2" fill="#9A7209" />
				<rect x="30" y="48" width="4" height="2" fill="#9A7209" />
			</g>

			{/* Suit jacket - black */}
			<g>
				{/* Main body */}
				<rect x="20" y="40" width="24" height="12" fill="#1A1A1A" />

				{/* Lapels - darker */}
				<rect x="20" y="40" width="4" height="8" fill="#0D0D0D" />
				<rect x="40" y="40" width="4" height="8" fill="#0D0D0D" />

				{/* Button */}
				<rect x="30" y="44" width="4" height="2" fill="#C0C0C0" />
			</g>

			{/* Arms - different positions */}
			{isCatching ? (
				// Catching pose - both arms up with bouquet
				<g>
					{/* Left arm up */}
					<rect x="16" y="32" width="4" height="8" fill="#FDBCB4" />
					<rect x="16" y="28" width="4" height="4" fill="#F49E8D" />
					<rect x="12" y="24" width="4" height="4" fill="#F49E8D" />

					{/* Right arm up */}
					<rect x="44" y="32" width="4" height="8" fill="#FDBCB4" />
					<rect x="44" y="28" width="4" height="4" fill="#F49E8D" />
					<rect x="48" y="24" width="4" height="4" fill="#F49E8D" />

					{/* Small bouquet/flowers between hands */}
					<rect x="26" y="20" width="12" height="8" fill="#FF6B9D" />
					<rect x="28" y="18" width="2" height="2" fill="#FFB5D5" />
					<rect x="34" y="18" width="2" height="2" fill="#FFB5D5" />
					<rect x="30" y="22" width="4" height="2" fill="#90EE90" />

					{/* Heart above head (joy) */}
					<rect x="28" y="6" width="8" height="4" fill="#FF6B9D" />
					<rect x="26" y="8" width="2" height="2" fill="#FF6B9D" />
					<rect x="36" y="8" width="2" height="2" fill="#FF6B9D" />
					<rect x="30" y="10" width="4" height="4" fill="#FFB5D5" />
				</g>
			) : (
				// Waiting pose - arms at sides
				<g>
					{/* Left arm */}
					<rect x="16" y="40" width="4" height="8" fill="#1A1A1A" />
					<rect x="16" y="48" width="4" height="4" fill="#FDBCB4" />

					{/* Right arm */}
					<rect x="44" y="40" width="4" height="8" fill="#1A1A1A" />
					<rect x="44" y="48" width="4" height="4" fill="#FDBCB4" />
				</g>
			)}

			{/* Pants - black */}
			<g>
				<rect x="22" y="52" width="8" height="8" fill="#1A1A1A" />
				<rect x="34" y="52" width="8" height="8" fill="#1A1A1A" />

				{/* Shoes - shiny black */}
				<rect x="20" y="60" width="10" height="4" fill="#0D0D0D" />
				<rect x="34" y="60" width="10" height="4" fill="#0D0D0D" />
				<rect x="22" y="60" width="2" height="2" fill="#404040" opacity="0.6" />
				<rect x="36" y="60" width="2" height="2" fill="#404040" opacity="0.6" />
			</g>
		</svg>
	);
}
