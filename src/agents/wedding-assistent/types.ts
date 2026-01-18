import { z } from "zod";
import type { Guest } from "@/db";

export const ConversationStateSchema = z.enum([
	"initializing",
	"group_welcome",
	"identifying_individual",
	"identified",
	"confirming_attendance", // After identification, waiting for yes/no to attendance question
	// RSVP collection sub-states (ordered flow)
	"collecting_dietary", // Step 1: Ask about dietary restrictions
	"collecting_transport", // Step 2: Ask about transport after celebration
	"collecting_accommodation", // Step 3: Ask about accommodation (conditional)
	"completing_rsvp", // Step 4: Finalize and save RSVP
	"completed",
	"declined", // Guest declined attendance
	"identification_failed",
] as const);

/**
 * Conversation states for the wedding RSVP wedding-agent-ws
 */
export type ConversationState = z.infer<typeof ConversationStateSchema>;

/**
 * Task types for model selection
 */
export type TaskType =
	| "chat_general" // Friendly conversation after RSVP complete
	| "identification" // Guest identification reasoning
	| "rsvp_collection" // RSVP tool calling
	| "information_provision"; // Wedding info, Q&A for unidentified guests

/**
 * Agent state persisted across messages
 */
export interface WeddingAgentState {
	groupId: string | null;
	guestId: string | null;
	conversationState: ConversationState;
	identificationAttempts: number;
	rsvpComplete: boolean;
	// RSVP data for summary tab
	rsvpData?: {
		willAttend: boolean;
		attendCeremony: boolean | null;
		dietaryRestrictions: string | null;
		needsTransportAfter: boolean | null;
		transportDestination: string | null;
		needsAccommodation: boolean | null;
	};
}

/**
 * Group context information loaded from D1
 */
export interface GroupInfo {
	groupId: string | null; // Can be null for no-QR flow (all guests)
	groupName: string;
	isFromModra: boolean;
	guestNames: string[];
	guests: Array<Guest>;
}
