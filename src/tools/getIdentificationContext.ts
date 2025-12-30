import { getCurrentAgent } from "agents";
import { tool } from "ai";
import type { Chat } from "@/agents";
import {
	type IdentificationContextInput,
	IdentificationContextInputSchema,
	type IdentificationContextOutput,
	IdentificationContextOutputSchema,
} from "@/tools/types";

/**
 * Get Identification Context Tool
 *
 * AI uses this to check identification state and decide next steps.
 *
 * Use cases:
 * - Check how many attempts have been made (3 max)
 * - Determine if should continue trying or give up
 * - Get current conversation state for context
 */
export const getIdentificationContextTool = tool<
	IdentificationContextInput,
	IdentificationContextOutput
>({
	description: `Get current identification state and attempt count. Use this to:
  1. Check how many identification attempts have been made (max is 3)
  2. Decide whether to continue trying to identify or give up
  3. Understand current conversation flow state
  
  If maxAttemptsReached is true, you should stop asking identification questions and inform the user they cannot be identified. Offer general wedding information only.`,

	execute: async () => {
		console.log("Getting identification context...");
		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");
		const state = agent.state;

		const maxAttempts = 3;
		const attemptsRemaining = maxAttempts - state.identificationAttempts;
		const maxAttemptsReached = state.identificationAttempts >= maxAttempts;

		return {
			attemptsRemaining: Math.max(0, attemptsRemaining),

			// Current state
			conversationState: state.conversationState,

			// Guidance for AI
			guidance: maxAttemptsReached
				? "STOP: Maximum attempts reached. Inform user they cannot be identified. Offer to provide general wedding information. Do NOT ask more identification questions."
				: attemptsRemaining === 1
					? `WARNING: Only ${attemptsRemaining} attempt remaining. Be very careful with next question. If this fails, you must stop identification.`
					: `${attemptsRemaining} attempts remaining. Continue natural conversation to identify the guest.`,
			hasGroupContext: !!state.groupId,
			// Identification tracking
			identificationAttempts: state.identificationAttempts,
			isIdentified: !!state.guestId,
			maxAttempts,
			maxAttemptsReached,
			type: "identification-context",
		};
	},

	inputSchema: IdentificationContextInputSchema,
	outputSchema: IdentificationContextOutputSchema,
});
