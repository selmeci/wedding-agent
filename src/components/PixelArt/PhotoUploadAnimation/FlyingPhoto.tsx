interface FlyingPhotoProps {
	isFlying: boolean;
	onAnimationEnd?: () => void;
}

export function FlyingPhoto({ isFlying, onAnimationEnd }: FlyingPhotoProps) {
	if (!isFlying) return null;

	return (
		<div
			className="absolute top-1/2 left-0 -translate-y-1/2 animate-fly-photo pointer-events-none"
			style={{
				animationDuration: "0.6s",
				animationTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)",
				animationFillMode: "forwards",
			}}
			onAnimationEnd={onAnimationEnd}
		>
			<svg
				viewBox="0 0 128 128"
				className="w-8 h-8 md:w-10 md:h-10 animate-spin-slow"
				xmlns="http://www.w3.org/2000/svg"
				style={{ imageRendering: "pixelated" }}
				role="img"
				aria-label="Flying photo"
			>
				{/* Polaroid frame - white (scaled 4x + enhanced) */}
				<rect x="16" y="16" width="96" height="96" fill="#FFFFFF" />
				<rect
					x="8"
					y="8"
					width="112"
					height="112"
					fill="none"
					stroke="#E0E0E0"
					strokeWidth="2"
				/>

				{/* NEW: Frame depth */}
				<rect
					x="12"
					y="12"
					width="104"
					height="104"
					fill="none"
					stroke="#F0F0F0"
					strokeWidth="2"
				/>

				{/* Photo area - pink gradient (scaled 4x + enhanced) */}
				<rect x="24" y="24" width="80" height="64" fill="#FFB5D5" />
				<rect x="32" y="32" width="64" height="48" fill="#FF6B9D" />

				{/* NEW: Photo gradient layers */}
				<rect
					x="36"
					y="36"
					width="56"
					height="40"
					fill="#FF7DAD"
					opacity="0.5"
				/>

				{/* Simple image icon (scaled 4x + enhanced) */}
				<g opacity="0.8">
					{/* Mountain/landscape */}
					<polygon points="40,64 56,48 72,64" fill="#FFFFFF" />
					<polygon points="64,64 80,48 96,64" fill="#FFFFFF" opacity="0.8" />

					{/* NEW: Mountain shadows */}
					<polygon points="44,64 56,52 64,64" fill="#F0F0F0" opacity="0.5" />
					<polygon points="68,64 80,52 88,64" fill="#F0F0F0" opacity="0.4" />

					{/* Sun (scaled 4x) */}
					<circle cx="80" cy="40" r="8" fill="#FFFFFF" />

					{/* NEW: Sun glow */}
					<circle cx="80" cy="40" r="10" fill="#FFFFFF" opacity="0.3" />
					<rect x="76" y="36" width="4" height="4" fill="#FFF5E0" />
				</g>

				{/* White border at bottom (polaroid style) (scaled 4x) */}
				<rect x="24" y="88" width="80" height="24" fill="#FFFFFF" />

				{/* NEW: Polaroid text line */}
				<rect
					x="40"
					y="96"
					width="48"
					height="4"
					fill="#E8E8E8"
					opacity="0.5"
				/>
				<rect
					x="48"
					y="104"
					width="32"
					height="4"
					fill="#E8E8E8"
					opacity="0.3"
				/>

				{/* Shadow (scaled 4x) */}
				<rect
					x="16"
					y="112"
					width="96"
					height="8"
					fill="#000000"
					opacity="0.1"
				/>

				{/* NEW: Shadow gradient */}
				<rect
					x="20"
					y="114"
					width="88"
					height="4"
					fill="#000000"
					opacity="0.05"
				/>

				{/* Sparkle effect (scaled 4x + enhanced) */}
				<g opacity="0.9">
					<rect x="8" y="32" width="8" height="8" fill="#FFFFFF" />
					<rect x="112" y="48" width="8" height="8" fill="#FFFFFF" />
					<rect x="24" y="8" width="8" height="8" fill="#FFFFFF" />

					{/* NEW: Additional sparkles */}
					<rect x="104" y="24" width="4" height="4" fill="#FFFFFF" />
					<rect x="16" y="88" width="4" height="4" fill="#FFFFFF" />
					<rect x="96" y="96" width="4" height="4" fill="#FFFFFF" />
				</g>

				{/* NEW: Cross-shaped sparkles */}
				<g opacity="0.7">
					<rect
						x="10"
						y="34"
						width="4"
						height="12"
						fill="#FFFFFF"
						opacity="0.5"
					/>
					<rect
						x="6"
						y="38"
						width="12"
						height="4"
						fill="#FFFFFF"
						opacity="0.5"
					/>

					<rect
						x="114"
						y="50"
						width="4"
						height="12"
						fill="#FFFFFF"
						opacity="0.5"
					/>
					<rect
						x="110"
						y="54"
						width="12"
						height="4"
						fill="#FFFFFF"
						opacity="0.5"
					/>
				</g>

				{/* NEW: Floating hearts */}
				<g opacity="0.6">
					<rect x="4" y="60" width="6" height="6" fill="#FF6B9D" />
					<rect x="118" y="76" width="6" height="6" fill="#FFB5D5" />
					<rect x="60" y="4" width="4" height="4" fill="#FF8FAD" />
				</g>
			</svg>
		</div>
	);
}
