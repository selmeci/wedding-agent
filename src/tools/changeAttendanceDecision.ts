import { getCurrentAgent } from "agents";
import { tool } from "ai";
import { eq } from "drizzle-orm";
import type { Chat } from "@/agents";
import { guestGroupResponses } from "@/db";
import {
	type ChangeAttendanceDecisionInput,
	ChangeAttendanceDecisionInputSchema,
	type ChangeAttendanceDecisionOutput,
	ChangeAttendanceDecisionOutputSchema,
} from "@/tools/types";

/**
 * Change Attendance Decision Tool
 *
 * Called by AI when a guest who previously declined (willAttend=false)
 * changes their mind and decides to attend after all.
 *
 * This tool:
 * - Updates the RSVP record to willAttend=true, isComplete=false
 * - Resets all RSVP details (will be collected again)
 * - Transitions state from "declined" to "collecting_rsvp"
 *
 * Business rule:
 * - Only callable from "declined" state
 * - Restarts RSVP collection process (dietary, transport, accommodation)
 */
export const changeAttendanceDecisionTool = tool<
	ChangeAttendanceDecisionInput,
	ChangeAttendanceDecisionOutput
>({
	description: `Change a guest's attendance decision from "not attending" to "attending".

  Use this tool ONLY when:
  - Guest is currently in "declined" state (previously said they won't attend)
  - Guest explicitly says they changed their mind and will attend after all

  Examples of phrases to detect:
  - "rozmyslel som sa, predsa prídem"
  - "zmenil som názor, ideme"
  - "predsa prídem"
  - "predsa budeme"

  After calling this tool with newDecision=true:
  - The RSVP record is reset (willAttend=true, isComplete=false)
  - State changes to "collecting_rsvp"
  - You MUST immediately continue with the FIRST RSVP question (dietary restrictions)

  Do NOT call this tool if guest is just asking questions or chatting.`,

	execute: async ({ newDecision }) => {
		console.log("Changing attendance decision...", { newDecision });

		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const db = agent.getDatabase();
		const { groupId, guestId, conversationState } = agent.state;

		// Validate prerequisites
		if (!groupId || !guestId) {
			return {
				error: "Guest must be identified before changing attendance decision",
				success: false,
				type: "change-attendance-decision",
			};
		}

		// Only allow this from "declined" state
		if (conversationState !== "declined") {
			return {
				error: `Can only change decision from "declined" state. Current state: ${conversationState}`,
				success: false,
				type: "change-attendance-decision",
			};
		}

		// Only support changing TO attending (not the reverse - that's handled differently)
		if (!newDecision) {
			return {
				error:
					"This tool only supports changing from declined to attending. Use confirmAttendance for initial attendance confirmation.",
				success: false,
				type: "change-attendance-decision",
			};
		}

		// Check if response exists
		const existingResponse = await db.query.guestGroupResponses.findFirst({
			where: (t, { eq }) => eq(t.groupId, groupId),
		});

		if (!existingResponse) {
			return {
				error:
					"No existing RSVP found. Guest must go through normal RSVP flow first.",
				success: false,
				type: "change-attendance-decision",
			};
		}

		// Update RSVP record: reset to willAttend=true, isComplete=false
		// All other fields reset to null (will be collected again)
		await db
			.update(guestGroupResponses)
			.set({
				willAttend: true,
				attendCeremony: true, // Always true if attending
				isComplete: false, // Need to collect details again
				// Reset all optional fields - will be collected again
				dietaryRestrictions: null,
				needsTransportAfter: null,
				transportDestination: null,
				needsAccommodation: null,
				respondedBy: guestId,
				updatedAt: new Date(),
			})
			.where(eq(guestGroupResponses.groupId, groupId));

		console.log(
			"Attendance decision changed successfully. Guest will now attend. State: declined → collecting_dietary",
		);

		return {
			message:
				"✓ Rozhodnutie zmenené. Hosť teraz príde! Pokračuj PRIAMO s personalizovanou diétnou otázkou.",
			stateUpdate: {
				conversationState: "collecting_dietary",
				rsvpComplete: false,
				rsvpData: {
					willAttend: true,
					attendCeremony: true,
					dietaryRestrictions: null,
					needsAccommodation: null,
					needsTransportAfter: null,
					transportDestination: null,
				},
			},
			success: true,
			type: "change-attendance-decision",
		};
	},

	inputSchema: ChangeAttendanceDecisionInputSchema,
	outputSchema: ChangeAttendanceDecisionOutputSchema,
});
