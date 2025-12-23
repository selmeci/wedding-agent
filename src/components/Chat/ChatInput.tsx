import { AlertCircle, Send } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui";

export interface ChatInputProps {
	onSend: (message: string) => void;
	disabled?: boolean;
	placeholder?: string;
	identificationFailed?: boolean;
}

export function ChatInput({
	onSend,
	disabled = false,
	placeholder = "Napíš správu...",
	identificationFailed = false,
}: ChatInputProps) {
	const [message, setMessage] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const prevDisabledRef = useRef(disabled);

	// Refocus input after AI response arrives (when disabled changes from true to false)
	useEffect(() => {
		if (prevDisabledRef.current === true && disabled === false) {
			inputRef.current?.focus();
		}
		prevDisabledRef.current = disabled;
	}, [disabled]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		const trimmed = message.trim();
		if (trimmed && !disabled) {
			onSend(trimmed);
			setMessage("");
		}
	};

	// Show blocking message if identification failed
	if (identificationFailed) {
		return (
			<div className="p-4 bg-pink-50 border-t border-pink-200">
				<div className="flex items-start gap-3 max-w-2xl mx-auto">
					<AlertCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
					<div className="flex-1 text-sm text-gray-700">
						<p className="font-medium text-pink-800 mb-1">
							Prístup k chatu je obmedzený
						</p>
						<p className="text-gray-600">
							Táto stránka je určená len pre pozvaných hostí. Ak si si istý, že
							by si mal mať prístup, kontaktuj prosím priamo{" "}
							<span className="font-medium">Ivonku alebo Romana</span>.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 p-4">
			<input
				ref={inputRef}
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder={placeholder}
				disabled={disabled}
				className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
			/>
			<Button
				type="submit"
				disabled={disabled || !message.trim()}
				variant="primary"
				size="md"
				className="px-4"
			>
				<Send className="w-5 h-5" />
				<span className="sr-only">Odoslať</span>
			</Button>
		</form>
	);
}
