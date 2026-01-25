import { motion, useReducedMotion } from "framer-motion";
import { useState, useCallback } from "react";
import { EnvelopeTopHalf } from "./EnvelopeTopHalf";
import { EnvelopeBottomHalf } from "./EnvelopeBottomHalf";
import { EnvelopeLetter } from "./EnvelopeLetter";
import { WaxSeal } from "./WaxSeal";

interface EnvelopeSplitRevealProps {
	onOpen: () => void;
	className?: string;
}

type AnimationPhase =
	| "sealed"
	| "seal-breaking"
	| "splitting"
	| "letter-zoom"
	| "complete";

/**
 * Split Reveal Envelope Animation
 *
 * Animation sequence:
 * 1. User clicks/taps on envelope
 * 2. Wax seal breaks and disappears
 * 3. Top half moves up, bottom half moves down
 * 4. Letter zooms in and fades
 * 5. Chat content appears
 */
export function EnvelopeSplitReveal({
	onOpen,
	className = "",
}: EnvelopeSplitRevealProps) {
	const [phase, setPhase] = useState<AnimationPhase>("sealed");
	const shouldReduceMotion = useReducedMotion();

	const handleClick = useCallback(() => {
		if (phase !== "sealed") return;

		// Timing configuration (ms)
		// Top half: starts at split, duration 600ms
		// Bottom half: starts at split + 500ms delay, duration 600ms
		// Letter: starts after both halves finish
		const timing = shouldReduceMotion
			? { seal: 0, split: 100, letter: 300, complete: 500 }
			: { seal: 0, split: 400, letter: 1600, complete: 2500 };

		// Phase 1: Seal breaks
		setPhase("seal-breaking");

		// Phase 2: Halves split apart
		setTimeout(() => setPhase("splitting"), timing.split);

		// Phase 3: Letter zooms
		setTimeout(() => setPhase("letter-zoom"), timing.letter);

		// Phase 4: Complete - trigger callback
		setTimeout(() => {
			setPhase("complete");
			onOpen();
		}, timing.complete);
	}, [phase, onOpen, shouldReduceMotion]);

	// Determine animation states for each component
	const sealVisible = phase === "sealed";
	const sealBreaking = phase === "seal-breaking";
	const isSplitting = ["splitting", "letter-zoom", "complete"].includes(phase);
	const isLetterZooming = ["letter-zoom", "complete"].includes(phase);

	return (
		<motion.div
			className={`envelope-wrapper flex flex-col items-center justify-center min-h-screen p-4 ${className}`}
			initial={{ opacity: 1 }}
			animate={{ opacity: phase === "complete" ? 0 : 1 }}
			transition={{ duration: 0.4 }}
		>
			{/* Envelope container */}
			<motion.button
				className="relative cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:ring-offset-4 rounded-xl"
				onClick={handleClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleClick();
					}
				}}
				aria-label="Otvoriť svadobnú pozvánku"
				disabled={phase !== "sealed"}
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				whileTap={phase === "sealed" ? { scale: 0.98 } : undefined}
				transition={{
					type: "spring",
					stiffness: 200,
					damping: 20,
					delay: 0.2,
				}}
				style={{
					width: 320,
					height: 240,
				}}
			>
				{/* Envelope back (visible through gaps) */}
				<div
					className="absolute inset-0 rounded-xl"
					style={{
						background: "linear-gradient(180deg, #FECDD3 0%, #FDA4AF 100%)",
						boxShadow: "0 8px 32px rgba(190, 24, 93, 0.25)",
					}}
				/>

				{/* Letter - lowest z-index, behind envelope halves */}
				<EnvelopeLetter isAnimating={isLetterZooming} />

				{/* Bottom half - z-index 2 */}
				<EnvelopeBottomHalf isAnimating={isSplitting} />

				{/* Top half - z-index 3 */}
				<EnvelopeTopHalf isAnimating={isSplitting} />

				{/* Wax seal - centered on envelope (y=120, seal=88px, so top=76) */}
				{/* Using wrapper div for positioning since Framer Motion overrides transform */}
				<div
					className="absolute flex justify-center"
					style={{
						top: 76,
						left: 0,
						right: 0,
						zIndex: 10,
					}}
				>
					<motion.div
						animate={{
							opacity: sealVisible || sealBreaking ? 1 : 0,
							scale: sealBreaking ? [1, 1.15, 0.8] : 1,
							rotate: sealBreaking ? [0, 8, -5] : 0,
						}}
						transition={{
							duration: 0.4,
							ease: "easeOut",
						}}
					>
						<WaxSeal />
					</motion.div>
				</div>
			</motion.button>
		</motion.div>
	);
}
