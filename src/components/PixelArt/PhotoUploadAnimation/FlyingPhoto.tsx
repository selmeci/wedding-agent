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
				viewBox="0 0 32 32"
				className="w-8 h-8 md:w-10 md:h-10 animate-spin-slow"
				xmlns="http://www.w3.org/2000/svg"
				style={{ imageRendering: "pixelated" }}
				role="img"
				aria-label="Flying photo"
			>
				{/* Polaroid frame - white */}
				<rect x="4" y="4" width="24" height="24" fill="#FFFFFF" />
				<rect
					x="2"
					y="2"
					width="28"
					height="28"
					fill="none"
					stroke="#E0E0E0"
					strokeWidth="1"
				/>

				{/* Photo area - pink gradient */}
				<rect x="6" y="6" width="20" height="16" fill="#FFB5D5" />
				<rect x="8" y="8" width="16" height="12" fill="#FF6B9D" />

				{/* Simple image icon */}
				<g opacity="0.8">
					{/* Mountain/landscape */}
					<polygon points="10,16 14,12 18,16" fill="#FFFFFF" />
					<polygon points="16,16 20,12 24,16" fill="#FFFFFF" opacity="0.8" />

					{/* Sun */}
					<circle cx="20" cy="10" r="2" fill="#FFFFFF" />
				</g>

				{/* White border at bottom (polaroid style) */}
				<rect x="6" y="22" width="20" height="6" fill="#FFFFFF" />

				{/* Shadow */}
				<rect x="4" y="28" width="24" height="2" fill="#000000" opacity="0.1" />

				{/* Sparkle effect */}
				<g opacity="0.9">
					<rect x="2" y="8" width="2" height="2" fill="#FFFFFF" />
					<rect x="28" y="12" width="2" height="2" fill="#FFFFFF" />
					<rect x="6" y="2" width="2" height="2" fill="#FFFFFF" />
				</g>
			</svg>
		</div>
	);
}
