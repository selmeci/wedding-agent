import type { ReactNode } from "react";

export interface ChatContainerProps {
	children: ReactNode;
	className?: string;
}

export function ChatContainer({
	children,
	className = "",
}: ChatContainerProps) {
	return (
		<div
			className={`bg-white rounded-xl shadow-xl overflow-hidden ${className}`}
		>
			{/* Header */}
			<div className="bg-gradient-pink p-4 border-b border-white/20">
				<h3 className="text-lg font-bold text-white">Svadobný asistent</h3>
				<p className="text-sm text-white/90">online</p>
			</div>

			{/* Content area */}
			<div className="flex flex-col h-[70vh] max-h-[700px] min-h-[500px]">
				{children}
			</div>
		</div>
	);
}
