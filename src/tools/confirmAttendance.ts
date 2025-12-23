import { getCurrentAgent } from "agents";
import { tool } from "ai";
import { eq } from "drizzle-orm";
import type { Chat } from "@/agents";
import { guestGroupResponses } from "@/db";
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

		// Check if RSVP already exists (shouldn't happen, but handle it)
		const existingResponse = await db.query.guestGroupResponses.findFirst({
			where: (t, { eq }) => eq(t.groupId, groupId),
		});

		const responseData = {
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

		if (existingResponse) {
			// Update existing (shouldn't happen in normal flow)
			await db
				.update(guestGroupResponses)
				.set(responseData)
				.where(eq(guestGroupResponses.groupId, groupId));

			console.log("Attendance updated for group:", groupId);
		} else {
			// Create new partial RSVP
			await db.insert(guestGroupResponses).values({
				...responseData,
				createdAt: new Date(),
			});

			console.log("Attendance confirmed for group:", groupId);
		}

		// Determine next state
		const nextState = willAttend ? "collecting_rsvp" : "declined";

		return {
			message: willAttend
				? "Attendance confirmed. Continue collecting RSVP details (dietary, transport, accommodation)."
				: "Attendance declined. RSVP is complete.",
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
