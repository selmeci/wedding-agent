import { motion } from "framer-motion";

interface EnvelopeBottomHalfProps {
	isAnimating: boolean;
	className?: string;
}

/**
 * Bottom half of the envelope with V-notch at top
 * Flips forward around bottom edge when opening
 */
export function EnvelopeBottomHalf({
	isAnimating,
	className = "",
}: EnvelopeBottomHalfProps) {
	return (
		<motion.div
			className={`absolute bottom-0 left-0 right-0 ${className}`}
			style={{
				height: 140,
				// V-notch at top: pointed top center, flat bottom
				clipPath: "polygon(0 35%, 50% 0, 100% 35%, 100% 100%, 0 100%)",
				background:
					"linear-gradient(180deg, #FB7185 0%, #F43F5E 50%, #E11D48 100%)",
				zIndex: 2,
				transformOrigin: "bottom center",
				transformStyle: "preserve-3d",
			}}
			animate={
				isAnimating
					? {
							rotateX: 180,
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
				delay: 0.5,
			}}
		>
			{/* Bottom edge highlight */}
			<div
				className="absolute bottom-0 left-0 right-0 h-3 rounded-b-xl"
				style={{ background: "#BE123C" }}
			/>
			{/* Surface shine */}
			<div
				className="absolute left-8 right-1/2 h-1 rounded-full"
				style={{ top: "50%", background: "rgba(255,255,255,0.12)" }}
			/>
		</motion.div>
	);
}
