/**
 * Simplified tool exports
 *
 * Only 4 tools needed:
 * - saveRsvp: Atomic RSVP storage
 * - getAccommodationInfo: Hotel information
 * - sendMessageToCouple: Message to wedding couple
 * - newsletterSubscription: Subscribe/unsubscribe to updates
 */

import { getAccommodationInfoTool } from "./getAccommodationInfo";
import { newsletterSubscriptionTool } from "./newsletterSubscription";
import { saveRsvpTool } from "./saveRsvp";
import { sendMessageToCoupleTool } from "./sendMessageToCouple";

export { getAccommodationInfoTool } from "./getAccommodationInfo";
export { newsletterSubscriptionTool } from "./newsletterSubscription";
export { saveRsvpTool } from "./saveRsvp";
export { sendMessageToCoupleTool } from "./sendMessageToCouple";

/**
 * Tool executions for confirmation-required tools
 * Currently empty - all tools auto-execute
 */
export const executions = {};

/**
 * All available tools
 */
export const tools = {
	getAccommodationInfo: getAccommodationInfoTool,
	newsletterSubscription: newsletterSubscriptionTool,
	saveRsvp: saveRsvpTool,
	sendMessageToCouple: sendMessageToCoupleTool,
};
