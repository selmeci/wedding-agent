import type { Connection } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	type StreamTextOnFinishCallback,
	stepCountIs,
	streamText,
	type ToolSet,
} from "ai";
import { match } from "ts-pattern";
import { buildSystemPrompt } from "@/agents/wedding-assistent/system-prompt";
import type {
	GroupInfo,
	WeddingAgentState,
} from "@/agents/wedding-assistent/types";
import {
	determineTaskFromState,
	getModelForTask,
} from "@/agents/wedding-assistent/utils";
import { createDb, type Database } from "@/db";
import {
	changeAttendanceDecisionTool,
	confirmAttendanceTool,
	confirmIdentityTool,
	executions,
	getAccommodationInfoTool,
	updateRsvpTool,
} from "@/tools";
import type { Outputs } from "@/tools/types";
import { cleanupMessages, processToolCalls } from "@/utils";

/**
 * Chat Agent implementation that handles real-time AI chat interactions
 */
export class Chat extends AIChatAgent<Env, WeddingAgentState> {
	private db: Database | null = null;

	initialState: WeddingAgentState = {
		conversationState: "initializing",
		groupId: null,
		guestId: null,
		identificationAttempts: 0,
		rsvpComplete: false,
	};

	getDatabase(): Database {
		if (!this.db) {
			this.db = createDb(this.env.DB);
		}

		return this.db;
	}

	setGroupId(groupId: string) {
		this.setState({
			...this.state,
			groupId,
		});
	}

	resetState() {
		this.setState({
			...this.initialState,
		});
	}

	/**
	 * Generate initial greeting message for QR flow
	 *
	 * QR flow (groupId exists): Greet entire group by names and ask who's chatting
	 */
	private getInitialGreeting(groupContext: GroupInfo): string {
		// QR flow - group greeting (UC-01, UC-02)
		// Greet all members by name and ask who's chatting
		return `Ahoj ${groupContext.guestNames.join(", ")}! 💕 Som váš osobný svadobný asistent. Pomôžem vám potvrdiť účasť na svadbe, zozbierať potrebné informácie pre hostinu a zodpovedať všetky otázky ohľadom nášho veľkého dňa. Vážime si, že nám venujete čas! Kto z vás práve píše?`;
	}

	/**
	 * Handles incoming chat messages and manages the response stream
	 */
	async onChatMessage(
		onFinish: StreamTextOnFinishCallback<ToolSet>,
		_options?: { abortSignal?: AbortSignal },
	) {
		if (this.messages.length === 1) {
			return;
		}

		console.log("State", { state: this.state });

		// Load group context (QR flow only)
		// groupId must be set via setGroupId() before chat starts
		if (!this.state.groupId) {
			throw new Error("No groupId set. Access only allowed via QR code.");
		}

		const groupContext = await this.getGroupContext(this.state.groupId);

		// Determine task type based on current state
		const taskType = determineTaskFromState(
			this.state.conversationState,
			this.state.rsvpComplete,
		);

		// Select appropriate model for task
		const model = getModelForTask(taskType, this.env);

		// Build context-aware system prompt
		const system = buildSystemPrompt(this.state, groupContext);
		console.log("System prompt:\n", system);

		// Determine which tools to provide based on task
		const tools = match(taskType)
			.with("identification", () => ({
				confirmIdentity: confirmIdentityTool,
			}))
			.with("rsvp_collection", () => ({
				confirmAttendance: confirmAttendanceTool,
				getAccommodationInfo: getAccommodationInfoTool,
				updateRsvp: updateRsvpTool,
			}))
			.with("information_provision", "chat_general", () => ({
				changeAttendanceDecision: changeAttendanceDecisionTool,
				getAccommodationInfo: getAccommodationInfoTool,
			}))
			.exhaustive();

		const stream = createUIMessageStream({
			execute: async ({ writer }) => {
				// Clean up incomplete tool calls to prevent API errors
				const cleanedMessages = cleanupMessages(this.messages);

				// Process any pending tool calls from previous messages
				// This handles human-in-the-loop confirmations for tools
				const processedMessages = await processToolCalls({
					dataStream: writer,
					executions,
					messages: cleanedMessages,
					tools,
				});

				const result = streamText({
					maxOutputTokens: 2048,
					messages: await convertToModelMessages(processedMessages),
					model,
					// Wrap onFinish to process tool results and update agent state
					onFinish: async (finishResult) => {
						// Process tool results for state updates
						// Currently handles: confirmIdentity, confirmAttendance, updateRsvp
						for (const step of finishResult.steps) {
							for (const toolResult of step.toolResults) {
								console.log("Tool result:", { output: toolResult.output });
								await match<Outputs>(toolResult.output as Outputs)
									.with({ type: "confirm-identity" }, async (output) => {
										if (output.success) {
											const stateUpdate = output.stateUpdate;
											if (stateUpdate) {
												this.setState({
													...this.state,
													...stateUpdate,
												});

												console.log(
													"Identity confirmed. State updated to:",
													stateUpdate.conversationState,
													"Guest:",
													output.guest.firstName,
													output.guest.lastName,
												);
											}
										}
									})
									.with({ type: "confirm-attendance" }, async (output) => {
										if (output.success) {
											this.setState({
												...this.state,
												...output.stateUpdate,
											});

											console.log(
												"Attendance confirmed. State:",
												output.stateUpdate.conversationState,
											);
										}
									})
									.with({ type: "update-rsvp" }, async (output) => {
										if (output.success) {
											const finalState = output.stateUpdate;

											this.setState({
												...this.state,
												...finalState,
											});

											console.log(
												"RSVP saved successfully. State:",
												finalState.conversationState,
											);
										}
									})
									.with(
										{ type: "change-attendance-decision" },
										async (output) => {
											if (output.success) {
												this.setState({
													...this.state,
													...output.stateUpdate,
												});

												console.log(
													"Attendance decision changed. State:",
													output.stateUpdate.conversationState,
													"Guest now attending:",
													output.stateUpdate.rsvpData.willAttend,
												);
											}
										},
									)
									.otherwise(async () => {});
							}
						}

						// Call base callback
						await (
							onFinish as unknown as StreamTextOnFinishCallback<typeof tools>
						)(finishResult);
					},
					stopWhen: stepCountIs(100),
					system,
					tools,
				});

				writer.merge(result.toUIMessageStream());
			},
		});

		return createUIMessageStreamResponse({ stream });
	}

	async onConnect(connection: Connection) {
		console.log(`User ${connection.id} has connected to the chat agent...`);

		// Validate groupId is set (QR code access only)
		if (!this.state.groupId) {
			throw new Error("No groupId set. Access only allowed via QR code.");
		}

		const groupContext = await this.getGroupContext(this.state.groupId);

		// 🎯 INITIAL GREETING: If this is the first interaction (no messages yet),
		// inject a proactive greeting message from the assistant
		// This implements UC-01, UC-02 requirements
		if (this.messages.length === 0) {
			const greeting = this.getInitialGreeting(groupContext);
			console.log("Initial greeting:\n", greeting);

			// Add assistant greeting as first message
			this.messages.push({
				id: crypto.randomUUID(),
				parts: [
					{
						text: greeting,
						type: "text",
					},
				],
				role: "assistant",
			});

			// Persist the greeting message
			await this.saveMessages(this.messages);

			// QR flow: Move to group_welcome state
			this.setState({
				...this.state,
				conversationState: "group_welcome",
			});
		}
	}

	/**
	 * Load group context from D1 database
	 *
	 * @param groupId - UUID of guest group (required for QR-only access)
	 * @returns GroupInfo with guests from the group
	 */
	private async getGroupContext(groupId: string): Promise<GroupInfo> {
		const db = this.getDatabase();

		// QR flow: Load specific group with its guests
		const groupWithGuests = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.id, groupId),
			with: {
				guests: true,
			},
		});

		if (!groupWithGuests) {
			throw new Error(`Group ${groupId} not found`);
		}

		return {
			groupId,
			groupName: groupWithGuests.name,
			guestNames: groupWithGuests.guests.map((g) => `${g.firstName}`),
			guests: groupWithGuests.guests,
			isFromModra: groupWithGuests.isFromModra ?? false,
		};
	}
}
