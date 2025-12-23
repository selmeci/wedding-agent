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
	 * Handles incoming chat messages and manages the response stream
	 */
	async onChatMessage(
		onFinish: StreamTextOnFinishCallback<ToolSet>,
		_options?: { abortSignal?: AbortSignal },
	) {
		// Determine task type based on current state
		const taskType = determineTaskFromState(
			this.state.conversationState,
			this.state.rsvpComplete,
		);

		// Select appropriate model for task
		const model = getModelForTask(taskType, this.env);

		// Load group context:
		// - If groupId exists → load that specific group
		// - If no groupId (no-QR flow) → load ALL guests for identification
		const groupContext = await this.getGroupContext(this.state.groupId);

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
