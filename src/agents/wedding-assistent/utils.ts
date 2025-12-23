import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import { match } from "ts-pattern";
import type {
	ConversationState,
	TaskType,
} from "@/agents/wedding-assistent/types";

/**
 * Select appropriate Workers AI model based on task type
 *
 * Model choices:
 */
export function getModelForTask(task: TaskType, env: Env): LanguageModel {
	return match(task)
		.with("chat_general", () => openai("gpt-5"))
		.with("identification", () => openai("gpt-5"))
		.with("rsvp_collection", () => openai("gpt-5"))
		.with("information_provision", () => openai("gpt-5"))
		.exhaustive();
}

/**
 * Determine task type from conversation state
 */
export function determineTaskFromState(
	conversationState: ConversationState,
	rsvpComplete: boolean,
): TaskType {
	return match(conversationState)
		.with("identifying_individual", () => "identification" as const)
		.with("group_welcome", () => "identification" as const) // Identifying group member
		.with("confirming_attendance", () => "rsvp_collection" as const)
		.with("collecting_rsvp", () => "rsvp_collection" as const)
		.with("completed", "declined", () => "chat_general" as const)
		.with("identification_failed", () => "information_provision" as const)
		.with("identified", () =>
			// If identified but RSVP not complete, collect RSVP
			rsvpComplete ? ("chat_general" as const) : ("rsvp_collection" as const),
		)
		.with("initializing", () => "chat_general" as const)
		.exhaustive();
}
