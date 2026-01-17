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

export const IdentificationContextInputSchema = z.object({});

export const IdentificationContextOutputSchema = z.object({
	attemptsRemaining: z.number(),
	identificationAttempts: z.number(),
	maxAttempts: z.number(),
	maxAttemptsReached: z.boolean(),
	type: z.literal("identification-context"),
});

export const ConfirmAttendanceInputSchema = z.object({
	guestId: z.string().optional(), // Optional: for single-guest flow where we skip confirmIdentity
	willAttend: z.boolean(),
});

export const ConfirmAttendanceOutputSuccessSchema = z.object({
	message: z.string(),
	stateUpdate: z.object({
		conversationState: ConversationStateSchema,
		rsvpData: z
			.object({
				attendCeremony: z.boolean().nullable(),
				dietaryRestrictions: z.string().nullable(),
				needsAccommodation: z.boolean().nullable(),
				needsTransportAfter: z.boolean().nullable(),
				transportDestination: z.string().nullable(),
				willAttend: z.boolean(),
			})
			.optional(),
	}),
	success: z.literal(true),
	type: z.literal("confirm-attendance"),
});

export const ConfirmAttendanceOutputFailureSchema = z.object({
	error: z.string(),
	success: z.literal(false),
	type: z.literal("confirm-attendance"),
});

export const ConfirmAttendanceOutputSchema = z.discriminatedUnion("success", [
	ConfirmAttendanceOutputSuccessSchema,
	ConfirmAttendanceOutputFailureSchema,
]);

export const UpdateRsvpInputSchema = z.object({
	attendCeremony: z.boolean().nullable(),
	dietaryRestrictions: z.string().nullable(),
	needsAccommodation: z.boolean().nullable(),
	needsTransportAfter: z.boolean().nullable(),
	transportDestination: z.string().nullable(),
	willAttend: z.boolean(),
});

export const UpdateRsvpOutputSuccessSchema = z.object({
	message: z.string(),
	stateUpdate: z.object({
		conversationState: ConversationStateSchema,
		rsvpComplete: z.boolean(),
		rsvpData: z.object({
			attendCeremony: z.boolean().nullable(),
			dietaryRestrictions: z.string().nullable(),
			needsAccommodation: z.boolean().nullable(),
			needsTransportAfter: z.boolean().nullable(),
			transportDestination: z.string().nullable(),
			willAttend: z.boolean(),
		}),
	}),
	success: z.literal(true),
	type: z.literal("update-rsvp"),
});

export const UpdateRsvpOutputFailureSchema = z.object({
	error: z.string(),
	success: z.literal(false),
	type: z.literal("update-rsvp"),
});

export const UpdateRsvpOutputSchema = z.discriminatedUnion("success", [
	UpdateRsvpOutputSuccessSchema,
	UpdateRsvpOutputFailureSchema,
]);

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

export const ChangeAttendanceDecisionInputSchema = z.object({
	newDecision: z.boolean(),
});

export const ChangeAttendanceDecisionOutputSuccessSchema = z.object({
	message: z.string(),
	stateUpdate: z.object({
		conversationState: ConversationStateSchema,
		rsvpComplete: z.boolean(),
		rsvpData: z.object({
			attendCeremony: z.boolean().nullable(),
			dietaryRestrictions: z.string().nullable(),
			needsAccommodation: z.boolean().nullable(),
			needsTransportAfter: z.boolean().nullable(),
			transportDestination: z.string().nullable(),
			willAttend: z.boolean(),
		}),
	}),
	success: z.literal(true),
	type: z.literal("change-attendance-decision"),
});

export const ChangeAttendanceDecisionOutputFailureSchema = z.object({
	error: z.string(),
	success: z.literal(false),
	type: z.literal("change-attendance-decision"),
});

export const ChangeAttendanceDecisionOutputSchema = z.discriminatedUnion(
	"success",
	[
		ChangeAttendanceDecisionOutputSuccessSchema,
		ChangeAttendanceDecisionOutputFailureSchema,
	],
);

// ===== RSVP SUB-STATE TOOLS =====

// SaveDietary - Step 1
export const SaveDietaryInputSchema = z.object({
	dietaryRestrictions: z.string().nullable(),
});

export const SaveDietaryOutputSuccessSchema = z.object({
	message: z.string(),
	stateUpdate: z.object({
		conversationState: ConversationStateSchema,
		rsvpData: z.object({
			dietaryRestrictions: z.string().nullable(),
		}),
	}),
	success: z.literal(true),
	type: z.literal("save-dietary"),
});

export const SaveDietaryOutputFailureSchema = z.object({
	error: z.string(),
	success: z.literal(false),
	type: z.literal("save-dietary"),
});

export const SaveDietaryOutputSchema = z.discriminatedUnion("success", [
	SaveDietaryOutputSuccessSchema,
	SaveDietaryOutputFailureSchema,
]);

// SaveTransport - Step 2
export const SaveTransportInputSchema = z.object({
	needsTransportAfter: z.boolean(),
	transportDestination: z.string().nullable(),
});

export const SaveTransportOutputSuccessSchema = z.object({
	message: z.string(),
	nextState: z.string(), // Can be 'collecting_accommodation' or 'completing_rsvp'
	stateUpdate: z.object({
		conversationState: ConversationStateSchema,
		rsvpData: z.object({
			needsTransportAfter: z.boolean(),
			transportDestination: z.string().nullable(),
		}),
	}),
	success: z.literal(true),
	type: z.literal("save-transport"),
});

export const SaveTransportOutputFailureSchema = z.object({
	error: z.string(),
	success: z.literal(false),
	type: z.literal("save-transport"),
});

export const SaveTransportOutputSchema = z.discriminatedUnion("success", [
	SaveTransportOutputSuccessSchema,
	SaveTransportOutputFailureSchema,
]);

// SaveAccommodation - Step 3 (conditional)
export const SaveAccommodationInputSchema = z.object({
	needsAccommodation: z.boolean(),
});

export const SaveAccommodationOutputSuccessSchema = z.object({
	message: z.string(),
	stateUpdate: z.object({
		conversationState: ConversationStateSchema,
		rsvpData: z.object({
			needsAccommodation: z.boolean(),
		}),
	}),
	success: z.literal(true),
	type: z.literal("save-accommodation"),
});

export const SaveAccommodationOutputFailureSchema = z.object({
	error: z.string(),
	success: z.literal(false),
	type: z.literal("save-accommodation"),
});

export const SaveAccommodationOutputSchema = z.discriminatedUnion("success", [
	SaveAccommodationOutputSuccessSchema,
	SaveAccommodationOutputFailureSchema,
]);

export const OutputsSchema = z.discriminatedUnion("type", [
	ConfirmIdentityOutputSchema,
	ConfirmAttendanceOutputSchema,
	GetAccommodationInfoOutputSchema,
	IdentificationContextOutputSchema,
	UpdateRsvpOutputSchema,
	ChangeAttendanceDecisionOutputSchema,
	SaveDietaryOutputSchema,
	SaveTransportOutputSchema,
	SaveAccommodationOutputSchema,
] as const);

export type ConfirmIdentityInput = z.infer<typeof ConfirmIdentityInputSchema>;
export type ConfirmIdentityOutput = z.infer<typeof ConfirmIdentityOutputSchema>;

export type ConfirmAttendanceInput = z.infer<
	typeof ConfirmAttendanceInputSchema
>;
export type ConfirmAttendanceOutput = z.infer<
	typeof ConfirmAttendanceOutputSchema
>;

export type IdentificationContextInput = z.infer<
	typeof IdentificationContextInputSchema
>;
export type IdentificationContextOutput = z.infer<
	typeof IdentificationContextOutputSchema
>;

export type UpdateRsvpInput = z.infer<typeof UpdateRsvpInputSchema>;
export type UpdateRsvpOutput = z.infer<typeof UpdateRsvpOutputSchema>;

export type GetAccommodationInfoInput = z.infer<
	typeof GetAccommodationInfoInputSchema
>;
export type GetAccommodationInfoOutput = z.infer<
	typeof GetAccommodationInfoOutputSchema
>;

export type ChangeAttendanceDecisionInput = z.infer<
	typeof ChangeAttendanceDecisionInputSchema
>;
export type ChangeAttendanceDecisionOutput = z.infer<
	typeof ChangeAttendanceDecisionOutputSchema
>;

export type SaveDietaryInput = z.infer<typeof SaveDietaryInputSchema>;
export type SaveDietaryOutput = z.infer<typeof SaveDietaryOutputSchema>;

export type SaveTransportInput = z.infer<typeof SaveTransportInputSchema>;
export type SaveTransportOutput = z.infer<typeof SaveTransportOutputSchema>;

export type SaveAccommodationInput = z.infer<
	typeof SaveAccommodationInputSchema
>;
export type SaveAccommodationOutput = z.infer<
	typeof SaveAccommodationOutputSchema
>;

export type Outputs = z.infer<typeof OutputsSchema>;
