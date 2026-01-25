import { motion } from "framer-motion";

interface EnvelopeTopHalfProps {
	isAnimating: boolean;
	className?: string;
}

/**
 * Top half of the envelope with pointed bottom edge
 * Flips backwards around top edge when opening
 */
export function EnvelopeTopHalf({
	isAnimating,
	className = "",
}: EnvelopeTopHalfProps) {
	return (
		<motion.div
			className={`absolute top-0 left-0 right-0 ${className}`}
			style={{
				height: 140,
				// Triangle pointing down: flat top, pointed bottom center
				clipPath: "polygon(0 0, 100% 0, 100% 65%, 50% 100%, 0 65%)",
				background: "linear-gradient(180deg, #FDA4AF 0%, #FB7185 100%)",
				zIndex: 3,
				transformOrigin: "top center",
				transformStyle: "preserve-3d",
			}}
			animate={
				isAnimating
					? {
							rotateX: -180,
							opacity: 0,
						}
					: {
							rotateX: 0,
							opacity: 1,
						}
			}
			transition={{
				duration: 0.6,
				ease: "easeOut",
			}}
		>
			{/* Top edge highlight */}
			<div
				className="absolute top-0 left-0 right-0 h-3 rounded-t-xl"
				style={{ background: "rgba(255,255,255,0.25)" }}
			/>
			{/* Subtle diagonal shading */}
			<div
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.06) 100%)",
					clipPath: "polygon(0 0, 100% 0, 100% 65%, 50% 100%, 0 65%)",
				}}
			/>
		</motion.div>
	);
}
