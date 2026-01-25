import { motion } from "framer-motion";

interface WaxSealProps {
	className?: string;
	isBreaking?: boolean;
}

/**
 * High-detail pixel art wax seal with I&R monogram
 * 128x128 resolution for smoother appearance
 */
export function WaxSeal({ className = "", isBreaking = false }: WaxSealProps) {
	return (
		<motion.div
			className={`wax-seal ${className}`}
			animate={
				isBreaking
					? {
							scale: [1, 1.15, 0.8],
							rotate: [0, 8, -5],
							opacity: [1, 1, 0],
						}
					: {}
			}
			transition={{
				duration: 0.5,
				times: [0, 0.4, 1],
				ease: "easeOut",
			}}
		>
			<svg
				width="88"
				height="88"
				viewBox="0 0 128 128"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="pixel-art"
				role="img"
				aria-label="Vosková pečať so srdcom"
				style={{ filter: "drop-shadow(0 4px 8px rgba(127, 29, 29, 0.5))" }}
			>
				{/* === WAX SEAL - HIGH DETAIL 128x128 === */}
				{/*
					Color palette:
					#7F1D1D - darkest shadow
					#991B1B - dark
					#B91C1C - medium dark
					#DC2626 - base red
					#EF4444 - light red
					#F87171 - lighter
					#FCA5A5 - highlight
					#FECACA - bright highlight
					#FEE2E2 - brightest
				*/}

				{/* === OUTER ORGANIC WAX SHAPE === */}
				{/* Main circular base */}
				<ellipse cx="64" cy="64" rx="52" ry="50" fill="#DC2626" />

				{/* Organic wax drips for natural look */}
				<ellipse cx="28" cy="52" rx="8" ry="6" fill="#DC2626" />
				<ellipse cx="100" cy="58" rx="7" ry="5" fill="#DC2626" />
				<ellipse cx="48" cy="108" rx="10" ry="6" fill="#DC2626" />
				<ellipse cx="82" cy="106" rx="8" ry="5" fill="#DC2626" />
				<ellipse cx="22" cy="72" rx="6" ry="8" fill="#DC2626" />
				<ellipse cx="106" cy="76" rx="5" ry="7" fill="#DC2626" />

				{/* === DEPTH LAYERS (3D effect) === */}
				{/* Bottom shadow arc */}
				<path
					d="M24 80 Q64 120 104 80"
					stroke="#991B1B"
					strokeWidth="8"
					fill="none"
					strokeLinecap="round"
				/>
				<path
					d="M28 76 Q64 112 100 76"
					stroke="#B91C1C"
					strokeWidth="4"
					fill="none"
					strokeLinecap="round"
				/>

				{/* Right side shadow */}
				<path
					d="M96 32 Q112 64 96 96"
					stroke="#991B1B"
					strokeWidth="6"
					fill="none"
					strokeLinecap="round"
				/>

				{/* === TOP HIGHLIGHT (light source top-left) === */}
				<path
					d="M32 48 Q64 16 96 48"
					stroke="#EF4444"
					strokeWidth="8"
					fill="none"
					strokeLinecap="round"
				/>
				<path
					d="M36 44 Q64 20 92 44"
					stroke="#F87171"
					strokeWidth="4"
					fill="none"
					strokeLinecap="round"
				/>

				{/* Left highlight */}
				<path
					d="M32 36 Q20 64 32 92"
					stroke="#EF4444"
					strokeWidth="4"
					fill="none"
					strokeLinecap="round"
				/>

				{/* Bright spot top-left */}
				<ellipse cx="40" cy="36" rx="8" ry="6" fill="#FCA5A5" opacity="0.7" />
				<ellipse cx="38" cy="34" rx="4" ry="3" fill="#FECACA" opacity="0.8" />

				{/* === INNER STAMP RING === */}
				<circle
					cx="64"
					cy="64"
					r="36"
					fill="none"
					stroke="#B91C1C"
					strokeWidth="3"
				/>
				<circle cx="64" cy="64" r="33" fill="#A91B1B" opacity="0.3" />

				{/* Inner ring highlight (top) */}
				<path
					d="M36 52 Q64 36 92 52"
					stroke="#DC2626"
					strokeWidth="2"
					fill="none"
					strokeLinecap="round"
				/>

				{/* Inner ring shadow (bottom) */}
				<path
					d="M36 76 Q64 92 92 76"
					stroke="#7F1D1D"
					strokeWidth="2"
					fill="none"
					strokeLinecap="round"
					opacity="0.5"
				/>

				{/* === HEART IMPRINT === */}
				{/* Background circle for stamp */}
				<circle cx="64" cy="64" r="28" fill="#B91C1C" />

				{/* Heart shape - deep embossed look */}
				{/* Outer heart shadow (darkest) */}
				<path
					d="M64 84
					   C50 72, 36 60, 36 48
					   C36 38, 46 32, 56 32
					   C60 32, 62 34, 64 40
					   C66 34, 68 32, 72 32
					   C82 32, 92 38, 92 48
					   C92 60, 78 72, 64 84Z"
					fill="#1F1F1F"
					opacity="0.4"
				/>

				{/* Main heart fill (dark red/maroon) */}
				<path
					d="M64 80
					   C52 70, 40 60, 40 50
					   C40 42, 48 36, 56 36
					   C60 36, 62 38, 64 44
					   C66 38, 68 36, 72 36
					   C80 36, 88 42, 88 50
					   C88 60, 76 70, 64 80Z"
					fill="#450A0A"
				/>

				{/* Heart inner (slightly lighter for depth) */}
				<path
					d="M64 74
					   C54 66, 46 58, 46 52
					   C46 46, 52 42, 58 42
					   C61 42, 63 44, 64 48
					   C65 44, 67 42, 70 42
					   C76 42, 82 46, 82 52
					   C82 58, 74 66, 64 74Z"
					fill="#7F1D1D"
				/>

				{/* Heart highlight edge (left/top - light source) */}
				<path
					d="M56 40
					   C50 40, 44 46, 44 52
					   C44 56, 46 60, 50 64"
					stroke="#EF4444"
					strokeWidth="2.5"
					fill="none"
					strokeLinecap="round"
					opacity="0.7"
				/>

				{/* Heart top curves highlight */}
				<path
					d="M50 44 C54 40, 60 40, 64 46"
					stroke="#F87171"
					strokeWidth="2"
					fill="none"
					strokeLinecap="round"
					opacity="0.6"
				/>
				<path
					d="M64 46 C68 40, 74 40, 78 44"
					stroke="#DC2626"
					strokeWidth="1.5"
					fill="none"
					strokeLinecap="round"
					opacity="0.4"
				/>

				{/* Heart center shine */}
				<ellipse cx="58" cy="52" rx="4" ry="3" fill="#FCA5A5" opacity="0.3" />

				{/* Heart bottom shadow (right side) */}
				<path
					d="M64 74 C74 64, 82 56, 84 50"
					stroke="#0F0F0F"
					strokeWidth="2"
					fill="none"
					strokeLinecap="round"
					opacity="0.3"
				/>

				{/* === DECORATIVE ELEMENTS === */}
				{/* Dots around the monogram ring */}
				<circle cx="64" cy="32" r="2" fill="#FCA5A5" opacity="0.8" />
				<circle cx="64" cy="96" r="2" fill="#FCA5A5" opacity="0.8" />
				<circle cx="32" cy="64" r="2" fill="#FCA5A5" opacity="0.8" />
				<circle cx="96" cy="64" r="2" fill="#FCA5A5" opacity="0.8" />

				{/* Corner accents */}
				<circle cx="42" cy="42" r="1.5" fill="#F87171" opacity="0.6" />
				<circle cx="86" cy="42" r="1.5" fill="#F87171" opacity="0.6" />
				<circle cx="42" cy="86" r="1.5" fill="#F87171" opacity="0.6" />
				<circle cx="86" cy="86" r="1.5" fill="#F87171" opacity="0.6" />

				{/* === SHINE EFFECTS === */}
				{/* Main highlight spot */}
				<ellipse cx="36" cy="40" rx="6" ry="4" fill="#FFFFFF" opacity="0.4" />
				<ellipse cx="34" cy="38" rx="3" ry="2" fill="#FFFFFF" opacity="0.6" />

				{/* Secondary highlights */}
				<circle cx="48" cy="48" r="2" fill="#FFFFFF" opacity="0.25" />
				<circle cx="28" cy="56" r="1.5" fill="#FFFFFF" opacity="0.2" />

				{/* Rim light (right side subtle) */}
				<path
					d="M98 52 Q102 64 98 76"
					stroke="#F87171"
					strokeWidth="2"
					fill="none"
					strokeLinecap="round"
					opacity="0.3"
				/>

				{/* === TEXTURE DETAILS === */}
				{/* Subtle wax texture lines */}
				<path
					d="M30 64 Q34 62 38 64"
					stroke="#B91C1C"
					strokeWidth="1"
					fill="none"
					opacity="0.3"
				/>
				<path
					d="M90 60 Q94 58 98 60"
					stroke="#991B1B"
					strokeWidth="1"
					fill="none"
					opacity="0.3"
				/>
				<path
					d="M56 98 Q64 100 72 98"
					stroke="#991B1B"
					strokeWidth="1"
					fill="none"
					opacity="0.4"
				/>
			</svg>
		</motion.div>
	);
}
