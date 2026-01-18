import { getCurrentAgent } from "agents";
import { tool } from "ai";
import { eq } from "drizzle-orm";
import type { Chat } from "@/agents";
import { guestGroupResponses } from "@/db";
import {
	type SaveRsvpInput,
	SaveRsvpInputSchema,
	type SaveRsvpOutput,
	SaveRsvpOutputSchema,
} from "@/tools/types";

/**
 * Eligible cities for transport offer
 * Guests from these cities can be offered post-celebration transport
 */
const ELIGIBLE_TRANSPORT_CITIES = [
	"Bratislava",
	"Pezinok",
	"Senec",
	"Nová Dedinka",
	"Svätý Jur",
	"Vinosady",
	"Kalinkovo",
	"Častá",
] as const;

/**
 * Extract city from guest's 'about' field
 * Parses format: "... Mesto: [city name]."
 */
function extractCity(about: string | null): string | null {
	if (!about) return null;

	const mestoMatch = about.match(/Mesto:\s*([^.]+)\./i);
	if (!mestoMatch) return null;

	const cityFromAbout = mestoMatch[1].trim();

	for (const allowedCity of ELIGIBLE_TRANSPORT_CITIES) {
		if (cityFromAbout.toLowerCase() === allowedCity.toLowerCase()) {
			return allowedCity;
		}
	}

	return null;
}

/**
 * Save RSVP Tool - Atomic RSVP storage
 *
 * Single tool for saving complete RSVP response. Replaces fragmented
 * saveDietary, saveTransport, saveAccommodation, updateRsvp tools.
 *
 * Features:
 * - Atomic save: all data in one call
 * - Context-aware validation: checks isFromModra and eligible cities
 * - Upsert: works for both new and existing responses
 * - Hint system: returns hints if required data is missing
 */
export const saveRsvpTool = tool<SaveRsvpInput, SaveRsvpOutput>({
	description: `Save RSVP response to database. Call this when you have collected all required information.

REQUIRED DATA:
- willAttend: Always required (true/false)
- dietaryRestrictions: Required if willAttend=true (can be null for "no restrictions")
- needsTransportAfter: Required if willAttend=true AND guest is from eligible city AND not from Modra
- transportDestination: Required if needsTransportAfter=true

WHEN TO CALL:
- After guest confirms they WILL attend and you've asked about dietary restrictions and transport (if applicable)
- Immediately after guest confirms they WON'T attend (no other data needed)

The tool validates that all required data is present based on guest context.
If data is missing, it returns a hint telling you what to ask next.`,

	execute: async ({
		willAttend,
		dietaryRestrictions,
		needsTransportAfter,
		transportDestination,
	}) => {
		console.log("Saving RSVP...", {
			dietaryRestrictions,
			needsTransportAfter,
			transportDestination,
			willAttend,
		});

		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const db = agent.getDatabase();
		const { groupId } = agent.state;

		if (!groupId) {
			return {
				error: "No group context. Guest must access via QR code.",
				success: false,
				type: "save-rsvp",
			};
		}

		// Load group context for validation
		const groupWithGuests = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.id, groupId),
			with: { guests: true },
		});

		if (!groupWithGuests) {
			return {
				error: "Group not found",
				success: false,
				type: "save-rsvp",
			};
		}

		const isFromModra = groupWithGuests.isFromModra ?? false;

		// Check if any guest has eligible transport city
		const eligibleCities = groupWithGuests.guests
			.map((g) => extractCity(g.about))
			.filter((c): c is string => c !== null);
		const hasEligibleCity = eligibleCities.length > 0;
		const primaryCity = eligibleCities[0] ?? null;

		// === VALIDATION ===

		// Get first guest ID to use as respondedBy (required by schema)
		const firstGuestId = groupWithGuests.guests[0]?.id ?? null;

		// If not attending, save immediately with minimal data
		if (!willAttend) {
			return await saveToDatabase(db, groupId, firstGuestId, {
				willAttend: false,
				attendCeremony: false,
				dietaryRestrictions: null,
				needsTransportAfter: null,
				transportDestination: null,
			});
		}

		// Guest is attending - validate required fields

		// Check dietary (required for attending guests, but null is valid = "no restrictions")
		if (dietaryRestrictions === undefined) {
			return {
				hint: "Opýtaj sa hosťa na diétne obmedzenia alebo alergie.",
				missingField: "dietaryRestrictions",
				success: false,
				type: "save-rsvp",
			};
		}

		// Check transport (required only if: attending + not from Modra + has eligible city)
		if (!isFromModra && hasEligibleCity && needsTransportAfter === undefined) {
			return {
				hint: `Hosť je z mesta ${primaryCity}. Opýtaj sa na záujem o spoločný odvoz po oslave.`,
				missingField: "needsTransportAfter",
				success: false,
				type: "save-rsvp",
			};
		}

		// If needs transport, destination is required
		if (needsTransportAfter && !transportDestination) {
			return {
				hint: "Hosť má záujem o odvoz. Potvrď cieľovú destináciu.",
				missingField: "transportDestination",
				success: false,
				type: "save-rsvp",
			};
		}

		// All validation passed - save to database
		return await saveToDatabase(db, groupId, firstGuestId, {
			willAttend: true,
			attendCeremony: true,
			dietaryRestrictions: dietaryRestrictions ?? null,
			needsTransportAfter: needsTransportAfter ?? null,
			transportDestination: transportDestination ?? null,
		});
	},

	inputSchema: SaveRsvpInputSchema,
	outputSchema: SaveRsvpOutputSchema,
});

/**
 * Save RSVP data to database (upsert)
 */
async function saveToDatabase(
	db: ReturnType<Chat["getDatabase"]>,
	groupId: string,
	respondedBy: string | null,
	data: {
		willAttend: boolean;
		attendCeremony: boolean;
		dietaryRestrictions: string | null;
		needsTransportAfter: boolean | null;
		transportDestination: string | null;
	},
): Promise<SaveRsvpOutput> {
	// Check if response already exists
	const existingResponse = await db.query.guestGroupResponses.findFirst({
		where: (t, { eq }) => eq(t.groupId, groupId),
	});

	const responseData = {
		groupId,
		willAttend: data.willAttend,
		attendCeremony: data.attendCeremony,
		dietaryRestrictions: data.dietaryRestrictions,
		needsTransportAfter: data.needsTransportAfter,
		transportDestination: data.transportDestination,
		needsAccommodation: null, // Not collected in simplified flow
		needsDirections: null, // DEPRECATED
		isComplete: true,
		updatedAt: new Date(),
	};

	if (existingResponse) {
		await db
			.update(guestGroupResponses)
			.set(responseData)
			.where(eq(guestGroupResponses.groupId, groupId));

		console.log("RSVP updated successfully for group:", groupId);
	} else {
		// respondedBy is required by schema - use first guest ID
		if (!respondedBy) {
			return {
				error: "No guest found in group to set as responder",
				success: false,
				type: "save-rsvp",
			};
		}

		await db.insert(guestGroupResponses).values({
			...responseData,
			respondedBy,
			createdAt: new Date(),
		});

		console.log("RSVP created successfully for group:", groupId);
	}

	const finalState = data.willAttend ? "completed" : "declined";

	return {
		message: data.willAttend
			? "RSVP uložené. Hosť príde na svadbu."
			: "RSVP uložené. Hosť nepríde na svadbu.",
		stateUpdate: {
			conversationState: finalState,
		},
		success: true,
		type: "save-rsvp",
		willAttend: data.willAttend,
	};
}
