import type { Guest } from "@/db";

/**
 * Conversation states for the wedding RSVP wedding-agent-ws
 */
export type ConversationState =
	| "initializing" // Agent is starting up
	| "group_welcome" // QR flow: greeting group, asking who's chatting
	| "identifying_individual" // No-QR flow: trying to identify guest
	| "identified" // Guest identified, ready for RSVP
	| "collecting_rsvp" // Collecting RSVP responses
	| "completed" // RSVP complete, general chat
	| "identification_failed"; // Failed to identify after 3 attempts

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
