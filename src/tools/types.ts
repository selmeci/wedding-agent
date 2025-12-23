import { z } from "zod";
import { ConversationStateSchema } from "@/agents/wedding-assistent/types";

export const ConfirmIdentityInputSchema = z.object({
	confidence: z.string(),
	guestId: z.uuid(),
	reasoning: z.string(),
});

export const ConfirmIdentityOutputSuccessSchema = z.object({
	guest: z.object({
		about: z.string().nullable(),
		firstName: z.string(),
		groupId: z.uuid(),
		groupName: z.string(),
		id: z.uuid(),
		isFromModra: z.boolean().nullable(),
		lastName: z.string(),
		relationship: z.string(),
	}),
	identificationLog: z.object({
		confidence: z.string(),
		guestId: z.uuid(),
		reasoning: z.string(),
		timestamp: z.number(),
	}),
	message: z.string(),
	stateUpdate: z.object({
		conversationState: ConversationStateSchema,
		groupId: z.uuid(),
		guestId: z.uuid(),
		identificationAttempts: z.number().int(),
	}),
	success: z.literal(true),
	type: z.literal("confirm-identity"),
});

export const ConfirmIdentityOutputFailureSchema = z.object({
	error: z.string(),
	success: z.literal(false),
	type: z.literal("confirm-identity"),
});

export const ConfirmIdentityOutputSchema = z.discriminatedUnion("success", [
	ConfirmIdentityOutputSuccessSchema,
	ConfirmIdentityOutputFailureSchema,
]);

const EventSchema = z.object({
	address: z.string(),
	description: z.string(),
	time: z.string(),
	venue: z.string(),
});

export const GetWeddingInfoInputSchema = z.object({});

export const GetWeddingInfoOutputSchema = z.object({
	ceremony: EventSchema,
	contact: z.object({
		bride: z.string(),
		groom: z.string(),
		message: z.string(),
	}),
	date: z.string(),
	dressCode: z.string(),
	gifts: z.object({
		details: z.string(),
		summary: z.string(),
	}),
	location: z.string(),
	parking: z.object({
		available: z.boolean(),
		location: z.string(),
	}),
	reception: EventSchema.extend({
		distance: z.string(),
	}),
	schedule: z.object({
		ceremony: z.string(),
		photos: z.string(),
		reception: z.string(),
	}),
	type: z.literal("get-wedding-info"),
});

export const IdentificationContextInputSchema = z.object({});

export const IdentificationContextOutputSchema = z.object({
	attemptsRemaining: z.number(),
	identificationAttempts: z.number(),
	maxAttempts: z.number(),
	maxAttemptsReached: z.boolean(),
	type: z.literal("identification-context"),
});

export const OutputsSchema = z.discriminatedUnion("type", [
	ConfirmIdentityOutputSchema,
	GetWeddingInfoOutputSchema,
	IdentificationContextOutputSchema,
] as const);

export type ConfirmIdentityInput = z.infer<typeof ConfirmIdentityInputSchema>;
export type ConfirmIdentityOutput = z.infer<typeof ConfirmIdentityOutputSchema>;

export type GetWeddingInfoInput = z.infer<typeof GetWeddingInfoInputSchema>;
export type GetWeddingInfoOutput = z.infer<typeof GetWeddingInfoOutputSchema>;

export type IdentificationContextInput = z.infer<
	typeof IdentificationContextInputSchema
>;
export type IdentificationContextOutput = z.infer<
	typeof IdentificationContextOutputSchema
>;

export type Outputs = z.infer<typeof OutputsSchema>;
