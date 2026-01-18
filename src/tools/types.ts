import { z } from "zod";

/**
 * Simplified tool type definitions
 *
 * Only 3 tools needed:
 * - saveRsvp: Atomic RSVP storage
 * - getAccommodationInfo: Hotel information
 * - sendMessageToCouple: Message to wedding couple
 */

// ===== GetAccommodationInfo =====

const AccommodationSchema = z.object({
	address: z.string(),
	contact: z.object({
		email: z.string().optional(),
		phone: z.string().optional(),
		website: z.string().optional(),
	}),
	distance: z.string(),
	features: z.array(z.string()),
	name: z.string(),
	notes: z.string().optional(),
	priceRange: z.string(),
});

export const GetAccommodationInfoInputSchema = z.object({});

export const GetAccommodationInfoOutputSchema = z.object({
	accommodations: z.array(AccommodationSchema),
	generalInfo: z.string(),
	type: z.literal("get-accommodation-info"),
});

export type GetAccommodationInfoInput = z.infer<
	typeof GetAccommodationInfoInputSchema
>;
export type GetAccommodationInfoOutput = z.infer<
	typeof GetAccommodationInfoOutputSchema
>;

// ===== SendMessageToCouple =====

export const SendMessageToCoupleInputSchema = z.object({
	message: z.string().min(1).max(1000),
});

export const SendMessageToCoupleOutputSuccessSchema = z.object({
	message: z.string(),
	success: z.literal(true),
	type: z.literal("send-message-to-couple"),
});

export const SendMessageToCoupleOutputFailureSchema = z.object({
	error: z.string(),
	success: z.literal(false),
	type: z.literal("send-message-to-couple"),
});

export const SendMessageToCoupleOutputSchema = z.discriminatedUnion("success", [
	SendMessageToCoupleOutputSuccessSchema,
	SendMessageToCoupleOutputFailureSchema,
]);

export type SendMessageToCoupleInput = z.infer<
	typeof SendMessageToCoupleInputSchema
>;
export type SendMessageToCoupleOutput = z.infer<
	typeof SendMessageToCoupleOutputSchema
>;

// ===== SaveRsvp =====

export const SaveRsvpInputSchema = z.object({
	willAttend: z.boolean(),
	dietaryRestrictions: z.string().nullable().optional(),
	needsTransportAfter: z.boolean().nullable().optional(),
	transportDestination: z.string().nullable().optional(),
});

const RsvpDataSchema = z.object({
	willAttend: z.boolean(),
	dietaryRestrictions: z.string().nullable(),
	needsTransportAfter: z.boolean().nullable(),
	transportDestination: z.string().nullable(),
});

export const SaveRsvpOutputSchema = z.object({
	type: z.literal("save-rsvp"),
	success: z.boolean(),
	// Success fields
	message: z.string().optional(),
	stateUpdate: z
		.object({
			conversationState: z.enum(["completed", "declined"]),
		})
		.optional(),
	willAttend: z.boolean().optional(),
	rsvpData: RsvpDataSchema.optional(),
	// Validation error fields
	hint: z.string().optional(),
	missingField: z.string().optional(),
	// Error field
	error: z.string().optional(),
});

export type SaveRsvpInput = z.infer<typeof SaveRsvpInputSchema>;
export type SaveRsvpOutput = z.infer<typeof SaveRsvpOutputSchema>;

// ===== Combined Outputs =====

export const OutputsSchema = z.discriminatedUnion("type", [
	GetAccommodationInfoOutputSchema,
	SendMessageToCoupleOutputSuccessSchema,
	SendMessageToCoupleOutputFailureSchema,
	SaveRsvpOutputSchema,
] as const);

export type Outputs = z.infer<typeof OutputsSchema>;
