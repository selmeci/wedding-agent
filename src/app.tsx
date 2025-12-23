/** biome-ignore-all lint/correctness/useUniqueElementIds: it's alright */

import type { UIMessage } from "@ai-sdk/react";
// Icon imports
import { PaperPlaneTiltIcon, StopIcon, TrashIcon } from "@phosphor-icons/react";
import { useAgentChat } from "agents/ai-react";
import { useAgent } from "agents/react";
import { isStaticToolUIPart } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
// Component imports
import { Button } from "@/components/button/Button";
import { Header } from "@/components/Header";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import { Heart } from "@/components/PixelArt";
import { Textarea } from "@/components/textarea/Textarea";
import { ToolInvocationCard } from "@/components/tool-invocation-card/ToolInvocationCard";
import type { tools } from "./tools";

// List of tools that require human confirmation
// NOTE: this should match the tools that don't have execute functions in tools.ts
const toolsRequiringConfirmation: (keyof typeof tools)[] = [];

export default function Chat() {
	const [textareaHeight, setTextareaHeight] = useState("auto");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// Scroll to bottom on mount
	useEffect(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	// Extract qrToken from URL query parameters
	const qrToken =
		new URLSearchParams(window.location.search).get("qrToken") || "";

	const agent = useAgent({
		agent: "chat",
		name: qrToken,
	});

	const [agentInput, setAgentInput] = useState("");
	const handleAgentInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setAgentInput(e.target.value);
	};

	const handleAgentSubmit = async (
		e: React.FormEvent,
		extraData: Record<string, unknown> = {},
	) => {
		e.preventDefault();
		if (!agentInput.trim()) return;

		const message = agentInput;
		setAgentInput("");

		// Send message to agent
		await sendMessage(
			{
				parts: [{ text: message, type: "text" }],
				role: "user",
			},
			{
				body: extraData,
			},
		);
	};

	const {
		messages: agentMessages,
		addToolResult,
		clearHistory,
		status,
		sendMessage,
		stop,
	} = useAgentChat<unknown, UIMessage<{ createdAt: string }>>({
		agent,
	});

	// Scroll to bottom when messages change
	useEffect(() => {
		agentMessages.length > 0 && scrollToBottom();
	}, [agentMessages, scrollToBottom]);

	const pendingToolCallConfirmation = agentMessages.some((m: UIMessage) =>
		m.parts?.some(
			(part) =>
				isStaticToolUIPart(part) &&
				part.state === "input-available" &&
				// Manual check inside the component
				toolsRequiringConfirmation.includes(
					part.type.replace("tool-", "") as keyof typeof tools,
				),
		),
	);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-pink-100">
			<Header />
			<div className="container mx-auto px-4 py-6 max-w-4xl">
				<div className="bg-white rounded-xl shadow-xl overflow-hidden border border-pink-200">
					<div className="bg-gradient-pink p-4 border-b border-white/20 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Heart className="w-8 h-8" animated />
							<div>
								<h2 className="font-semibold text-base text-white">
									Svadobný asistent
								</h2>
								<p className="text-sm text-white/90">online</p>
							</div>
						</div>

						<Button
							variant="ghost"
							size="md"
							shape="square"
							className="rounded-full h-9 w-9 text-white hover:bg-white/20"
							onClick={clearHistory}
						>
							<TrashIcon size={20} />
						</Button>
					</div>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 min-h-[60vh] max-h-[70vh] bg-gray-50">
						{agentMessages.length === 0 && (
							<div className="h-full flex items-center justify-center">
								<div className="text-center text-gray-400 text-sm">
									<Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
									<p>Napíš správu a začni konverzáciu...</p>
								</div>
							</div>
						)}

						{agentMessages.map((m, index) => {
							const isUser = m.role === "user";
							const showAvatar =
								index === 0 || agentMessages[index - 1]?.role !== m.role;

							// Check if this is an empty assistant message during loading
							const isLoadingMessage =
								m.role === "assistant" &&
								(status === "streaming" || status === "submitted") &&
								(!m.parts || m.parts.length === 0 || !m.parts.some(p => p.type === "text" && p.text));

							// Render loading hearts for empty assistant messages during streaming
							if (isLoadingMessage) {
								return (
									<div key={m.id}>
										<div className="flex gap-3 mb-4 justify-start">
											<div className="flex-shrink-0">
												<div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center shadow-sm">
													<Heart className="w-6 h-6" />
												</div>
											</div>
											<div className="max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-3 shadow-sm bg-white border border-gray-100 rounded-bl-none">
												<div className="flex gap-2 items-center justify-center">
													<Heart className="w-4 h-4 heart-bounce-1" />
													<Heart className="w-4 h-4 heart-bounce-2" />
													<Heart className="w-4 h-4 heart-bounce-3" />
												</div>
											</div>
										</div>
									</div>
								);
							}

							return (
								<div key={m.id}>
									<div
										className={`flex gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}
									>
										{showAvatar && !isUser && (
											<div className="flex-shrink-0">
												<div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center shadow-sm">
													<Heart className="w-6 h-6" />
												</div>
											</div>
										)}
										{!showAvatar && !isUser && <div className="w-10" />}

										<div>
											<div>
												{m.parts?.map((part, i) => {
													if (part.type === "text") {
														return (
															// biome-ignore lint/suspicious/noArrayIndexKey: immutable index
															<div key={i}>
																<div
																	className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm ${
																		isUser
																			? "bg-pink-500 text-white rounded-br-none"
																			: "bg-white text-gray-900 border border-gray-100 rounded-bl-none"
																	}`}
																>
																	{part.text.startsWith(
																		"scheduled message",
																	) && (
																		<span className="absolute -top-3 -left-2 text-base">
																			🕒
																		</span>
																	)}
																	<MemoizedMarkdown
																		id={`${m.id}-${i}`}
																		content={part.text.replace(
																			/^scheduled message: /,
																			"",
																		)}
																	/>
																</div>
																<p
																	className={`text-xs mt-1.5 ${
																		isUser
																			? "text-pink-600 text-right"
																			: "text-gray-400 text-left"
																	}`}
																>
																	{formatTime(
																		m.metadata?.createdAt
																			? new Date(m.metadata.createdAt)
																			: new Date(),
																	)}
																</p>
															</div>
														);
													}

													if (
														isStaticToolUIPart(part) &&
														m.role === "assistant"
													) {
														const toolCallId = part.toolCallId;
														const toolName = part.type.replace("tool-", "");
														const needsConfirmation =
															toolsRequiringConfirmation.includes(
																toolName as keyof typeof tools,
															);

														return (
															<ToolInvocationCard
																// biome-ignore lint/suspicious/noArrayIndexKey: using index is safe here as the array is static
																key={`${toolCallId}-${i}`}
																toolUIPart={part}
																toolCallId={toolCallId}
																needsConfirmation={needsConfirmation}
																onSubmit={({ toolCallId, result }) => {
																	addToolResult({
																		output: result,
																		tool: part.type.replace("tool-", ""),
																		toolCallId,
																	});
																}}
																addToolResult={(toolCallId, result) => {
																	addToolResult({
																		output: result,
																		tool: part.type.replace("tool-", ""),
																		toolCallId,
																	});
																}}
															/>
														);
													}
													return null;
												})}
											</div>
										</div>
									</div>
								</div>
							);
						})}

						<div ref={messagesEndRef} />
					</div>

					{/* Input Area */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleAgentSubmit(e, {
								annotations: {
									hello: "world",
								},
							});
							setTextareaHeight("auto"); // Reset height after submission
						}}
						className="p-4 bg-white border-t border-gray-200"
					>
						<div className="flex items-center gap-2">
							<div className="flex-1 relative">
								<Textarea
									disabled={pendingToolCallConfirmation}
									placeholder={
										pendingToolCallConfirmation
											? "Prosím potvrď akciu vyššie..."
											: "Napíš správu..."
									}
									className="flex w-full border border-gray-300 px-3 py-2 ring-offset-background placeholder:text-gray-500 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl text-base! pb-10 bg-white"
									value={agentInput}
									onChange={(e) => {
										handleAgentInputChange(e);
										// Auto-resize the textarea
										e.target.style.height = "auto";
										e.target.style.height = `${e.target.scrollHeight}px`;
										setTextareaHeight(`${e.target.scrollHeight}px`);
									}}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" &&
											!e.shiftKey &&
											!e.nativeEvent.isComposing
										) {
											e.preventDefault();
											handleAgentSubmit(e as unknown as React.FormEvent);
											setTextareaHeight("auto"); // Reset height on Enter submission
										}
									}}
									rows={2}
									style={{ height: textareaHeight }}
								/>
								<div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
									{status === "submitted" || status === "streaming" ? (
										<button
											type="button"
											onClick={stop}
											className="inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-pink-500 text-white hover:bg-pink-600 rounded-full p-1.5 h-fit border border-pink-400"
											aria-label="Zastaviť generovanie"
										>
											<StopIcon size={16} />
										</button>
									) : (
										<button
											type="submit"
											className="inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-pink-500 text-white hover:bg-pink-600 rounded-full p-1.5 h-fit border border-pink-400"
											disabled={
												pendingToolCallConfirmation || !agentInput.trim()
											}
											aria-label="Odoslať správu"
										>
											<PaperPlaneTiltIcon size={16} />
										</button>
									)}
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
