import { getCurrentAgent } from "agents";
import { tool } from "ai";
import type { Chat } from "@/agents";
import {
	type SaveTransportInput,
	SaveTransportInputSchema,
	type SaveTransportOutput,
	SaveTransportOutputSchema,
} from "@/tools/types";

/**
 * Save Transport Tool - RSVP Step 2
 *
 * Called by AI after collecting transport needs from guest.
 *
 * State transitions:
 * - If guest is from Modra OR wants transport → completing_rsvp (skip accommodation)
 * - Otherwise → collecting_accommodation
 */
export const saveTransportTool = tool<SaveTransportInput, SaveTransportOutput>({
	description: `Save transport needs and determine next step.

  Call this IMMEDIATELY after guest answers transport question.

  Input:
  - needsTransportAfter: true if guest wants organized transport back home
  - transportDestination: Guest's home city (from 'about' field) if needsTransportAfter=true, null otherwise

  Rules:
  - If needsTransportAfter=true, transportDestination MUST be provided
  - If needsTransportAfter=false, transportDestination should be null

  After calling this tool:
  - If guest is from Modra OR wants transport → skip to completing_rsvp
  - Otherwise → ask about accommodation needs`,

	execute: async ({ needsTransportAfter, transportDestination }) => {
		console.log("Saving transport preferences...", {
			needsTransportAfter,
			transportDestination,
		});

		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const db = agent.getDatabase();
		const { groupId, guestId } = agent.state;

		if (!groupId || !guestId) {
			return {
				error: "Guest must be identified before saving transport info",
				success: false,
				type: "save-transport",
			};
		}

		// Validate: if needs transport, destination must be provided
		if (needsTransportAfter && !transportDestination) {
			return {
				error:
					"transportDestination must be provided when needsTransportAfter is true",
				success: false,
				type: "save-transport",
			};
		}

		// Check if guest is from Modra
		const groupInfo = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.id, groupId),
		});

		const isFromModra = groupInfo?.isFromModra ?? false;

		// Determine next state:
		// Skip accommodation question if:
		// 1. Guest is from Modra (no accommodation needed)
		// 2. Guest wants transport (they're going home, no accommodation needed)
		const skipAccommodation = isFromModra || needsTransportAfter;
		const nextState = skipAccommodation
			? "completing_rsvp"
			: "collecting_accommodation";

		const message = skipAccommodation
			? "Transport preferences saved. Ready to finalize RSVP."
			: "Transport preferences saved. Now ask about accommodation needs.";

		return {
			message,
			nextState,
			stateUpdate: {
				conversationState: nextState,
				rsvpData: {
					needsTransportAfter,
					transportDestination,
				},
			},
			success: true,
			type: "save-transport",
		};
	},

	inputSchema: SaveTransportInputSchema,
	outputSchema: SaveTransportOutputSchema,
});
