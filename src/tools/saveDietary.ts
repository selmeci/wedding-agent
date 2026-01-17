import { getCurrentAgent } from "agents";
import { tool } from "ai";
import type { Chat } from "@/agents";
import {
	type SaveDietaryInput,
	SaveDietaryInputSchema,
	type SaveDietaryOutput,
	SaveDietaryOutputSchema,
} from "@/tools/types";
import { checkTransportEligibility } from "@/utils/transport";

/**
 * Save Dietary Tool - RSVP Step 1
 *
 * Called by AI after collecting dietary restriction information from guest.
 *
 * State transitions:
 * - If guest is from Modra → completing_rsvp (skip transport & accommodation)
 * - If guest is from eligible transport city → collecting_transport
 * - If guest is NOT from eligible city → collecting_accommodation (skip transport)
 */
export const saveDietaryTool = tool<SaveDietaryInput, SaveDietaryOutput>({
	description: `Save dietary restrictions and determine next step.

  Call this IMMEDIATELY after guest answers dietary question.

  Input:
  - dietaryRestrictions: String with dietary needs or null if none
    - For groups, format as "Name1 - restriction, Name2 - restriction"
    - Use null if guest has no restrictions

  The tool will automatically determine the next state:
  - If guest is from Modra → skip to completing_rsvp
  - If guest is from eligible transport city → ask about transport
  - If guest is NOT from eligible city → skip to accommodation question`,

	execute: async ({ dietaryRestrictions }) => {
		console.log("Saving dietary restrictions...", { dietaryRestrictions });

		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const db = agent.getDatabase();
		const { groupId, guestId } = agent.state;

		if (!groupId || !guestId) {
			return {
				error: "Guest must be identified before saving dietary info",
				success: false,
				type: "save-dietary",
			};
		}

		// Get group info to check isFromModra and transport eligibility
		const groupInfo = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.id, groupId),
			with: {
				guests: true,
			},
		});

		if (!groupInfo) {
			return {
				error: "Group not found",
				success: false,
				type: "save-dietary",
			};
		}

		const isFromModra = groupInfo.isFromModra ?? false;
		const { isEligible: hasEligibleCity, city } = checkTransportEligibility(
			groupInfo.guests,
		);

		// Determine next state based on guest context
		let nextState:
			| "collecting_transport"
			| "collecting_accommodation"
			| "completing_rsvp";
		let message: string;

		if (isFromModra) {
			// Guest is from Modra - skip transport and accommodation
			nextState = "completing_rsvp";
			message =
				"Dietary restrictions saved. Guest is from Modra - skipping transport/accommodation. Ready to finalize RSVP.";
		} else if (hasEligibleCity) {
			// Guest is from eligible transport city - ask about transport
			nextState = "collecting_transport";
			message = `Dietary restrictions saved. Guest is from ${city} - ask about transport.`;
		} else {
			// Guest is NOT from eligible city - skip transport, ask about accommodation
			nextState = "collecting_accommodation";
			message =
				"Dietary restrictions saved. No eligible transport city - skipping transport question. Ask about accommodation.";
		}

		console.log(
			`saveDietary: next state = ${nextState}, city = ${city}, isFromModra = ${isFromModra}`,
		);

		return {
			message,
			stateUpdate: {
				conversationState: nextState,
				rsvpData: {
					dietaryRestrictions,
				},
			},
			success: true,
			type: "save-dietary",
		};
	},

	inputSchema: SaveDietaryInputSchema,
	outputSchema: SaveDietaryOutputSchema,
});
