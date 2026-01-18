interface GroomProps {
	className?: string;
	isCatching?: boolean; // true = catching phase (hands up), false = waiting
}

export function Groom({ className = "", isCatching = false }: GroomProps) {
	return (
		<svg
			viewBox="0 0 128 128"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			style={{ imageRendering: "pixelated" }}
			role="img"
			aria-label="Groom in suit"
		>
			{/* Head */}
			<g>
				{/* Hair - dark brown (scaled 2x + enhanced) */}
				<rect x="40" y="24" width="48" height="8" fill="#3A2818" />
				<rect x="32" y="32" width="64" height="8" fill="#3A2818" />
				<rect x="32" y="40" width="8" height="16" fill="#3A2818" />
				<rect x="88" y="40" width="8" height="16" fill="#3A2818" />

				{/* NEW: Hair texture */}
				<rect x="44" y="26" width="12" height="4" fill="#4A3828" />
				<rect x="68" y="28" width="16" height="4" fill="#2A1808" />
				<rect x="34" y="42" width="4" height="10" fill="#2A1808" />

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
				{isCatching && (
					<>
						{/* Happy eyes (^_^) when catching */}
						<rect x="48" y="44" width="8" height="4" fill="#2C2C2C" />
						<rect x="72" y="44" width="8" height="4" fill="#2C2C2C" />
					</>
				)}
				<rect x="52" y="48" width="4" height="4" fill="#FFFFFF" />
				<rect x="76" y="48" width="4" height="4" fill="#FFFFFF" />

				{/* NEW: Eyebrows */}
				<rect x="47" y="42" width="10" height="2" fill="#2A1808" />
				<rect x="71" y="42" width="10" height="2" fill="#2A1808" />

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

			{/* Neck - white collar (scaled 2x + enhanced) */}
			<g>
				<rect x="52" y="64" width="24" height="8" fill="#FDBCB4" />
				{/* Collar */}
				<rect x="48" y="72" width="12" height="8" fill="#FFFFFF" />
				<rect x="68" y="72" width="12" height="8" fill="#FFFFFF" />

				{/* NEW: Collar detail */}
				<rect x="50" y="74" width="8" height="4" fill="#F5F5F5" />
				<rect x="70" y="74" width="8" height="4" fill="#F5F5F5" />
			</g>

			{/* Tie - gold (scaled 2x + enhanced) */}
			<g>
				<rect x="60" y="72" width="8" height="4" fill="#B8860B" />
				<rect x="60" y="76" width="8" height="16" fill="#B8860B" />
				<rect x="56" y="92" width="4" height="4" fill="#9A7209" />
				<rect x="68" y="92" width="4" height="4" fill="#9A7209" />
				<rect x="60" y="96" width="8" height="4" fill="#9A7209" />

				{/* NEW: Tie texture */}
				<rect x="62" y="78" width="4" height="12" fill="#C8960B" />
				<rect x="61" y="73" width="2" height="2" fill="#D8A61B" />
			</g>

			{/* Suit jacket - black (scaled 2x + enhanced) */}
			<g>
				{/* Main body */}
				<rect x="40" y="80" width="48" height="24" fill="#1A1A1A" />

				{/* Lapels - darker */}
				<rect x="40" y="80" width="8" height="16" fill="#0D0D0D" />
				<rect x="80" y="80" width="8" height="16" fill="#0D0D0D" />

				{/* NEW: Lapel detail */}
				<rect x="42" y="82" width="4" height="12" fill="#1A1A1A" />
				<rect x="82" y="82" width="4" height="12" fill="#1A1A1A" />

				{/* Button (scaled 2x) */}
				<rect x="60" y="88" width="8" height="4" fill="#C0C0C0" />

				{/* NEW: Button shine */}
				<rect x="62" y="89" width="4" height="2" fill="#D0D0D0" />

				{/* NEW: Pocket detail */}
				<rect x="44" y="92" width="10" height="2" fill="#0D0D0D" />
				<rect x="74" y="92" width="10" height="2" fill="#0D0D0D" />
			</g>

			{/* Arms - different positions (scaled 2x + enhanced) */}
			{isCatching ? (
				// Catching pose - both arms up with bouquet
				<g>
					{/* Left arm up */}
					<rect x="32" y="64" width="8" height="16" fill="#FDBCB4" />
					<rect x="32" y="56" width="8" height="8" fill="#F49E8D" />
					<rect x="24" y="48" width="8" height="8" fill="#F49E8D" />

					{/* NEW: Arm shading */}
					<rect
						x="34"
						y="66"
						width="4"
						height="12"
						fill="#E8A99A"
						opacity="0.4"
					/>

					{/* Right arm up */}
					<rect x="88" y="64" width="8" height="16" fill="#FDBCB4" />
					<rect x="88" y="56" width="8" height="8" fill="#F49E8D" />
					<rect x="96" y="48" width="8" height="8" fill="#F49E8D" />

					{/* NEW: Arm shading */}
					<rect
						x="90"
						y="66"
						width="4"
						height="12"
						fill="#E8A99A"
						opacity="0.4"
					/>

					{/* Small bouquet/flowers between hands (scaled 2x + enhanced) */}
					<rect x="52" y="40" width="24" height="16" fill="#FF6B9D" />
					<rect x="56" y="36" width="4" height="4" fill="#FFB5D5" />
					<rect x="68" y="36" width="4" height="4" fill="#FFB5D5" />
					<rect x="60" y="44" width="8" height="4" fill="#90EE90" />

					{/* NEW: Flower details */}
					<rect x="54" y="42" width="6" height="6" fill="#FF8FAD" />
					<rect x="68" y="42" width="6" height="6" fill="#FF8FAD" />
					<rect x="62" y="48" width="4" height="4" fill="#7DD87D" />

					{/* Heart above head (joy) (scaled 2x + enhanced) */}
					<rect x="56" y="12" width="16" height="8" fill="#FF6B9D" />
					<rect x="52" y="16" width="4" height="4" fill="#FF6B9D" />
					<rect x="72" y="16" width="4" height="4" fill="#FF6B9D" />
					<rect x="60" y="20" width="8" height="8" fill="#FFB5D5" />

					{/* NEW: Heart highlight */}
					<rect x="58" y="14" width="4" height="4" fill="#FF8FAD" />
				</g>
			) : (
				// Waiting pose - arms at sides
				<g>
					{/* Left arm */}
					<rect x="32" y="80" width="8" height="16" fill="#1A1A1A" />
					<rect x="32" y="96" width="8" height="8" fill="#FDBCB4" />

					{/* NEW: Sleeve detail */}
					<rect
						x="34"
						y="82"
						width="4"
						height="12"
						fill="#0D0D0D"
						opacity="0.3"
					/>
					<rect x="34" y="98" width="4" height="4" fill="#E8A99A" />

					{/* Right arm */}
					<rect x="88" y="80" width="8" height="16" fill="#1A1A1A" />
					<rect x="88" y="96" width="8" height="8" fill="#FDBCB4" />

					{/* NEW: Sleeve detail */}
					<rect
						x="90"
						y="82"
						width="4"
						height="12"
						fill="#0D0D0D"
						opacity="0.3"
					/>
					<rect x="90" y="98" width="4" height="4" fill="#E8A99A" />
				</g>
			)}

			{/* Pants - black (scaled 2x + enhanced) */}
			<g>
				<rect x="44" y="104" width="16" height="16" fill="#1A1A1A" />
				<rect x="68" y="104" width="16" height="16" fill="#1A1A1A" />

				{/* NEW: Trouser crease */}
				<rect
					x="50"
					y="106"
					width="2"
					height="14"
					fill="#0D0D0D"
					opacity="0.4"
				/>
				<rect
					x="76"
					y="106"
					width="2"
					height="14"
					fill="#0D0D0D"
					opacity="0.4"
				/>

				{/* Shoes - shiny black (scaled 2x + enhanced) */}
				<rect x="40" y="120" width="20" height="8" fill="#0D0D0D" />
				<rect x="68" y="120" width="20" height="8" fill="#0D0D0D" />
				<rect
					x="44"
					y="120"
					width="4"
					height="4"
					fill="#404040"
					opacity="0.6"
				/>
				<rect
					x="72"
					y="120"
					width="4"
					height="4"
					fill="#404040"
					opacity="0.6"
				/>

				{/* NEW: Shoe shine */}
				<rect
					x="46"
					y="122"
					width="2"
					height="2"
					fill="#505050"
					opacity="0.5"
				/>
				<rect
					x="74"
					y="122"
					width="2"
					height="2"
					fill="#505050"
					opacity="0.5"
				/>
			</g>
		</svg>
	);
}
