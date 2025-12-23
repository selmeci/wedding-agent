import { Heart } from "../PixelArt";

export interface ChatMessageProps {
	role: "user" | "assistant" | "system";
	content: string;
	timestamp?: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
	// System messages (cookie notice, etc.)
	if (role === "system") {
		return (
			<div className="flex justify-center mb-6">
				<div className="max-w-[85%] md:max-w-[70%] rounded-xl px-5 py-4 bg-pink-50 border border-pink-200 shadow-sm">
					<p className="text-sm md:text-base text-gray-700 text-center whitespace-pre-wrap break-words leading-relaxed">
						{content}
					</p>
				</div>
			</div>
		);
	}

	const isAssistant = role === "assistant";

	return (
		<div
			className={`flex gap-3 mb-4 ${isAssistant ? "justify-start" : "justify-end"}`}
		>
			{isAssistant && (
				<div className="flex-shrink-0">
					<div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center shadow-sm">
						<Heart className="w-6 h-6" />
					</div>
				</div>
			)}

			<div
				className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm ${
					isAssistant
						? "bg-white text-gray-900 border border-gray-100"
						: "bg-pink-500 text-white"
				}`}
			>
				<p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
					{content}
				</p>
				{timestamp && (
					<p
						className={`text-xs mt-1.5 ${isAssistant ? "text-gray-400" : "text-pink-100"}`}
					>
						{timestamp.toLocaleTimeString("sk-SK", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				)}
			</div>

			{!isAssistant && (
				<div className="flex-shrink-0">
					<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shadow-sm">
						<span className="text-lg">👤</span>
					</div>
				</div>
			)}
		</div>
	);
}
