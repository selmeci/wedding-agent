import { getCurrentAgent } from "agents";
import { tool } from "ai";
import type { Chat } from "@/agents";
import {
	type SaveAccommodationInput,
	SaveAccommodationInputSchema,
	type SaveAccommodationOutput,
	SaveAccommodationOutputSchema,
} from "@/tools/types";

/**
 * Save Accommodation Tool - RSVP Step 3 (conditional)
 *
 * Called by AI after collecting accommodation needs from guest.
 * Only called for guests who:
 * - Are NOT from Modra
 * - Do NOT want transport after celebration
 *
 * Transitions state to completing_rsvp.
 */
export const saveAccommodationTool = tool<
	SaveAccommodationInput,
	SaveAccommodationOutput
>({
	description: `Save accommodation needs and move to RSVP finalization.

  Call this IMMEDIATELY after guest answers accommodation question.

  Input:
  - needsAccommodation: true if guest wants accommodation recommendations

  After calling this tool, the state will change to completing_rsvp
  and you should finalize the RSVP with updateRsvp tool.`,

	execute: async ({ needsAccommodation }) => {
		console.log("Saving accommodation preferences...", { needsAccommodation });

		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const { groupId, guestId } = agent.state;

		if (!groupId || !guestId) {
			return {
				error: "Guest must be identified before saving accommodation info",
				success: false,
				type: "save-accommodation",
			};
		}

		return {
			message: "Accommodation preferences saved. Ready to finalize RSVP.",
			stateUpdate: {
				conversationState: "completing_rsvp",
				rsvpData: {
					needsAccommodation,
				},
			},
			success: true,
			type: "save-accommodation",
		};
	},

	inputSchema: SaveAccommodationInputSchema,
	outputSchema: SaveAccommodationOutputSchema,
});
