export { confirmAttendanceTool } from "./confirmAttendance";
export { confirmIdentityTool } from "./confirmIdentity";
export { getIdentificationContextTool } from "./getIdentificationContext";
export { updateRsvpTool } from "./updateRsvp";
// export { getRsvpStatusTool } from './getRsvpStatus'; // To be implemented

// General information tools
export { getWeddingInfoTool } from "./getWeddingInfo";

/**
 * Implementation of confirmation-required tools
 * This object contains the actual logic for tools that need human approval
 * Each function here corresponds to a tool above that doesn't have an execute function
 */
export const executions = {};
