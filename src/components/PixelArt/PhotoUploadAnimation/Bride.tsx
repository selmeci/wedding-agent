interface BrideProps {
	className?: string;
	isCatching?: boolean; // true = catching phase (hands up), false = waiting
}

export function Bride({ className = "", isCatching = false }: BrideProps) {
	return (
		<svg
			viewBox="0 0 64 64"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			style={{ imageRendering: "pixelated" }}
			role="img"
			aria-label="Bride in wedding dress"
		>
			{/* Head */}
			<g>
				{/* Hair - brown */}
				<rect x="20" y="14" width="24" height="4" fill="#8B4513" />
				<rect x="16" y="18" width="32" height="4" fill="#8B4513" />
				<rect x="16" y="22" width="4" height="8" fill="#8B4513" />
				<rect x="44" y="22" width="4" height="8" fill="#8B4513" />

				{/* Veil - white transparent */}
				<rect
					x="16"
					y="12"
					width="32"
					height="2"
					fill="#FFFFFF"
					opacity="0.8"
				/>
				<rect
					x="14"
					y="14"
					width="36"
					height="2"
					fill="#FFFFFF"
					opacity="0.7"
				/>
				<rect
					x="12"
					y="16"
					width="40"
					height="2"
					fill="#FFFFFF"
					opacity="0.6"
				/>
				<rect
					x="12"
					y="18"
					width="4"
					height="12"
					fill="#FFFFFF"
					opacity="0.5"
				/>
				<rect
					x="48"
					y="18"
					width="4"
					height="12"
					fill="#FFFFFF"
					opacity="0.5"
				/>

				{/* Face - skin tone */}
				<rect x="20" y="18" width="24" height="4" fill="#FDBCB4" />
				<rect x="20" y="22" width="24" height="12" fill="#FDBCB4" />

				{/* Eyes */}
				<rect x="24" y="24" width="4" height="4" fill="#2C2C2C" />
				<rect x="36" y="24" width="4" height="4" fill="#2C2C2C" />
				{isCatching && (
					<>
						{/* Happy eyes (^_^) when catching */}
						<rect x="24" y="24" width="4" height="2" fill="#2C2C2C" />
						<rect x="36" y="24" width="4" height="2" fill="#2C2C2C" />
					</>
				)}
				<rect x="26" y="26" width="2" height="2" fill="#FFFFFF" />
				<rect x="38" y="26" width="2" height="2" fill="#FFFFFF" />

				{/* Blush */}
				<rect x="22" y="28" width="4" height="2" fill="#FFB5D5" opacity="0.6" />
				<rect x="38" y="28" width="4" height="2" fill="#FFB5D5" opacity="0.6" />

				{/* Smile */}
				<rect x="26" y="30" width="2" height="2" fill="#D17A6B" />
				<rect x="28" y="31" width="8" height="2" fill="#D17A6B" />
				<rect x="36" y="30" width="2" height="2" fill="#D17A6B" />

				{/* Ears */}
				<rect x="16" y="26" width="4" height="6" fill="#F49E8D" />
				<rect x="44" y="26" width="4" height="6" fill="#F49E8D" />

				{/* Earrings - pearl */}
				<rect x="17" y="30" width="2" height="2" fill="#FFFFFF" />
				<rect x="45" y="30" width="2" height="2" fill="#FFFFFF" />
			</g>

			{/* Neck and necklace */}
			<g>
				<rect x="26" y="34" width="12" height="4" fill="#FDBCB4" />
				{/* Pearl necklace */}
				<rect x="28" y="38" width="2" height="2" fill="#FFFFFF" />
				<rect x="31" y="38" width="2" height="2" fill="#FFFFFF" />
				<rect x="34" y="38" width="2" height="2" fill="#FFFFFF" />
			</g>

			{/* Wedding dress - white */}
			<g>
				{/* Bodice - fitted */}
				<rect x="22" y="40" width="20" height="8" fill="#FFFFFF" />
				<rect x="24" y="42" width="16" height="4" fill="#F5F5F5" />

				{/* Waist detail - lace */}
				<rect x="22" y="48" width="20" height="2" fill="#E8E8E8" />

				{/* Skirt - A-line shape */}
				<rect x="18" y="50" width="28" height="4" fill="#FFFFFF" />
				<rect x="16" y="54" width="32" height="4" fill="#F5F5F5" />
				<rect x="14" y="58" width="36" height="4" fill="#FFFFFF" />

				{/* Skirt shading */}
				<rect x="18" y="52" width="4" height="2" fill="#E8E8E8" />
				<rect x="42" y="52" width="4" height="2" fill="#E8E8E8" />
				<rect x="16" y="56" width="4" height="2" fill="#E8E8E8" />
				<rect x="44" y="56" width="4" height="2" fill="#E8E8E8" />

				{/* Lace details */}
				<rect x="20" y="50" width="2" height="2" fill="#E8E8E8" />
				<rect x="24" y="50" width="2" height="2" fill="#E8E8E8" />
				<rect x="28" y="50" width="2" height="2" fill="#E8E8E8" />
				<rect x="32" y="50" width="2" height="2" fill="#E8E8E8" />
				<rect x="36" y="50" width="2" height="2" fill="#E8E8E8" />
				<rect x="40" y="50" width="2" height="2" fill="#E8E8E8" />
			</g>

			{/* Arms - different positions */}
			{isCatching ? (
				// Catching pose - both arms up with bouquet
				<g>
					{/* Left arm up */}
					<rect x="16" y="34" width="6" height="8" fill="#FDBCB4" />
					<rect x="14" y="30" width="6" height="4" fill="#F49E8D" />
					<rect x="10" y="26" width="4" height="4" fill="#F49E8D" />

					{/* Right arm up */}
					<rect x="42" y="34" width="6" height="8" fill="#FDBCB4" />
					<rect x="44" y="30" width="6" height="4" fill="#F49E8D" />
					<rect x="50" y="26" width="4" height="4" fill="#F49E8D" />

					{/* Bouquet - pink roses */}
					<rect x="24" y="22" width="16" height="10" fill="#FF6B9D" />
					<rect x="26" y="20" width="3" height="3" fill="#FFB5D5" />
					<rect x="30" y="19" width="4" height="4" fill="#FFB5D5" />
					<rect x="35" y="20" width="3" height="3" fill="#FFB5D5" />
					<rect x="28" y="24" width="8" height="4" fill="#90EE90" />

					{/* Hearts above head (joy) */}
					<rect x="24" y="8" width="6" height="4" fill="#FF6B9D" />
					<rect x="34" y="8" width="6" height="4" fill="#FF6B9D" />
					<rect x="22" y="10" width="2" height="2" fill="#FFB5D5" />
					<rect x="40" y="10" width="2" height="2" fill="#FFB5D5" />
				</g>
			) : (
				// Waiting pose - hands clasped in front
				<g>
					{/* Left arm */}
					<rect x="18" y="42" width="4" height="6" fill="#FFFFFF" />
					<rect x="18" y="48" width="4" height="4" fill="#FDBCB4" />

					{/* Right arm */}
					<rect x="42" y="42" width="4" height="6" fill="#FFFFFF" />
					<rect x="42" y="48" width="4" height="4" fill="#FDBCB4" />

					{/* Small bouquet held in front */}
					<rect x="26" y="48" width="12" height="8" fill="#FF6B9D" />
					<rect x="28" y="46" width="2" height="2" fill="#FFB5D5" />
					<rect x="34" y="46" width="2" height="2" fill="#FFB5D5" />
					<rect x="29" y="50" width="6" height="2" fill="#90EE90" />
				</g>
			)}
		</svg>
	);
}
