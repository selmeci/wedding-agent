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
 * RSVP data for display in summary
 */
export interface RsvpData {
	willAttend: boolean;
	dietaryRestrictions: string | null;
	needsTransportAfter: boolean | null;
	transportDestination: string | null;
}

/**
 * Simplified agent state
 *
 * Essential fields:
 * - groupId: identifies which group of guests (from QR code)
 * - conversationState: current phase
 * - rsvpData: cached RSVP data for display (also stored in DB)
 */
export interface WeddingAgentState {
	groupId: string | null;
	conversationState: ConversationState;
	rsvpData: RsvpData | null;
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
