import { confirmAttendanceTool } from "./confirmAttendance";
import { confirmIdentityTool } from "./confirmIdentity";
import { getAccommodationInfoTool } from "./getAccommodationInfo";
import { getIdentificationContextTool } from "./getIdentificationContext";
import { updateRsvpTool } from "./updateRsvp";

export { confirmAttendanceTool } from "./confirmAttendance";
export { confirmIdentityTool } from "./confirmIdentity";
export { getAccommodationInfoTool } from "./getAccommodationInfo";
export { getIdentificationContextTool } from "./getIdentificationContext";
export { updateRsvpTool } from "./updateRsvp";

/**
 * Implementation of confirmation-required tools
 * This object contains the actual logic for tools that need human approval
 * Each function here corresponds to a tool above that doesn't have an execute function
 */
export const executions = {};

export const tools = {
	confirmAttendanceTool,
	confirmIdentityTool,
	getAccommodationInfoTool,
	getIdentificationContextTool,
	updateRsvpTool,
};
