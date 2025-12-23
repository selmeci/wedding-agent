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
 * Update RSVP Tool
 *
 * Called by AI after collecting all required RSVP information from guest.
 * Stores the response in guest_group_responses table.
 *
 * Business rules:
 * - attendCeremony MUST be true if willAttend is true
 * - If willAttend is false, all other fields should be null
 * - For groups: dietaryRestrictions formatted as "Name1 - restriction, Name2 - restriction"
 */
export const updateRsvpTool = tool<UpdateRsvpInput, UpdateRsvpOutput>({
	description: `Update RSVP response for the identified guest/group.

  Collect these fields through natural conversation:
  - willAttend: Did they confirm attendance?
  - dietaryRestrictions: Any dietary needs? (check 'about' field in guest list for pre-filled info)
  - needsTransportAfter: Do they want organized transport after celebration to Bratislava?
  - needsAccommodation: Do they need accommodation info? (SKIP if from Modra OR has transport interest)

  Rules:
  - attendCeremony is ALWAYS true if willAttend is true (guests cannot attend only reception)
  - If willAttend is false, set dietaryRestrictions, needsTransportAfter, needsAccommodation to null
  - For groups: format dietaryRestrictions as "Name1 - restriction, Name2 - restriction"
  `,

	execute: async ({
		willAttend,
		attendCeremony,
		dietaryRestrictions,
		needsTransportAfter,
		needsAccommodation,
	}) => {
		console.log("Updating RSVP...", {
			attendCeremony,
			dietaryRestrictions,
			needsAccommodation,
			needsTransportAfter,
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
			},
			success: true,
			type: "update-rsvp",
		};
	},

	inputSchema: UpdateRsvpInputSchema,
	outputSchema: UpdateRsvpOutputSchema,
});
