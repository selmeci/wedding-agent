import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import { match } from "ts-pattern";
import { createWorkersAI } from "workers-ai-provider";
import type {
	ConversationState,
	TaskType,
} from "@/agents/wedding-assistent/types";

/**
 * Select appropriate Workers AI model based on task type
 *
 * Model choices:
 * - llama-3.1-8b-instruct: Fast, balanced for general chat
 * - llama-3.3-70b-instruct-fp8-fast: Strong reasoning for complex identification
 * - hermes-2-pro-mistral-7b: Optimized for function calling
 */
export function getModelForTask(task: TaskType, env: Env): LanguageModel {
	const workersAi = createWorkersAI({ binding: env.AI });

	return match(task)
		.with("chat_general", () => openai("gpt-5-mini"))
		.with("identification", () => openai("gpt-5-mini"))
		.with("rsvp_collection", () =>
			workersAi("@hf/nousresearch/hermes-2-pro-mistral-7b"),
		)
		.with("information_provision", () => openai("gpt-5-mini"))
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
		.with(
			"group_welcome",
			"identifying_individual",
			() => "identification" as const,
		)
		.with("collecting_rsvp", () => "rsvp_collection" as const)
		.with("completed", () => "chat_general" as const)
		.with("identification_failed", () => "information_provision" as const)
		.with("identified", () =>
			// If identified but RSVP not complete, collect RSVP
			rsvpComplete ? ("chat_general" as const) : ("rsvp_collection" as const),
		)
		.with("initializing", () => "chat_general" as const)
		.exhaustive();
}
