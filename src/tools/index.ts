// Phase 2: Identification tools
export { confirmIdentityTool } from "./confirmIdentity";
export { getIdentificationContextTool } from "./getIdentificationContext";

// Phase 3: RSVP tools (to be implemented)
// export { updateRsvpTool } from './updateRsvp';
// export { getRsvpStatusTool } from './getRsvpStatus';

// General information tools
export { getWeddingInfoTool } from "./getWeddingInfo";

/**
 * Implementation of confirmation-required tools
 * This object contains the actual logic for tools that need human approval
 * Each function here corresponds to a tool above that doesn't have an execute function
 */
export const executions = {};
