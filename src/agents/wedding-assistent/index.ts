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
import { buildSystemPrompt } from "@/agents/wedding-assistent/system-prompt";
import type {
	GroupInfo,
	WeddingAgentState,
} from "@/agents/wedding-assistent/types";
import { createDb, type Database } from "@/db";
import {
	executions,
	getAccommodationInfoTool,
	newsletterSubscriptionTool,
	saveRsvpTool,
	sendMessageToCoupleTool,
} from "@/tools";
import type { Outputs } from "@/tools/types";
import { cleanupMessages, processToolCalls } from "@/utils";
import { sendEmailNotification, sendNewsletterMessage } from "@/utils/email";

/**
 * Simplified Chat Agent
 *
 * Goal-oriented agent with:
 * - 3 states: collecting, completed, declined
 * - 4 tools: saveRsvp, getAccommodationInfo, sendMessageToCouple, newsletterSubscription
 * - Single system prompt for entire conversation
 */
export class Chat extends AIChatAgent<Env, WeddingAgentState> {
	private db: Database | null = null;

	/**
	 * Initial state
	 */
	initialState: WeddingAgentState = {
		conversationState: "collecting",
		groupId: null,
		rsvpData: null,
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
	 * Generate initial greeting message
	 *
	 * Single guest: Personal greeting + attendance question
	 * Multi guest: Group greeting + attendance question (no "who's writing")
	 */
	private getInitialGreeting(groupContext: GroupInfo): string {
		const isSingleGuest = groupContext.guests.length === 1;

		if (isSingleGuest) {
			const guest = groupContext.guests[0];
			return `Ahoj ${guest.firstName}! 💕 Som tvoj osobný svadobný asistent. Pomôžem ti potvrdiť účasť na svadbe a zodpovedať všetky otázky. Môžem sa na teba tešiť 27. marca na sobáši aj hostine?`;
		}

		// Multi guest - greet all and ask about attendance directly (no identity question)
		return `Ahoj ${groupContext.guestNames.join(" a ")}! 💕 Som váš osobný svadobný asistent. Pomôžem vám potvrdiť účasť na svadbe a zodpovedať všetky otázky. Môžeme sa na vás tešiť 27. marca na sobáši aj hostine?`;
	}

	/**
	 * Handles incoming chat messages
	 */
	async onChatMessage(
		onFinish: StreamTextOnFinishCallback<ToolSet>,
		_options?: { abortSignal?: AbortSignal },
	) {
		// Skip if only greeting message exists
		if (this.messages.length === 1) {
			return;
		}

		// Skip AI response for couple messages (identified by [COUPLE] prefix)
		const lastMessage = this.messages[this.messages.length - 1];
		const lastTextPart = lastMessage?.parts?.find(
			(p): p is { type: "text"; text: string } => p.type === "text",
		);
		if (lastTextPart?.text?.startsWith("[COUPLE]")) {
			console.log("Couple message detected - skipping AI response");
			await this.handleCoupleMessage(lastTextPart.text);
			return;
		}

		console.log("State:", this.state);

		// Validate QR code access
		if (!this.state.groupId) {
			throw new Error("No groupId set. Access only allowed via QR code.");
		}

		const groupContext = await this.getGroupContext(this.state.groupId);

		// Use Claude Sonnet 4
		const model = anthropic("claude-sonnet-4-5");

		// Build goal-oriented system prompt (single prompt for all states)
		const system = buildSystemPrompt(groupContext);
		console.log("System prompt length:", system.length);

		// Flat tool set - always the same tools, no state-based gating
		const tools = {
			getAccommodationInfo: getAccommodationInfoTool,
			newsletterSubscription: newsletterSubscriptionTool,
			saveRsvp: saveRsvpTool,
			sendMessageToCouple: sendMessageToCoupleTool,
		};

		const stream = createUIMessageStream({
			execute: async ({ writer }) => {
				const cleanedMessages = cleanupMessages(this.messages);

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
					onFinish: async (finishResult) => {
						const oldState = this.state.conversationState;

						// Process tool results - only saveRsvp changes state
						for (const step of finishResult.steps) {
							for (const toolResult of step.toolResults) {
								const output = toolResult.output as Outputs;
								console.log("Tool result:", output);

								if (
									output.type === "save-rsvp" &&
									output.success &&
									output.stateUpdate
								) {
									this.setState({
										...this.state,
										conversationState: output.stateUpdate.conversationState,
										rsvpData: output.rsvpData ?? null,
									});

									console.log(
										"RSVP saved. New state:",
										output.stateUpdate.conversationState,
									);
								}
								// Other tools (getAccommodationInfo, sendMessageToCouple) don't change state
							}
						}

						// Send email on state transition to final state
						const newState = this.state.conversationState;
						if (
							oldState !== newState &&
							(newState === "completed" || newState === "declined")
						) {
							console.log(
								`[State Transition] ${oldState} → ${newState}. Sending email...`,
							);
							await this.sendEmailNotification();
						}

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
		console.log(`User ${connection.id} connected`);

		if (!this.state.groupId) {
			throw new Error("No groupId set. Access only allowed via QR code.");
		}

		const groupContext = await this.getGroupContext(this.state.groupId);

		// Initial greeting on first connection
		if (this.messages.length === 0) {
			const greeting = this.getInitialGreeting(groupContext);
			console.log("Initial greeting:", greeting);

			this.messages.push({
				id: crypto.randomUUID(),
				parts: [{ text: greeting, type: "text" }],
				role: "assistant",
			});

			await this.saveMessages(this.messages);

			// State stays "collecting" - no state change needed
		}
	}

	/**
	 * Send email notification when RSVP is completed
	 */
	private async sendEmailNotification(): Promise<void> {
		const { groupId } = this.state;

		if (!groupId) {
			console.error("[Email] Cannot send: missing groupId");
			return;
		}

		try {
			const db = this.getDatabase();

			// Get all guests in group
			const groupGuests = await db.query.guests.findMany({
				where: (t, { eq }) => eq(t.groupId, groupId),
			});

			if (groupGuests.length === 0) {
				console.error("[Email] No guests found for group:", groupId);
				return;
			}

			// Get RSVP response
			const rsvpResponse = await db.query.guestGroupResponses.findFirst({
				where: (t, { eq }) => eq(t.groupId, groupId),
			});

			if (!rsvpResponse) {
				console.error("[Email] RSVP response not found:", groupId);
				return;
			}

			// Use first guest's name for email (or group name)
			const guestName = groupGuests
				.map((g) => `${g.firstName} ${g.lastName}`)
				.join(", ");

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
				console.log("[Email] Sent successfully:", emailResult.messageId);
			} else {
				console.warn("[Email] Failed:", emailResult.error);
			}
		} catch (error: unknown) {
			console.error(
				"[Email] Error:",
				error instanceof Error ? error.message : String(error),
			);
		}
	}

	/**
	 * Handle couple message delivery to subscribed group email
	 */
	private async handleCoupleMessage(rawMessage: string): Promise<void> {
		const { groupId } = this.state;

		if (!groupId) {
			console.error("[Couple Message] Missing groupId.");
			return;
		}

		const message = rawMessage.replace(/^\[COUPLE\]/, "").trim();
		if (!message) {
			console.warn("[Couple Message] Empty message. Skipping email.");
			return;
		}

		try {
			const db = this.getDatabase();

			const group = await db.query.guestGroups.findFirst({
				where: (t, { eq }) => eq(t.id, groupId),
			});

			if (!group?.newsletterEmail) {
				console.log("[Couple Message] No newsletter email for group.");
				return;
			}

			const emailResult = await sendNewsletterMessage(this.env, {
				email: group.newsletterEmail,
				groupName: group.name,
				message,
			});

			if (emailResult.success) {
				console.log(
					"[Couple Message] Email sent successfully:",
					emailResult.messageId,
				);
			} else {
				console.warn("[Couple Message] Failed:", emailResult.error);
			}
		} catch (error: unknown) {
			console.error(
				"[Couple Message] Error:",
				error instanceof Error ? error.message : String(error),
			);
		}
	}

	/**
	 * Load group context from D1 database
	 */
	private async getGroupContext(groupId: string): Promise<GroupInfo> {
		const db = this.getDatabase();

		const groupWithGuests = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.id, groupId),
			with: { guests: true },
		});

		if (!groupWithGuests) {
			throw new Error(`Group ${groupId} not found`);
		}

		return {
			groupId,
			groupName: groupWithGuests.name,
			guestNames: groupWithGuests.guests.map((g) => g.firstName),
			guests: groupWithGuests.guests,
			isFromModra: groupWithGuests.isFromModra ?? false,
		};
	}
}
