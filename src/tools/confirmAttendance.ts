import { getCurrentAgent } from "agents";
import { tool } from "ai";
import type { Chat } from "@/agents";
import { guestGroupResponses, type NewGuestGroupResponse } from "@/db";
import {
	type ConfirmAttendanceInput,
	ConfirmAttendanceInputSchema,
	type ConfirmAttendanceOutput,
	ConfirmAttendanceOutputSchema,
} from "@/tools/types";

/**
 * Confirm Attendance Tool
 *
 * Called by AI after user answers the attendance question (yes or no).
 * Creates a partial RSVP record with just attendance information.
 *
 * If willAttend=true:
 *   - Creates partial RSVP (isComplete=false)
 *   - Changes state to "collecting_rsvp" to gather additional details
 *
 * If willAttend=false:
 *   - Creates complete RSVP (isComplete=true, all fields null)
 *   - Changes state to "declined"
 */
export const confirmAttendanceTool = tool<
	ConfirmAttendanceInput,
	ConfirmAttendanceOutput
>({
	description: `Confirm whether guest will attend or decline the wedding.

  Call this IMMEDIATELY after user answers the attendance question with yes or no.

  If user says YES (prídem, áno, ideme, atď.):
    - Call with willAttend: true
    - This creates partial RSVP and you'll continue collecting details

  If user says NO (nemôžem, nie, nepôjdeme, atď.):
    - Call with willAttend: false
    - This creates complete RSVP and ends the flow

  Do NOT ask additional questions before calling this tool!`,

	execute: async ({ willAttend }) => {
		console.log("Confirming attendance...", { willAttend });

		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const db = agent.getDatabase();
		const { groupId, guestId } = agent.state;

		if (!groupId || !guestId) {
			console.log("Guest must be identified before confirming attendance");
			return {
				error: "Guest must be identified before confirming attendance",
				success: false,
				type: "confirm-attendance",
			};
		}

		const responseData: NewGuestGroupResponse = {
			attendCeremony: willAttend ? true : null,
			dietaryRestrictions: null,
			groupId,
			isComplete: !willAttend, // Complete if declined, incomplete if attending (need more info)
			needsAccommodation: null,
			needsDirections: null,
			needsTransportAfter: null,
			respondedBy: guestId,
			updatedAt: new Date(),
			willAttend,
		};

		const groupResp = await db
			.insert(guestGroupResponses)
			.values({
				...responseData,
				createdAt: new Date(),
			})
			.onConflictDoNothing();

		console.log("Attendance confirmed successfully for group:", {
			groupResp,
		});

		// Determine next state
		const nextState = willAttend ? "collecting_rsvp" : "declined";

		return {
			message: willAttend
				? "✓ Účasť potvrdená. Povedz useru potvrdenie a UKONČI odpoveď. V ďalšej konverzácii začneš zbierať RSVP údaje."
				: "✓ Účasť odmietnutá. RSVP je kompletné.",
			stateUpdate: {
				conversationState: nextState,
			},
			success: true,
			type: "confirm-attendance",
		};
	},

	inputSchema: ConfirmAttendanceInputSchema,
	outputSchema: ConfirmAttendanceOutputSchema,
});
