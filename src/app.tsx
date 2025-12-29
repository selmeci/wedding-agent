/** biome-ignore-all lint/correctness/useUniqueElementIds: it's alright */

import type { UIMessage } from "@ai-sdk/react";
// Icon imports
import { PaperPlaneTiltIcon, StopIcon, TrashIcon } from "@phosphor-icons/react";
import { useAgentChat } from "agents/ai-react";
import { useAgent } from "agents/react";
import { isStaticToolUIPart } from "ai";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
// Component imports
import { Button } from "@/components/button/Button";
import { Countdown } from "@/components/Countdown/Countdown";
import { Header } from "@/components/Header";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import { GiftBox, Heart, LoveStoryTimeline } from "@/components/PixelArt";
import { Textarea } from "@/components/textarea/Textarea";
import { ToolInvocationCard } from "@/components/tool-invocation-card/ToolInvocationCard";
import type { WeddingAgentState } from "./agents/wedding-assistent/types";
import type { tools } from "./tools";

// List of tools that require human confirmation
// NOTE: this should match the tools that don't have execute functions in tools.ts
const toolsRequiringConfirmation: (keyof typeof tools)[] = [];

export default function Chat() {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const prevMessagesLengthRef = useRef<number>(0);
	const isInitialLoadRef = useRef<boolean>(true);

	const scrollToBottom = useCallback((instant = false) => {
		// Method 1: scrollIntoView (preferred)
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({
				behavior: instant ? "auto" : "smooth",
				block: "end",
			});
		}

		// Method 2: Direct scroll (fallback)
		if (messagesContainerRef.current) {
			const container = messagesContainerRef.current;
			if (instant) {
				container.scrollTop = container.scrollHeight;
			} else {
				container.scrollTo({
					behavior: "smooth",
					top: container.scrollHeight,
				});
			}
		}
	}, []);

	// Extract qrToken and debug flag from URL query parameters
	const searchParams = new URLSearchParams(window.location.search);
	const qrToken = searchParams.get("qrToken") || "";
	const isDebugMode = searchParams.get("debug") === "true";

	// State for tracking agent conversation state
	const [agentState, setAgentState] = useState<WeddingAgentState | null>(null);
	// State for tracking if timeline was just unlocked (for animation)
	const [timelineJustUnlocked, setTimelineJustUnlocked] = useState(false);
	const timelineRef = useRef<HTMLDivElement>(null);
	// Track previous conversation state to detect transition
	const prevConversationStateRef = useRef<string | null>(null);

	const agent = useAgent({
		agent: "chat",
		name: qrToken,
		onStateUpdate: (newState: WeddingAgentState) => {
			setAgentState(newState);
		},
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
		addToolOutput,
		clearHistory,
		status,
		sendMessage,
		stop,
	} = useAgentChat<WeddingAgentState, UIMessage<{ createdAt: string }>>({
		agent,
	});

	// Effect 1: Initial load scroll
	useLayoutEffect(() => {
		if (agentMessages.length === 0) return;

		if (isInitialLoadRef.current) {
			isInitialLoadRef.current = false;
			prevMessagesLengthRef.current = agentMessages.length;

			// Delay to ensure DOM is rendered
			setTimeout(() => {
				scrollToBottom(true); // instant scroll
			}, 50);
			return;
		}
	}, [agentMessages, scrollToBottom]);

	// Effect 2: Scroll during streaming (CRITICAL for seeing AI responses)
	// biome-ignore lint/correctness/useExhaustiveDependencies: Need for response scrolling
	useLayoutEffect(() => {
		if (status === "streaming") {
			// Use requestAnimationFrame for smooth performance
			requestAnimationFrame(() => {
				scrollToBottom(true); // instant scroll during streaming
			});
		}
	}, [agentMessages, status, scrollToBottom]);

	// Effect 3: Scroll on new message (not during streaming)
	useLayoutEffect(() => {
		const hasNewMessage = agentMessages.length > prevMessagesLengthRef.current;
		const isNotStreaming = status !== "streaming";

		if (hasNewMessage && isNotStreaming) {
			setTimeout(() => {
				scrollToBottom(false); // smooth scroll for new messages
			}, 50);
		}

		prevMessagesLengthRef.current = agentMessages.length;
	}, [agentMessages, status, scrollToBottom]);

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

	// Detect when timeline gets unlocked (only on state TRANSITION)
	useEffect(() => {
		const currentState = agentState?.conversationState;
		const prevState = prevConversationStateRef.current;

		// Check if we just transitioned INTO completed or information_provision
		const justUnlocked =
			currentState === "completed" &&
			prevState !== "completed" &&
			prevState !== "information_provision" &&
			prevState !== null; // Ignore initial load

		if (justUnlocked) {
			// Timeline just got unlocked
			setTimelineJustUnlocked(true);

			// Scroll to timeline after a short delay
			setTimeout(() => {
				timelineRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 200);

			// Remove animation class after animation completes
			setTimeout(() => {
				setTimelineJustUnlocked(false);
			}, 1000);
		}

		// Update previous state reference
		prevConversationStateRef.current = currentState || null;
	}, [agentState?.conversationState]);

	return (
		<div className="flex flex-col h-screen w-full bg-gradient-to-br from-pink-50 via-white to-pink-100">
			<Header />
			<Countdown targetDate="2026-03-27T14:30:00Z" />
			{agentState?.conversationState === "completed" && (
				<div ref={timelineRef}>
					<LoveStoryTimeline
						className={timelineJustUnlocked ? "love-story-unlock" : ""}
					/>
				</div>
			)}

			<main className="flex-1 flex flex-col overflow-hidden py-2 md:py-4">
				<div className="container mx-auto px-2 md:px-4 max-w-4xl flex-1 flex flex-col min-h-0">
					{/* Chat Interface */}
					<div className="flex flex-col flex-1 min-h-0 max-h-full bg-white rounded-xl shadow-xl overflow-hidden border border-pink-200">
						<div className="bg-gradient-pink p-3 md:p-4 border-b border-white/20 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Heart className="w-8 h-8" animated />
								<div>
									<h2 className="font-semibold text-base text-white">
										Svadobný asistent
									</h2>
									<p className="text-sm text-white/90">online</p>
								</div>
							</div>

							{isDebugMode && (
								<Button
									variant="ghost"
									size="md"
									shape="square"
									className="rounded-full h-9 w-9 text-white hover:bg-white/20"
									onClick={clearHistory}
								>
									<TrashIcon size={20} />
								</Button>
							)}
						</div>

						{/* Messages */}
						<div
							ref={messagesContainerRef}
							className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-4 pb-4 bg-gray-50"
						>
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
									(!m.parts ||
										m.parts.length === 0 ||
										!m.parts.some((p) => p.type === "text" && p.text));

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
												<div className="rounded-2xl px-4 py-3 shadow-sm bg-white border border-gray-100 rounded-bl-none">
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

											<div
												className={`flex flex-col ${isUser ? "max-w-[75%] md:max-w-[70%]" : "max-w-[75%] md:max-w-[70%]"}`}
											>
												{m.parts?.map((part, i) => {
													if (part.type === "text") {
														return (
															// biome-ignore lint/suspicious/noArrayIndexKey: immutable index
															<div key={i}>
																<div
																	className={`rounded-2xl px-4 py-2.5 shadow-sm ${
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
														m.role === "assistant" &&
														isDebugMode
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
																	addToolOutput({
																		output: result,
																		toolCallId,
																		toolName: part.type.replace("tool-", ""),
																	});
																}}
																addToolResult={(toolCallId, result) => {
																	addToolOutput({
																		output: result,
																		toolCallId,
																		toolName: part.type.replace("tool-", ""),
																	});
																}}
															/>
														);
													}
													return null;
												})}
											</div>

											{showAvatar && isUser && (
												<div className="flex-shrink-0">
													<div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shadow-sm">
														<GiftBox className="w-6 h-6" />
													</div>
												</div>
											)}
											{!showAvatar && isUser && <div className="w-10" />}
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
							}}
							className="flex-shrink-0 p-3 md:p-4 bg-white border-t border-gray-200"
						>
							<div className="flex items-center gap-2">
								<div className="flex-1 relative">
									<Textarea
										rows={1}
										disabled={pendingToolCallConfirmation}
										placeholder={
											pendingToolCallConfirmation
												? "Prosím potvrď akciu vyššie..."
												: "Napíš správu..."
										}
										className="flex w-full border border-gray-300 px-3 py-2 placeholder:text-gray-500 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-2xl text-base bg-white h-[44px]! min-h-[44px]! max-h-[44px]! pr-12"
										value={agentInput}
										onChange={handleAgentInputChange}
										onKeyDown={(e) => {
											if (e.key === "Enter" && !e.nativeEvent.isComposing) {
												e.preventDefault();
												handleAgentSubmit(e as unknown as React.FormEvent);
											}
										}}
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
			</main>
		</div>
	);
}
