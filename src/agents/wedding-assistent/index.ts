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
	confirmIdentityTool,
	executions,
	getIdentificationContextTool,
	getWeddingInfoTool,
} from "@/tools";
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

	/**
	 * Generate initial greeting message based on QR flow vs no-QR flow
	 *
	 * QR flow (groupId exists): Greet entire group by names
	 * No-QR flow (no groupId): Request identification
	 */
	private getInitialGreeting(groupContext: GroupInfo | null): string {
		if (this.state.groupId && groupContext) {
			// QR flow - group greeting (UC-01, UC-02)
			// Greet all members by name and ask who's chatting
			return `Ahoj ${groupContext.guestNames.join(", ")}! Vitajte na našej svadobnej stránke! 💕 Kto z vás práve píše?`;
		} else {
			// No-QR flow - identification request (UC-03)
			// Greet visitor and ask for name
			return `Ahoj! Vitaj na svadobnej stránke Ivonky a Romana! 💕 Môžem sa opýtať ako sa voláš? Tvoje meno a priezvisko mi pomôžu nájsť ťa v zozname pozvaných hostí.`;
		}
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

		// Load group context early (needed for greeting and system prompt)
		// - If groupId exists → load that specific group
		// - If no groupId (no-QR flow) → load ALL guests for identification
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
				getIdentificationContext: getIdentificationContextTool,
			}))
			.with("rsvp_collection", () => ({
				getWeddingInfo: getWeddingInfoTool,
			}))
			.with("information_provision", "chat_general", () => ({
				getWeddingInfo: getWeddingInfoTool,
			}))
			.exhaustive();

		// Increment identification attempts if in identification phase
		const shouldIncrementAttempts = match(this.state.conversationState)
			.with("group_welcome", "identifying_individual", () => true)
			.otherwise(() => false);

		if (shouldIncrementAttempts) {
			this.setState({
				...this.state,
				identificationAttempts: this.state.identificationAttempts + 1,
			});
		}

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
					messages: await convertToModelMessages(processedMessages),
					model,
					// Type boundary: streamText expects specific tool types, but base class uses ToolSet
					// This is safe because our tools satisfy ToolSet interface (verified by 'satisfies' in tools.ts)
					onFinish: onFinish as unknown as StreamTextOnFinishCallback<
						typeof tools
					>,
					stopWhen: stepCountIs(10),
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
		const groupContext = await this.getGroupContext(this.state.groupId);

		// 🎯 INITIAL GREETING: If this is the first interaction (no messages yet),
		// inject a proactive greeting message from the assistant
		// This implements UC-01, UC-02, UC-03 requirements
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

			// Update conversation state based on flow type
			if (this.state.groupId) {
				// QR flow: Move to group_welcome state
				this.setState({
					...this.state,
					conversationState: "group_welcome",
				});
			} else {
				// No-QR flow: Move to identifying_individual state
				this.setState({
					...this.state,
					conversationState: "identifying_individual",
				});
			}
		}
	}

	/**
	 * Load group context from D1 database
	 *
	 * @param groupId - UUID of guest group, or null for no-QR flow
	 * @returns GroupInfo with guests from the group (or all guests if groupId is null)
	 */
	private async getGroupContext(groupId: string | null): Promise<GroupInfo> {
		const db = this.getDatabase();

		if (groupId) {
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
				guestNames: groupWithGuests.guests.map(
					(g) => `${g.firstName} ${g.lastName}`,
				),
				guests: groupWithGuests.guests,
				isFromModra: groupWithGuests.isFromModra ?? false,
			};
		} else {
			// No-QR flow: Load ALL guests (max 30) for identification
			const allGuests = await db.query.guests.findMany({
				limit: 30, // Safety limit
				with: {
					group: true,
				},
			});

			return {
				groupId: null,
				groupName: "Všetci pozvaní hostia",
				guestNames: allGuests.map((g) => `${g.firstName} ${g.lastName}`),
				guests: allGuests,
				isFromModra: false, // Will be determined after identification
			};
		}
	}
}
