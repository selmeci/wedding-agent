import { useEffect, useState } from "react";
import { Bride } from "./Bride";
import { FlyingPhoto } from "./FlyingPhoto";
import { Groom } from "./Groom";
import { Guest } from "./Guest";

interface PhotoUploadAnimationProps {
	currentUpload: number; // 1-based (1 = first photo being uploaded)
	totalUploads: number;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function PhotoUploadAnimation({
	currentUpload,
	totalUploads,
}: PhotoUploadAnimationProps) {
	const [isThrowing, setIsThrowing] = useState(false);
	const [isPhotoFlying, setIsPhotoFlying] = useState(false);
	const [isCatching, setIsCatching] = useState(false);
	const [catcherType, setCatcherType] = useState<"groom" | "bride">("groom");
	const [animationCycle, setAnimationCycle] = useState(0);

	// Continuous animation loop
	useEffect(() => {
		let isMounted = true;

		// Animation sequence that runs continuously
		const runAnimationCycle = async () => {
			if (!isMounted) return;

			// Determine who catches (alternate between groom and bride)
			const catcher = animationCycle % 2 === 0 ? "groom" : "bride";
			setCatcherType(catcher);

			// Phase 1: Guest throws (0.0s - 0.1s)
			setIsThrowing(true);
			await wait(100);

			if (!isMounted) return;

			// Phase 2: Photo starts flying (0.1s)
			setIsPhotoFlying(true);
			await wait(500);

			if (!isMounted) return;

			// Phase 3: Catcher catches (0.5s)
			setIsCatching(true);
			await wait(100);

			if (!isMounted) return;

			// Phase 4: Photo disappears (0.6s)
			setIsPhotoFlying(false);
			await wait(200);

			if (!isMounted) return;

			// Phase 5: Reset for next cycle (0.8s)
			setIsThrowing(false);
			setIsCatching(false);

			// Increment cycle and trigger next animation
			setAnimationCycle((prev) => prev + 1);
		};

		runAnimationCycle();

		return () => {
			isMounted = false;
		};
	}, [animationCycle]);

	return (
		<div className="w-full max-w-2xl mx-auto py-6">
			{/* Animation Scene */}
			<div className="relative h-32 md:h-40 flex items-center justify-between px-4 md:px-8">
				{/* Guest (left side) */}
				<div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
					<Guest className="w-full h-full" isThrowing={isThrowing} />
				</div>

				{/* Flying Photo (center) */}
				<div className="absolute left-16 md:left-20 right-16 md:right-20 top-1/2 -translate-y-1/2 pointer-events-none">
					<FlyingPhoto
						isFlying={isPhotoFlying}
						onAnimationEnd={() => setIsPhotoFlying(false)}
					/>
				</div>

				{/* Groom or Bride (right side) */}
				<div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
					{catcherType === "groom" ? (
						<Groom className="w-full h-full" isCatching={isCatching} />
					) : (
						<Bride className="w-full h-full" isCatching={isCatching} />
					)}
				</div>
			</div>

			{/* Progress Text */}
			<div className="text-center mt-4">
				<p className="text-lg md:text-xl font-medium text-pink-600">
					Nahrávam fotky... {currentUpload}/{totalUploads}
				</p>
				<div className="mt-2 w-full max-w-md mx-auto bg-pink-100 rounded-full h-3 overflow-hidden">
					<div
						className="bg-pink-500 h-full rounded-full transition-all duration-300"
						style={{
							width: `${(currentUpload / totalUploads) * 100}%`,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
