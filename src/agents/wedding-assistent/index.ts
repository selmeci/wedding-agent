import { anthropic } from "@ai-sdk/anthropic";
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
import { determineTaskFromState } from "@/agents/wedding-assistent/utils";
import { createDb, type Database } from "@/db";
import {
	changeAttendanceDecisionTool,
	confirmAttendanceTool,
	confirmIdentityTool,
	executions,
	getAccommodationInfoTool,
	saveDietaryTool,
	saveTransportTool,
	updateRsvpTool,
} from "@/tools";
import type { Outputs } from "@/tools/types";
import { cleanupMessages, processToolCalls } from "@/utils";
import { sendEmailNotification } from "@/utils/email";
// TODO: Re-enable when email notifications are ready
// import { sendEmailNotification } from "@/utils/email";

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

	getEnv() {
		return this.env;
	}

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
		const isSingleGuest = groupContext.guests.length === 1;

		if (isSingleGuest) {
			// Single guest - skip "who's writing" and ask directly about attendance
			// AI will auto-identify in first response
			return `Ahoj ${groupContext.guestNames[0]}! 💕 Som tvoj osobný svadobný asistent. Pomôžem ti potvrdiť účasť na svadbe, zozbierať potrebné informácie pre hostinu a zodpovedať všetky otázky ohľadom nášho veľkého dňa. Vážime si, že nám venuješ čas! Môžem sa na teba tešiť 27. marca na sobáši aj hostine?`;
		}

		// Multiple guests - greet all and ask who's chatting
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

		// Determine task type based on current state (used for logging)
		const taskType = determineTaskFromState(
			this.state.conversationState,
			this.state.rsvpComplete,
		);
		console.log("Task type:", taskType);

		// Select appropriate model for task
		//const model = fireworks(this.env)("accounts/fireworks/models/gpt-oss-120b");
		//const model = getModelForTask(taskType, this.env);
		const model = anthropic("claude-sonnet-4-5");

		// Build context-aware system prompt
		const system = buildSystemPrompt(this.state, groupContext);
		console.log("System prompt:\n", system);

		// Determine which tools to provide based on conversation state
		// Using state-based tool gating to ensure proper RSVP collection flow
		const tools = match(this.state.conversationState)
			// Identification states
			.with("group_welcome", "identifying_individual", () => ({
				confirmAttendance: confirmAttendanceTool, // For single-guest auto-ID flow
				confirmIdentity: confirmIdentityTool,
			}))
			// Attendance confirmation
			.with("identified", "confirming_attendance", () => ({
				confirmAttendance: confirmAttendanceTool,
			}))
			// RSVP sub-states - each state has specific tool
			.with("collecting_dietary", () => ({
				saveDietary: saveDietaryTool,
			}))
			.with("collecting_transport", () => ({
				saveTransport: saveTransportTool,
				updateRsvp: updateRsvpTool, // Allow finalizing RSVP if transport leads directly to completion
			}))
			.with("collecting_accommodation", () => ({
				getAccommodationInfo: getAccommodationInfoTool,
				updateRsvp: updateRsvpTool, // Allow finalizing RSVP directly from this state
			}))
			.with("completing_rsvp", () => ({
				updateRsvp: updateRsvpTool,
			}))
			// Post-RSVP states - general chat + RSVP editing
			.with("completed", () => ({
				changeAttendanceDecision: changeAttendanceDecisionTool,
				getAccommodationInfo: getAccommodationInfoTool,
				updateRsvp: updateRsvpTool, // For editing existing RSVP
			}))
			.with("declined", () => ({
				changeAttendanceDecision: changeAttendanceDecisionTool,
				getAccommodationInfo: getAccommodationInfoTool,
			}))
			// Edge cases
			.with("initializing", "identification_failed", () => ({
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
						// Capture old state before processing tools
						const oldState = this.state.conversationState;

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
									.with({ type: "save-dietary" }, async (output) => {
										if (output.success) {
											const currentRsvpData = this.state.rsvpData || {
												attendCeremony: true,
												dietaryRestrictions: null,
												needsAccommodation: null,
												needsTransportAfter: null,
												transportDestination: null,
												willAttend: true,
											};
											this.setState({
												...this.state,
												conversationState: output.stateUpdate.conversationState,
												rsvpData: {
													...currentRsvpData,
													attendCeremony: true,
													dietaryRestrictions:
														output.stateUpdate.rsvpData.dietaryRestrictions,
													willAttend: true,
												},
											});

											console.log(
												"Dietary saved. State:",
												output.stateUpdate.conversationState,
											);
										}
									})
									.with({ type: "save-transport" }, async (output) => {
										if (output.success) {
											const currentRsvpData = this.state.rsvpData || {
												attendCeremony: true,
												dietaryRestrictions: null,
												needsAccommodation: null,
												needsTransportAfter: null,
												transportDestination: null,
												willAttend: true,
											};
											this.setState({
												...this.state,
												conversationState: output.stateUpdate.conversationState,
												rsvpData: {
													...currentRsvpData,
													needsTransportAfter:
														output.stateUpdate.rsvpData.needsTransportAfter,
													transportDestination:
														output.stateUpdate.rsvpData.transportDestination,
												},
											});

											console.log(
												"Transport saved. Next state:",
												output.stateUpdate.conversationState,
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

						// Check for state transition to final states (completed or declined)
						// Send email notification only on FIRST transition to final state
						const newState = this.state.conversationState;
						if (
							oldState !== newState &&
							(newState === "completed" || newState === "declined")
						) {
							console.log(
								`[State Transition] ${oldState} → ${newState}. Sending email notification...`,
							);
							await this.sendEmailNotification();
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
	 * Send email notification when RSVP reaches final state
	 * Called automatically on state transition to 'completed' or 'declined'
	 *
	 * NOTE: Currently disabled. Uncomment implementation when email service is configured.
	 */
	private async sendEmailNotification(): Promise<void> {
		const { groupId, guestId } = this.state;

		if (!groupId || !guestId) {
			console.error(
				"[Email Notification] Cannot send email: missing groupId or guestId",
			);
			return;
		}

		try {
			const db = this.getDatabase();

			// Get guest information
			const guest = await db.query.guests.findFirst({
				where: (t, { eq }) => eq(t.id, guestId),
			});

			if (!guest) {
				console.error("[Email Notification] Guest not found:", guestId);
				return;
			}

			// Get all guests in group for attendee count
			const groupGuests = await db.query.guests.findMany({
				where: (t, { eq }) => eq(t.groupId, groupId),
			});

			// Get RSVP response from database
			const rsvpResponse = await db.query.guestGroupResponses.findFirst({
				where: (t, { eq }) => eq(t.groupId, groupId),
			});

			if (!rsvpResponse) {
				console.error("[Email Notification] RSVP response not found:", groupId);
				return;
			}

			const guestName = `${guest.firstName} ${guest.lastName}`.trim();

			// Send email notification
			const emailResult = await sendEmailNotification(this.env, {
				attendeeCount: groupGuests.length,
				dietaryRestrictions: rsvpResponse.dietaryRestrictions,
				groupId: groupId,
				guestName,
				needsAccommodation: rsvpResponse.needsAccommodation,
				needsTransport: rsvpResponse.needsTransportAfter,
				willAttend: rsvpResponse.willAttend ?? false,
			});

			if (emailResult.success) {
				console.log(
					"[Email Notification] Email sent successfully:",
					emailResult.messageId,
				);
			} else {
				console.warn("[Email Notification] Email failed:", emailResult.error);
			}
		} catch (error: unknown) {
			console.error(
				"[Email Notification] Error sending email:",
				error instanceof Error ? error.message : String(error),
			);
			// Don't throw - email failure should not break the conversation
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
