/** biome-ignore-all lint/correctness/useUniqueElementIds: it's alright */

import type { UIMessage } from "@ai-sdk/react";
// Icon imports
import { PaperPlaneTiltIcon, StopIcon, TrashIcon } from "@phosphor-icons/react";
import { CaretDownIcon } from "@radix-ui/react-icons";
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
import { AudioRecorder } from "@/components/AudioRecorder";
import { PhotoUpload } from "@/components/PhotoUpload";
import {
	GiftBox,
	Heart,
	LoveStoryTimeline,
	Proposal,
} from "@/components/PixelArt";
import { RsvpSummary } from "@/components/RsvpSummary";
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
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// State for mobile focus mode (hide header/countdown when typing)
	const [isMobileFocus, setIsMobileFocus] = useState(false);

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

	// Extract parameters from URL query
	const searchParams = new URLSearchParams(window.location.search);
	const qrToken = searchParams.get("qrToken") || "";
	const isDebugMode = searchParams.get("debug") === "true";
	const mode = searchParams.get("mode") || "chat"; // "chat" or "report"
	const adminSecret = searchParams.get("adminSecret");

	// Admin mode state - allows accessing all tabs without completing RSVP
	const [isAdminMode, setIsAdminMode] = useState(false);

	// Couple mode state - allows snúbenci to send messages that appear distinctly
	const coupleSecret = searchParams.get("coupleSecret");
	const [isCoupleMode, setIsCoupleMode] = useState(false);

	// Check if wedding has already happened
	const weddingDate = new Date("2026-03-27T14:30:00Z");
	const isAfterWedding = new Date() > weddingDate;

	// State for tab switcher (chat vs timeline vs summary vs photos vs audio)
	// Default to photos tab after wedding, chat before
	const [activeTab, setActiveTab] = useState<
		"chat" | "timeline" | "summary" | "photos" | "audio"
	>(isAfterWedding ? "photos" : "chat");
	const [isTimelineTabNew, setIsTimelineTabNew] = useState(false);

	// State for tracking agent conversation state
	const [agentState, setAgentState] = useState<WeddingAgentState | null>(null);
	// State for tracking if timeline was just unlocked (for animation)
	const [timelineJustUnlocked, setTimelineJustUnlocked] = useState(false);
	// Track previous conversation state to detect transition
	const prevConversationStateRef = useRef<string | null>(null);

	const agent = useAgent({
		agent: mode === "report" ? "report" : "chat",
		name: qrToken,
		onStateUpdate: (newState: WeddingAgentState) => {
			setAgentState(newState);
		},
	});

	// Validate admin secret on mount
	useEffect(() => {
		if (adminSecret) {
			fetch(`/api/admin/verify?adminSecret=${encodeURIComponent(adminSecret)}`)
				.then((res) => res.json() as Promise<{ valid: boolean }>)
				.then((data) => {
					if (data.valid) {
						setIsAdminMode(true);
					}
				})
				.catch(() => setIsAdminMode(false));
		}
	}, [adminSecret]);

	// Validate couple secret on mount
	useEffect(() => {
		if (coupleSecret) {
			fetch(
				`/api/couple/verify?coupleSecret=${encodeURIComponent(coupleSecret)}`,
			)
				.then((res) => res.json() as Promise<{ valid: boolean }>)
				.then((data) => {
					if (data.valid) {
						setIsCoupleMode(true);
					}
				})
				.catch(() => setIsCoupleMode(false));
		}
	}, [coupleSecret]);

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

		// Prepend couple marker if in couple mode (AI will skip response)
		const message = isCoupleMode ? `[COUPLE]${agentInput}` : agentInput;
		setAgentInput("");

		// Keep focus mode active and refocus textarea for continuous messaging
		setTimeout(() => {
			textareaRef.current?.focus();
		}, 0);

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

	// Effect 4: Scroll on focus mode change (layout reflow)
	// biome-ignore lint/correctness/useExhaustiveDependencies: isMobileFocus intentionally triggers scroll
	useEffect(() => {
		// Scroll when focus mode changes (both activation and deactivation)
		// Wait for layout reflow after visibility changes
		const timeoutId = setTimeout(() => {
			scrollToBottom(true);
		}, 150);

		return () => clearTimeout(timeoutId);
	}, [isMobileFocus, scrollToBottom]);

	// Effect 5: Scroll when switching back to chat tab AND deactivate focus mode on other tabs
	useEffect(() => {
		if (activeTab === "chat") {
			// Wait for DOM to render chat messages
			const timeoutId = setTimeout(() => {
				scrollToBottom(true);
			}, 100);

			return () => clearTimeout(timeoutId);
		} else {
			// Deactivate focus mode when viewing other tabs (header is auto-hidden)
			setIsMobileFocus(false);
		}
	}, [activeTab, scrollToBottom]);

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

	// Helper functions for couple messages
	const isCoupleMessage = (message: UIMessage) => {
		const textPart = message.parts?.find((p) => p.type === "text");
		return (
			textPart &&
			"text" in textPart &&
			typeof textPart.text === "string" &&
			textPart.text.startsWith("[COUPLE]")
		);
	};

	const stripCouplePrefix = (text: string) => text.replace(/^\[COUPLE\]/, "");

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
			setIsTimelineTabNew(true); // Set badge for new tab

			// Remove pulse animation after animation completes
			setTimeout(() => {
				setTimelineJustUnlocked(false);
			}, 3000); // Extended duration for better visibility
		}

		// Update previous state reference
		prevConversationStateRef.current = currentState || null;
	}, [agentState?.conversationState]);

	return (
		<div className="flex flex-col h-screen w-full bg-gradient-to-br from-pink-50 via-white to-pink-100">
			{/* Header and Countdown - different in report mode */}
			{mode === "report" ? (
				<div className="bg-gradient-pink p-4 text-center">
					<h1 className="text-2xl font-bold text-white">
						📊 RSVP Report Dashboard
					</h1>
					<p className="text-white/80 text-sm mt-1">
						Reporting asistent pre svadobné RSVP
					</p>
				</div>
			) : (
				<div
					className={`transition-opacity duration-300 ease-in-out ${isMobileFocus || activeTab !== "chat" ? "hidden md:block" : "block"}`}
				>
					<Header />
					<Countdown targetDate="2026-03-27T14:30:00Z" />
				</div>
			)}

			<main className="flex-1 flex flex-col overflow-hidden py-2 md:py-4">
				<div className="container mx-auto px-2 md:px-4 max-w-4xl flex-1 flex flex-col min-h-0">
					{/* Chat Interface */}
					<div className="flex flex-col flex-1 min-h-0 max-h-full bg-white rounded-xl shadow-xl overflow-hidden border border-pink-200">
						<div className="bg-gradient-pink p-3 md:p-4 border-b border-white/20 flex items-center justify-between">
							<div className="flex items-center gap-3">
								{/* Minimize button - visible when header is hidden (focus mode or other tabs) - NOT in report mode */}
								{mode !== "report" &&
									(isMobileFocus || activeTab !== "chat") && (
										<button
											onClick={() => {
												if (activeTab === "chat") {
													setIsMobileFocus(false);
												} else {
													setActiveTab("chat");
												}
											}}
											className="md:hidden mr-1 text-white bg-white/10 hover:bg-white/25 rounded-full p-2.5 transition-all shadow-lg ring-2 ring-white/30"
											type="button"
											aria-label={
												activeTab === "chat"
													? "Zobraziť hlavičku"
													: "Späť na chat"
											}
										>
											<CaretDownIcon className="w-6 h-6 drop-shadow-md" />
										</button>
									)}
								<Heart className="w-8 h-8" animated />

								{/* Tab Switcher - ONLY in chat mode, NOT in report mode */}
								{mode !== "report" && (
									<div className="flex gap-1 bg-white/10 rounded-full p-1">
										{/* Photos Tab - FIRST after wedding if completed */}
										{isAfterWedding &&
											(isAdminMode ||
												agentState?.conversationState === "completed") && (
												<button
													onClick={() => setActiveTab("photos")}
													type="button"
													className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] rounded-full text-sm font-medium transition-all ${
														activeTab === "photos"
															? "bg-white text-pink-600 shadow-md"
															: "text-white hover:bg-white/10"
													}`}
												>
													<span className="hidden sm:inline">Fotky</span>
													<span className="sm:hidden">📸</span>
												</button>
											)}

										{/* Chat Tab */}
										<button
											onClick={() => setActiveTab("chat")}
											type="button"
											className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] rounded-full text-sm font-medium transition-all ${
												activeTab === "chat"
													? "bg-white text-pink-600 shadow-md"
													: "text-white hover:bg-white/10"
											}`}
										>
											<span className="hidden sm:inline">
												Svadobný asistent
											</span>
											<span className="sm:hidden">💬</span>
										</button>

										{/* Timeline Tab - only if completed */}
										{(isAdminMode ||
											agentState?.conversationState === "completed") && (
											<button
												onClick={() => {
													setActiveTab("timeline");
													setIsTimelineTabNew(false);
												}}
												type="button"
												className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] rounded-full text-sm font-medium transition-all relative ${
													activeTab === "timeline"
														? "bg-white text-pink-600 shadow-md"
														: "text-white hover:bg-white/10"
												} ${
													timelineJustUnlocked
														? "animate-pulse ring-2 ring-yellow-400 ring-offset-2 ring-offset-pink-500 shadow-lg shadow-yellow-400/50"
														: ""
												}`}
											>
												<span className="hidden sm:inline">
													Náš príbeh lásky
												</span>
												<span className="sm:hidden">💕</span>
												{/* Enhanced new badge with larger ping effect */}
												{isTimelineTabNew && (
													<>
														<span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
														<span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
													</>
												)}
											</button>
										)}

										{/* Summary Tab - only if completed */}
										{(isAdminMode ||
											agentState?.conversationState === "completed") && (
											<button
												onClick={() => setActiveTab("summary")}
												type="button"
												className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] rounded-full text-sm font-medium transition-all ${
													activeTab === "summary"
														? "bg-white text-pink-600 shadow-md"
														: "text-white hover:bg-white/10"
												}`}
											>
												<span className="hidden sm:inline">Prehľad</span>
												<span className="sm:hidden">📋</span>
											</button>
										)}

										{/* Audio Tab - only if completed */}
										{(isAdminMode ||
											agentState?.conversationState === "completed") && (
											<button
												onClick={() => setActiveTab("audio")}
												type="button"
												className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] rounded-full text-sm font-medium transition-all ${
													activeTab === "audio"
														? "bg-white text-pink-600 shadow-md"
														: "text-white hover:bg-white/10"
												}`}
											>
												<span className="hidden sm:inline">Audio</span>
												<span className="sm:hidden">🎤</span>
											</button>
										)}

										{/* Photos Tab - last position before wedding if completed */}
										{!isAfterWedding &&
											(isAdminMode ||
												agentState?.conversationState === "completed") && (
												<button
													onClick={() => setActiveTab("photos")}
													type="button"
													className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] rounded-full text-sm font-medium transition-all ${
														activeTab === "photos"
															? "bg-white text-pink-600 shadow-md"
															: "text-white hover:bg-white/10"
													}`}
												>
													<span className="hidden sm:inline">Fotky</span>
													<span className="sm:hidden">📸</span>
												</button>
											)}
									</div>
								)}
							</div>

							{isDebugMode && (
								<Button
									variant="ghost"
									size="md"
									shape="square"
									className="rounded-full h-9 w-9 text-white hover:bg-white/20"
									onClick={clearHistory}
									aria-label="Vymazať históriu chatu"
								>
									<TrashIcon size={20} />
								</Button>
							)}
						</div>

						{/* Conditional content based on active tab (report mode always shows chat) */}
						{mode === "report" || activeTab === "chat" ? (
							<>
								{/* Couple mode banner */}
								{isCoupleMode && (
									<div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 px-4 text-sm font-medium shadow-inner">
										Posielate správy ako Ivonka a Roman
									</div>
								)}

								{/* Messages */}
								{/* biome-ignore lint/a11y/noStaticElementInteractions: Background click to deactivate focus mode is intentional UX pattern */}
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard users can use Escape or tab navigation, click is for mouse/touch only */}
								<div
									ref={messagesContainerRef}
									className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-4 pb-4 bg-gray-50"
									onClick={() => {
										// Deactivate focus mode when clicking anywhere in messages area
										// User can still scroll to read without deactivating
										if (isMobileFocus) {
											setIsMobileFocus(false);
										}
									}}
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
										const isCouple = isCoupleMessage(m);
										// Show avatar if first message, different role, or different type (couple vs regular)
										const showAvatar =
											index === 0 ||
											agentMessages[index - 1]?.role !== m.role ||
											isCoupleMessage(agentMessages[index - 1]) !== isCouple;

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
													className={`flex gap-3 mb-4 ${
														isCouple
															? "justify-start"
															: isUser
																? "justify-end"
																: "justify-start"
													}`}
												>
													{/* Couple Avatar */}
													{showAvatar && isCouple && (
														<div className="flex-shrink-0">
															<div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md ring-2 ring-purple-300 overflow-hidden">
																<Proposal className="w-8 h-8" />
															</div>
														</div>
													)}
													{!showAvatar && isCouple && <div className="w-10" />}

													{/* Assistant Avatar */}
													{showAvatar && !isUser && !isCouple && (
														<div className="flex-shrink-0">
															<div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center shadow-sm">
																<Heart className="w-6 h-6" />
															</div>
														</div>
													)}
													{!showAvatar && !isUser && !isCouple && (
														<div className="w-10" />
													)}

													<div
														className={`flex flex-col ${isUser ? "max-w-[75%] md:max-w-[70%]" : "max-w-[75%] md:max-w-[70%]"}`}
													>
														{m.parts?.map((part, i) => {
															if (part.type === "text") {
																// Strip couple prefix for display
																const displayText = isCouple
																	? stripCouplePrefix(part.text)
																	: part.text;

																return (
																	// biome-ignore lint/suspicious/noArrayIndexKey: immutable index
																	<div key={i}>
																		<div
																			className={`rounded-2xl px-4 py-2.5 shadow-sm ${
																				isCouple
																					? "bg-gradient-to-br from-purple-100 to-pink-100 text-purple-900 border-2 border-purple-200 rounded-bl-none"
																					: isUser
																						? "bg-pink-500 text-white rounded-br-none"
																						: "bg-white text-gray-900 border border-gray-100 rounded-bl-none"
																			}`}
																		>
																			{/* Couple message label */}
																			{isCouple && (
																				<p className="text-xs font-semibold text-purple-600 mb-1">
																					Od Ivonky a Romana
																				</p>
																			)}
																			{displayText.startsWith(
																				"scheduled message",
																			) && (
																				<span className="absolute -top-3 -left-2 text-base">
																					🕒
																				</span>
																			)}
																			<MemoizedMarkdown
																				id={`${m.id}-${i}`}
																				content={displayText.replace(
																					/^scheduled message: /,
																					"",
																				)}
																			/>
																		</div>
																		<p
																			className={`text-xs mt-1.5 ${
																				isCouple
																					? "text-purple-500 text-left"
																					: isUser
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
																				toolName: part.type.replace(
																					"tool-",
																					"",
																				),
																			});
																		}}
																		addToolResult={(toolCallId, result) => {
																			addToolOutput({
																				output: result,
																				toolCallId,
																				toolName: part.type.replace(
																					"tool-",
																					"",
																				),
																			});
																		}}
																	/>
																);
															}
															return null;
														})}
													</div>

													{/* User Avatar - only for regular user messages, not couple */}
													{showAvatar && isUser && !isCouple && (
														<div className="flex-shrink-0">
															<div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shadow-sm">
																<GiftBox className="w-6 h-6" />
															</div>
														</div>
													)}
													{!showAvatar && isUser && !isCouple && (
														<div className="w-10" />
													)}
												</div>
											</div>
										);
									})}

									<div ref={messagesEndRef} />
								</div>

								{/* Input Area */}
								{/** biome-ignore lint/a11y/useKeyWithClickEvents: This is not interactive */}
								<form
									onSubmit={(e) => {
										e.preventDefault();
										void handleAgentSubmit(e, {
											annotations: {
												hello: "world",
											},
										});
									}}
									onClick={(e) => {
										// Prevent click propagation to messages container
										// This keeps focus mode active when clicking in input area
										e.stopPropagation();
									}}
									className="flex-shrink-0 p-3 md:p-4 bg-white border-t border-gray-200"
								>
									<div className="flex items-center gap-2">
										<div className="flex-1 relative">
											<Textarea
												ref={textareaRef}
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
												onFocus={() => setIsMobileFocus(true)}
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
							</>
						) : activeTab === "timeline" ? (
							/* Timeline Tab Content */
							<div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-pink-100">
								<LoveStoryTimeline
									className={timelineJustUnlocked ? "love-story-unlock" : ""}
								/>
							</div>
						) : activeTab === "summary" ? (
							/* Summary Tab Content */
							<div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-pink-100">
								<RsvpSummary
									rsvpData={agentState?.rsvpData ?? null}
									onEditRsvp={() => setActiveTab("chat")}
								/>
							</div>
						) : activeTab === "audio" ? (
							/* Audio Tab Content */
							<div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-pink-100">
								<AudioRecorder qrToken={qrToken} />
							</div>
						) : (
							/* Photos Tab Content */
							<PhotoUpload
								qrToken={qrToken}
								guestId={null}
								adminSecret={adminSecret}
							/>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
