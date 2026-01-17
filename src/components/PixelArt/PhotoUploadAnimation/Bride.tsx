interface BrideProps {
	className?: string;
	isCatching?: boolean; // true = catching phase (hands up), false = waiting
}

export function Bride({ className = "", isCatching = false }: BrideProps) {
	return (
		<svg
			viewBox="0 0 128 128"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			style={{ imageRendering: "pixelated" }}
			role="img"
			aria-label="Bride in wedding dress"
		>
			{/* Head */}
			<g>
				{/* Hair - brown (scaled 2x + enhanced) */}
				<rect x="40" y="28" width="48" height="8" fill="#8B4513" />
				<rect x="32" y="36" width="64" height="8" fill="#8B4513" />
				<rect x="32" y="44" width="8" height="16" fill="#8B4513" />
				<rect x="88" y="44" width="8" height="16" fill="#8B4513" />

				{/* NEW: Hair texture */}
				<rect x="44" y="30" width="12" height="4" fill="#A0522D" />
				<rect x="72" y="32" width="12" height="4" fill="#6B3A10" />
				<rect x="34" y="46" width="4" height="8" fill="#6B3A10" />

				{/* Veil - white transparent (scaled 2x + enhanced) */}
				<rect
					x="32"
					y="24"
					width="64"
					height="4"
					fill="#FFFFFF"
					opacity="0.8"
				/>
				<rect
					x="28"
					y="28"
					width="72"
					height="4"
					fill="#FFFFFF"
					opacity="0.7"
				/>
				<rect
					x="24"
					y="32"
					width="80"
					height="4"
					fill="#FFFFFF"
					opacity="0.6"
				/>
				<rect
					x="24"
					y="36"
					width="8"
					height="24"
					fill="#FFFFFF"
					opacity="0.5"
				/>
				<rect
					x="96"
					y="36"
					width="8"
					height="24"
					fill="#FFFFFF"
					opacity="0.5"
				/>

				{/* NEW: Veil sparkles */}
				<rect x="36" y="26" width="2" height="2" fill="#FFFFFF" />
				<rect x="90" y="30" width="2" height="2" fill="#FFFFFF" />
				<rect x="60" y="24" width="2" height="2" fill="#FFFFFF" />

				{/* Face - skin tone (scaled 2x) */}
				<rect x="40" y="36" width="48" height="8" fill="#FDBCB4" />
				<rect x="40" y="44" width="48" height="24" fill="#FDBCB4" />

				{/* NEW: Face shading */}
				<rect x="40" y="44" width="4" height="20" fill="#E8A99A" opacity="0.4" />
				<rect x="84" y="44" width="4" height="20" fill="#E8A99A" opacity="0.4" />

				{/* Eyes (scaled 2x + enhanced) */}
				<rect x="48" y="48" width="8" height="8" fill="#2C2C2C" />
				<rect x="72" y="48" width="8" height="8" fill="#2C2C2C" />
				{isCatching && (
					<>
						{/* Happy eyes (^_^) when catching */}
						<rect x="48" y="48" width="8" height="4" fill="#2C2C2C" />
						<rect x="72" y="48" width="8" height="4" fill="#2C2C2C" />
					</>
				)}
				<rect x="52" y="52" width="4" height="4" fill="#FFFFFF" />
				<rect x="76" y="52" width="4" height="4" fill="#FFFFFF" />

				{/* NEW: Eyelashes */}
				<rect x="47" y="46" width="2" height="2" fill="#2C2C2C" />
				<rect x="57" y="46" width="2" height="2" fill="#2C2C2C" />
				<rect x="71" y="46" width="2" height="2" fill="#2C2C2C" />
				<rect x="81" y="46" width="2" height="2" fill="#2C2C2C" />

				{/* Blush (scaled 2x) */}
				<rect x="44" y="56" width="8" height="4" fill="#FFB5D5" opacity="0.6" />
				<rect x="76" y="56" width="8" height="4" fill="#FFB5D5" opacity="0.6" />

				{/* Smile (scaled 2x + enhanced) */}
				<rect x="52" y="60" width="4" height="4" fill="#D17A6B" />
				<rect x="56" y="62" width="16" height="4" fill="#D17A6B" />
				<rect x="72" y="60" width="4" height="4" fill="#D17A6B" />

				{/* NEW: Smile detail */}
				<rect x="60" y="64" width="8" height="2" fill="#C06A5B" />

				{/* Ears (scaled 2x) */}
				<rect x="32" y="52" width="8" height="12" fill="#F49E8D" />
				<rect x="88" y="52" width="8" height="12" fill="#F49E8D" />

				{/* NEW: Ear detail */}
				<rect x="34" y="54" width="4" height="8" fill="#E08E7D" />
				<rect x="90" y="54" width="4" height="8" fill="#E08E7D" />

				{/* Earrings - pearl (scaled 2x + enhanced) */}
				<rect x="34" y="60" width="4" height="4" fill="#FFFFFF" />
				<rect x="90" y="60" width="4" height="4" fill="#FFFFFF" />

				{/* NEW: Earring shine */}
				<rect x="35" y="61" width="2" height="2" fill="#F0F0F0" />
				<rect x="91" y="61" width="2" height="2" fill="#F0F0F0" />
			</g>

			{/* Neck and necklace (scaled 2x + enhanced) */}
			<g>
				<rect x="52" y="68" width="24" height="8" fill="#FDBCB4" />
				{/* Pearl necklace */}
				<rect x="56" y="76" width="4" height="4" fill="#FFFFFF" />
				<rect x="62" y="76" width="4" height="4" fill="#FFFFFF" />
				<rect x="68" y="76" width="4" height="4" fill="#FFFFFF" />

				{/* NEW: Necklace shine */}
				<rect x="57" y="77" width="2" height="2" fill="#F5F5F5" />
				<rect x="63" y="77" width="2" height="2" fill="#F5F5F5" />
				<rect x="69" y="77" width="2" height="2" fill="#F5F5F5" />
			</g>

			{/* Wedding dress - white (scaled 2x + enhanced) */}
			<g>
				{/* Bodice - fitted */}
				<rect x="44" y="80" width="40" height="16" fill="#FFFFFF" />
				<rect x="48" y="84" width="32" height="8" fill="#F5F5F5" />

				{/* NEW: Bodice detail */}
				<rect x="52" y="86" width="24" height="4" fill="#FAFAFA" />
				<rect x="60" y="82" width="8" height="2" fill="#E8E8E8" />

				{/* Waist detail - lace (scaled 2x) */}
				<rect x="44" y="96" width="40" height="4" fill="#E8E8E8" />

				{/* NEW: Lace pattern */}
				<rect x="48" y="97" width="4" height="2" fill="#F0F0F0" />
				<rect x="56" y="97" width="4" height="2" fill="#F0F0F0" />
				<rect x="64" y="97" width="4" height="2" fill="#F0F0F0" />
				<rect x="72" y="97" width="4" height="2" fill="#F0F0F0" />

				{/* Skirt - A-line shape (scaled 2x) */}
				<rect x="36" y="100" width="56" height="8" fill="#FFFFFF" />
				<rect x="32" y="108" width="64" height="8" fill="#F5F5F5" />
				<rect x="28" y="116" width="72" height="8" fill="#FFFFFF" />

				{/* Skirt shading (scaled 2x) */}
				<rect x="36" y="104" width="8" height="4" fill="#E8E8E8" />
				<rect x="84" y="104" width="8" height="4" fill="#E8E8E8" />
				<rect x="32" y="112" width="8" height="4" fill="#E8E8E8" />
				<rect x="88" y="112" width="8" height="4" fill="#E8E8E8" />

				{/* Lace details (scaled 2x) */}
				<rect x="40" y="100" width="4" height="4" fill="#E8E8E8" />
				<rect x="48" y="100" width="4" height="4" fill="#E8E8E8" />
				<rect x="56" y="100" width="4" height="4" fill="#E8E8E8" />
				<rect x="64" y="100" width="4" height="4" fill="#E8E8E8" />
				<rect x="72" y="100" width="4" height="4" fill="#E8E8E8" />
				<rect x="80" y="100" width="4" height="4" fill="#E8E8E8" />

				{/* NEW: Bottom lace hem */}
				<rect x="30" y="122" width="68" height="2" fill="#E0E0E0" />
			</g>

			{/* Arms - different positions (scaled 2x + enhanced) */}
			{isCatching ? (
				// Catching pose - both arms up with bouquet
				<g>
					{/* Left arm up */}
					<rect x="32" y="68" width="12" height="16" fill="#FDBCB4" />
					<rect x="28" y="60" width="12" height="8" fill="#F49E8D" />
					<rect x="20" y="52" width="8" height="8" fill="#F49E8D" />

					{/* NEW: Arm shading */}
					<rect x="34" y="70" width="4" height="12" fill="#E8A99A" opacity="0.4" />

					{/* Right arm up */}
					<rect x="84" y="68" width="12" height="16" fill="#FDBCB4" />
					<rect x="88" y="60" width="12" height="8" fill="#F49E8D" />
					<rect x="100" y="52" width="8" height="8" fill="#F49E8D" />

					{/* NEW: Arm shading */}
					<rect x="90" y="70" width="4" height="12" fill="#E8A99A" opacity="0.4" />

					{/* Bouquet - pink roses (scaled 2x + enhanced) */}
					<rect x="48" y="44" width="32" height="20" fill="#FF6B9D" />
					<rect x="52" y="40" width="6" height="6" fill="#FFB5D5" />
					<rect x="60" y="38" width="8" height="8" fill="#FFB5D5" />
					<rect x="70" y="40" width="6" height="6" fill="#FFB5D5" />
					<rect x="56" y="48" width="16" height="8" fill="#90EE90" />

					{/* NEW: Bouquet details */}
					<rect x="54" y="42" width="4" height="4" fill="#FF8FAD" />
					<rect x="70" y="42" width="4" height="4" fill="#FF8FAD" />
					<rect x="62" y="40" width="4" height="4" fill="#FFC0D5" />
					<rect x="58" y="52" width="4" height="4" fill="#7DD87D" />
					<rect x="66" y="52" width="4" height="4" fill="#7DD87D" />

					{/* Hearts above head (joy) (scaled 2x + enhanced) */}
					<rect x="48" y="16" width="12" height="8" fill="#FF6B9D" />
					<rect x="68" y="16" width="12" height="8" fill="#FF6B9D" />
					<rect x="44" y="20" width="4" height="4" fill="#FFB5D5" />
					<rect x="80" y="20" width="4" height="4" fill="#FFB5D5" />

					{/* NEW: Heart highlights */}
					<rect x="50" y="18" width="2" height="2" fill="#FF8FAD" />
					<rect x="70" y="18" width="2" height="2" fill="#FF8FAD" />
				</g>
			) : (
				// Waiting pose - hands clasped in front
				<g>
					{/* Left arm */}
					<rect x="36" y="84" width="8" height="12" fill="#FFFFFF" />
					<rect x="36" y="96" width="8" height="8" fill="#FDBCB4" />

					{/* NEW: Arm sleeve detail */}
					<rect x="38" y="86" width="4" height="8" fill="#F5F5F5" />

					{/* Right arm */}
					<rect x="84" y="84" width="8" height="12" fill="#FFFFFF" />
					<rect x="84" y="96" width="8" height="8" fill="#FDBCB4" />

					{/* NEW: Arm sleeve detail */}
					<rect x="86" y="86" width="4" height="8" fill="#F5F5F5" />

					{/* Small bouquet held in front (scaled 2x + enhanced) */}
					<rect x="52" y="96" width="24" height="16" fill="#FF6B9D" />
					<rect x="56" y="92" width="4" height="4" fill="#FFB5D5" />
					<rect x="68" y="92" width="4" height="4" fill="#FFB5D5" />
					<rect x="58" y="100" width="12" height="4" fill="#90EE90" />

					{/* NEW: Bouquet details */}
					<rect x="54" y="98" width="6" height="6" fill="#FF8FAD" />
					<rect x="68" y="98" width="6" height="6" fill="#FF8FAD" />
					<rect x="60" y="96" width="8" height="4" fill="#FFC0D5" />
					<rect x="62" y="104" width="4" height="4" fill="#7DD87D" />
				</g>
			)}
		</svg>
	);
}
