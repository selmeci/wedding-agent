import { getCurrentAgent } from "agents";
import { tool } from "ai";
import type { Chat } from "@/agents";
import {
	type ConfirmIdentityInput,
	ConfirmIdentityInputSchema,
	type ConfirmIdentityOutput,
	ConfirmIdentityOutputSchema,
} from "@/tools/types";

/**
 * Confirm Identity Tool
 *
 * AI calls this when confident about guest identity.
 * Updates Agent state and logs identification for audit.
 *
 * Important: AI should only call this when 80%+ confident based on conversation.
 */
export const confirmIdentityTool = tool<
	ConfirmIdentityInput,
	ConfirmIdentityOutput
>({
	description: `Confirm the identity of the guest you're talking to. Call this ONLY when you're confident (80%+ certainty) about who they are based on the conversation.
  
  Provide clear reasoning for your identification. This will be logged for audit purposes.
  
  Before calling this:
  1. Make sure the conversation info matches a specific guest
  2. If multiple matches exist, ask clarifying questions first
  3. Be especially careful with common names (Peter, Maria, etc.)`,

	execute: async ({ guestId, confidence, reasoning }) => {
		console.log("Confirming identity...", { confidence, guestId, reasoning });
		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const db = agent.getDatabase();

		// Fetch guest details with group info
		const guest = await db.query.guests.findFirst({
			where: (t, { eq }) => eq(t.id, guestId),
			with: {
				group: true,
			},
		});

		if (!guest) {
			return {
				error: `Guest with ID ${guestId} not found in database`,
				success: false,
				type: "confirm-identity",
			};
		}

		// Return state update that will be applied by agent's onFinish handler
		// See: src/agents/wedding-assistent/index.ts onFinish wrapper

		return {
			guest: {
				about: guest.about,
				firstName: guest.firstName,
				groupId: guest.group.id,
				groupName: guest.group.name,
				id: guest.id,
				isFromModra: guest.group.isFromModra,
				lastName: guest.lastName,
				relationship: guest.relationship,
			},
			identificationLog: {
				confidence,
				guestId: guest.id,
				reasoning,
				timestamp: Date.now(),
			},
			message: "", // Empty - AI will provide friendly message in same response
			stateUpdate: {
				conversationState: "confirming_attendance",
				groupId: guest.group.id,
				guestId: guest.id,
				identificationAttempts: 0, // Reset on success
			},
			success: true,
			type: "confirm-identity",
		};
	},

	inputSchema: ConfirmIdentityInputSchema,
	outputSchema: ConfirmIdentityOutputSchema,
});
