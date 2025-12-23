import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";

interface Message {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
	timestamp: Date;
}

export interface ChatMessageListProps {
	messages: Message[];
	isLoading?: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isLoading]);

	return (
		<div className="flex-1 overflow-y-auto bg-gray-50">
			<div className="p-4">
				{messages.length === 0 ? (
					<div className="flex items-center justify-center min-h-[200px] text-gray-400 text-sm">
						<p>Napíš správu a začni konverzáciu...</p>
					</div>
				) : (
					<div className="space-y-4">
						{messages.map((msg) => (
							<ChatMessage
								key={msg.id}
								role={msg.role}
								content={msg.content}
								timestamp={msg.timestamp}
							/>
						))}
						{isLoading && (
							<div className="flex gap-3 mb-4 justify-start">
								<div className="flex-shrink-0">
									<div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center shadow-sm animate-pulse" />
								</div>
								<div className="max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm bg-white text-gray-900 border border-gray-100">
									<div className="flex gap-1">
										<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
										<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
										<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
									</div>
								</div>
							</div>
						)}
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>
		</div>
	);
}
