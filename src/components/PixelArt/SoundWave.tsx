export function SoundWave({
	className = "",
	active = false,
}: {
	className?: string;
	active?: boolean;
}) {
	const barColor = active ? "#FF3D6F" : "#FFB3C7";

	return (
		<div className={`flex items-center justify-center gap-1 ${className}`}>
			{[0, 1, 2, 3, 4].map((index) => (
				<div
					key={index}
					className={`w-1 rounded-full bg-pink-500 ${active ? "animate-soundwave" : ""}`}
					style={{
						backgroundColor: barColor,
						height: active ? undefined : "8px",
						animationDelay: active ? `${index * 0.1}s` : undefined,
					}}
				/>
			))}
			<style>
				{`
					@keyframes soundwave {
						0%, 100% {
							height: 8px;
						}
						50% {
							height: 24px;
						}
					}
					.animate-soundwave {
						animation: soundwave 0.5s ease-in-out infinite;
					}
				`}
			</style>
		</div>
	);
}
