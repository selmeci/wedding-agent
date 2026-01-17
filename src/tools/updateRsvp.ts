import { getCurrentAgent } from "agents";
import { tool } from "ai";
import { eq } from "drizzle-orm";
import type { Chat } from "@/agents";
import { guestGroupResponses } from "@/db";
import {
	type UpdateRsvpInput,
	UpdateRsvpInputSchema,
	type UpdateRsvpOutput,
	UpdateRsvpOutputSchema,
} from "@/tools/types";

/**
 * Update RSVP Tool - FINAL STEP
 *
 * Called by AI ONLY in completing_rsvp state after all RSVP data has been collected
 * via saveDietary, saveTransport, and saveAccommodation tools.
 *
 * This tool finalizes the RSVP by:
 * 1. Combining all collected data from agent state
 * 2. Storing the complete response in guest_group_responses table
 * 3. Transitioning to 'completed' state
 *
 * Business rules:
 * - attendCeremony MUST be true if willAttend is true
 * - If willAttend is false, all other fields should be null
 * - For groups: dietaryRestrictions formatted as "Name1 - restriction, Name2 - restriction"
 */
export const updateRsvpTool = tool<UpdateRsvpInput, UpdateRsvpOutput>({
	description: `Finalize and save complete RSVP response.

  IMPORTANT: Only call this tool in 'completing_rsvp' state!

  This is the FINAL step after collecting all information via:
  1. saveDietary (dietary restrictions)
  2. saveTransport (transport needs)
  3. saveAccommodation (accommodation needs - if applicable)

  The tool will combine all collected data and save to database.

  Input fields:
  - willAttend: true (already confirmed via confirmAttendance)
  - attendCeremony: true (always true when attending)
  - dietaryRestrictions: From collected data
  - needsTransportAfter: From collected data
  - transportDestination: From collected data (or null)
  - needsAccommodation: From collected data (or null if skipped)

  After calling this tool, provide a friendly summary and info about the wedding website.`,

	execute: async ({
		willAttend,
		attendCeremony,
		dietaryRestrictions,
		needsTransportAfter,
		transportDestination,
		needsAccommodation,
	}) => {
		console.log("Updating RSVP...", {
			attendCeremony,
			dietaryRestrictions,
			needsAccommodation,
			needsTransportAfter,
			transportDestination,
			willAttend,
		});

		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const db = agent.getDatabase();
		const { groupId, guestId } = agent.state;

		if (!groupId || !guestId) {
			return {
				error: "Guest must be identified before updating RSVP",
				success: false,
				type: "update-rsvp",
			};
		}

		// Business rule validation: attendCeremony must be true when willAttend is true
		if (willAttend && !attendCeremony) {
			return {
				error:
					"attendCeremony must be true when willAttend is true. Guests cannot attend only reception without ceremony.",
				success: false,
				type: "update-rsvp",
			};
		}

		// Check if response already exists
		const existingResponse = await db.query.guestGroupResponses.findFirst({
			where: (t, { eq }) => eq(t.groupId, groupId),
		});

		const responseData = {
			attendCeremony,
			dietaryRestrictions,
			groupId,
			isComplete: true,
			needsAccommodation,
			needsDirections: null, // DEPRECATED
			needsTransportAfter,
			transportDestination,
			respondedBy: guestId,
			updatedAt: new Date(),
			willAttend,
		};

		if (existingResponse) {
			// Update existing response
			await db
				.update(guestGroupResponses)
				.set(responseData)
				.where(eq(guestGroupResponses.groupId, groupId));

			console.log("RSVP updated successfully for group:", groupId);
		} else {
			// Insert new response
			await db.insert(guestGroupResponses).values({
				...responseData,
				createdAt: new Date(),
			});

			console.log("RSVP created successfully for group:", groupId);
		}

		// Determine final conversation state based on attendance
		const finalConversationState = willAttend ? "completed" : "declined";

		return {
			message: "", // Empty - AI will provide friendly message in same response
			stateUpdate: {
				conversationState: finalConversationState,
				rsvpComplete: true,
				rsvpData: {
					willAttend,
					attendCeremony,
					dietaryRestrictions,
					needsAccommodation,
					needsTransportAfter,
					transportDestination,
				},
			},
			success: true,
			type: "update-rsvp",
		};
	},

	inputSchema: UpdateRsvpInputSchema,
	outputSchema: UpdateRsvpOutputSchema,
});
