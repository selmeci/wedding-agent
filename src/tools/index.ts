/**
 * Simplified tool exports
 *
 * Only 3 tools needed:
 * - saveRsvp: Atomic RSVP storage
 * - getAccommodationInfo: Hotel information
 * - sendMessageToCouple: Message to wedding couple
 */

import { getAccommodationInfoTool } from "./getAccommodationInfo";
import { saveRsvpTool } from "./saveRsvp";
import { sendMessageToCoupleTool } from "./sendMessageToCouple";

export { getAccommodationInfoTool } from "./getAccommodationInfo";
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
	saveRsvp: saveRsvpTool,
	sendMessageToCouple: sendMessageToCoupleTool,
};
