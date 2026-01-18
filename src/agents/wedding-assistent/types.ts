import { z } from "zod";
import type { Guest } from "@/db";

/**
 * Simplified conversation states
 *
 * Only 3 states needed:
 * - collecting: RSVP in progress (includes initial greeting, questions, everything before save)
 * - completed: RSVP done, guest will attend
 * - declined: RSVP done, guest won't attend
 */
export const ConversationStateSchema = z.enum([
	"collecting",
	"completed",
	"declined",
] as const);

export type ConversationState = z.infer<typeof ConversationStateSchema>;

/**
 * Simplified agent state
 *
 * Only essential fields:
 * - groupId: identifies which group of guests (from QR code)
 * - conversationState: current phase
 *
 * Removed:
 * - guestId: not needed, AI uses names from context for addressing
 * - identificationAttempts: no formal identification
 * - rsvpComplete: implied by conversationState
 * - rsvpData: stored directly in DB, not in state
 */
export interface WeddingAgentState {
	groupId: string | null;
	conversationState: ConversationState;
}

/**
 * Group context information loaded from D1
 */
export interface GroupInfo {
	groupId: string | null;
	groupName: string;
	isFromModra: boolean;
	guestNames: string[];
	guests: Array<Guest>;
}
