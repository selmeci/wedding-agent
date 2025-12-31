import type { Database } from "@/db";

/**
 * Fetch all RSVP responses and format them as markdown for AI analysis
 *
 * Returns detailed markdown with:
 * 1. Summary statistics
 * 2. Group-level RSVP table
 * 3. Detailed guest list with dietary info (for "who has allergies?" queries)
 * 4. Transport requests breakdown
 * 5. Accommodation needs
 */
export async function fetchRsvpSummary(db: Database): Promise<string> {
	// Fetch all guest groups with their guests and responses
	const allGroups = await db.query.guestGroups.findMany({
		with: {
			guests: true,
			responses: true,
		},
	});

	// Separate into responded and non-responded
	const respondedGroups = allGroups.filter((g) => g.responses.length > 0);
	const nonRespondedGroups = allGroups.filter((g) => g.responses.length === 0);

	// Calculate statistics
	const totalGroups = allGroups.length;
	const totalGuests = allGroups.reduce((sum, g) => sum + g.guests.length, 0);
	const confirmedGroups = respondedGroups.filter(
		(g) => g.responses[0]?.willAttend === true,
	);
	const declinedGroups = respondedGroups.filter(
		(g) => g.responses[0]?.willAttend === false,
	);
	const confirmedGuestsCount = confirmedGroups.reduce(
		(sum, g) => sum + g.guests.length,
		0,
	);
	const declinedGuestsCount = declinedGroups.reduce(
		(sum, g) => sum + g.guests.length,
		0,
	);

	// Build markdown sections
	let markdown = "";

	// 1. SUMMARY STATISTICS
	markdown += "## 📊 ŠTATISTIKY ÚČASTI\n\n";
	markdown += `**Skupiny celkom:** ${totalGroups}\n`;
	markdown += `**Hostia celkom:** ${totalGuests}\n\n`;
	markdown += `**Potvrdené skupiny:** ${confirmedGroups.length} (${Math.round((confirmedGroups.length / totalGroups) * 100)}%)\n`;
	markdown += `**Potvrdení hostia:** ${confirmedGuestsCount} (${Math.round((confirmedGuestsCount / totalGuests) * 100)}%)\n\n`;
	markdown += `**Odmietli účasť:** ${declinedGroups.length} skupín (${declinedGuestsCount} hostí)\n`;
	markdown += `**Neodpovedali:** ${nonRespondedGroups.length} skupín (${nonRespondedGroups.reduce((sum, g) => sum + g.guests.length, 0)} hostí)\n\n`;
	markdown += "---\n\n";

	// 2. CONFIRMED GROUPS TABLE
	if (confirmedGroups.length > 0) {
		markdown += "## ✅ POTVRDENÉ SKUPINY\n\n";
		markdown +=
			"| Skupina | Členovia | Diétne požiadavky | Odvoz | Ubytovanie |\n";
		markdown +=
			"|---------|----------|-------------------|-------|------------|\n";

		for (const group of confirmedGroups) {
			const response = group.responses[0];
			const memberNames = group.guests.map((g) => g.firstName).join(", ");
			const dietary = response.dietaryRestrictions || "Žiadne";
			const transport = response.needsTransportAfter
				? `→ ${response.transportDestination || "?"}`
				: "Nie";
			const accommodation = response.needsAccommodation ? "✓ Áno" : "Nie";

			markdown += `| ${group.name} | ${memberNames} | ${dietary} | ${transport} | ${accommodation} |\n`;
		}

		markdown += "\n---\n\n";
	}

	// 3. DETAILED GUEST LIST WITH DIETARY INFO
	markdown += "## 👥 DETAILNÝ ZOZNAM HOSTÍ (potvrdené skupiny)\n\n";
	markdown +=
		"Pre každého hosťa: Info z databázy + potvrdené RSVP diétne požiadavky\n\n";

	for (const group of confirmedGroups) {
		const response = group.responses[0];
		markdown += `### ${group.name}\n\n`;

		for (const guest of group.guests) {
			markdown += `- **${guest.firstName} ${guest.lastName}**\n`;
			if (guest.about) {
				markdown += `  - Info z DB: ${guest.about}\n`;
			}
			if (response.dietaryRestrictions) {
				// Try to find this guest's name in dietary restrictions
				const guestDiet = extractGuestDiet(
					guest.firstName,
					response.dietaryRestrictions,
				);
				if (guestDiet) {
					markdown += `  - RSVP diétne: ${guestDiet}\n`;
				}
			}
		}

		markdown += "\n";
	}

	markdown += "---\n\n";

	// 4. TRANSPORT REQUESTS
	const transportRequests = confirmedGroups.filter(
		(g) => g.responses[0]?.needsTransportAfter === true,
	);
	if (transportRequests.length > 0) {
		markdown += "## 🚗 POŽIADAVKY NA ODVOZ\n\n";

		// Group by destination
		const byDestination: Record<string, string[]> = {};
		for (const group of transportRequests) {
			const dest = group.responses[0]?.transportDestination || "Neuvedené";
			if (!byDestination[dest]) byDestination[dest] = [];
			byDestination[dest].push(
				`${group.name} (${group.guests.length} ${group.guests.length === 1 ? "hosť" : group.guests.length < 5 ? "hostia" : "hostí"})`,
			);
		}

		for (const [dest, groups] of Object.entries(byDestination)) {
			const totalPeople = transportRequests
				.filter((g) => g.responses[0]?.transportDestination === dest)
				.reduce((sum, g) => sum + g.guests.length, 0);
			markdown += `**${dest}** (${totalPeople} ${totalPeople === 1 ? "osoba" : totalPeople < 5 ? "osoby" : "osôb"})\n`;
			for (const groupName of groups) {
				markdown += `- ${groupName}\n`;
			}
			markdown += "\n";
		}

		markdown += "---\n\n";
	}

	// 5. ACCOMMODATION NEEDS
	const accommodationNeeds = confirmedGroups.filter(
		(g) => g.responses[0]?.needsAccommodation === true,
	);
	if (accommodationNeeds.length > 0) {
		markdown += "## 🏨 POTREBA UBYTOVANIE\n\n";
		for (const group of accommodationNeeds) {
			markdown += `- ${group.name} (${group.guests.length} ${group.guests.length === 1 ? "osoba" : group.guests.length < 5 ? "osoby" : "osôb"})\n`;
		}
		markdown += "\n---\n\n";
	}

	// 6. DECLINED GROUPS
	if (declinedGroups.length > 0) {
		markdown += "## ❌ ODMIETLI ÚČASŤ\n\n";
		for (const group of declinedGroups) {
			const memberNames = group.guests.map((g) => g.firstName).join(", ");
			markdown += `- ${group.name}: ${memberNames} (${group.guests.length} ${group.guests.length === 1 ? "osoba" : group.guests.length < 5 ? "osoby" : "osôb"})\n`;
		}
		markdown += "\n---\n\n";
	}

	// 7. NON-RESPONDED GROUPS
	if (nonRespondedGroups.length > 0) {
		markdown += "## ⏳ NEODPOVEDALI\n\n";
		for (const group of nonRespondedGroups) {
			const memberNames = group.guests.map((g) => g.firstName).join(", ");
			markdown += `- ${group.name}: ${memberNames} (${group.guests.length} ${group.guests.length === 1 ? "osoba" : group.guests.length < 5 ? "osoby" : "osôb"})\n`;
		}
		markdown += "\n";
	}

	return markdown;
}

/**
 * Helper: Extract dietary info for specific guest from RSVP string
 * E.g., "Marek - bezlepkový, Katka - vegetariánka" → for "Marek" returns "bezlepkový"
 */
function extractGuestDiet(
	guestFirstName: string,
	dietaryRestrictions: string,
): string | null {
	// Parse format: "Name1 - restriction1, Name2 - restriction2"
	const parts = dietaryRestrictions.split(",");

	for (const part of parts) {
		const match = part.trim().match(/^(.+?)\s*-\s*(.+)$/);
		if (match) {
			const [, name, restriction] = match;
			if (name.trim().toLowerCase() === guestFirstName.toLowerCase()) {
				return restriction.trim();
			}
		}
	}

	// If no name match, might be single person format (no name prefix)
	// E.g., "vegetarián" instead of "Marek - vegetarián"
	if (!dietaryRestrictions.includes("-")) {
		return dietaryRestrictions.trim();
	}

	return null;
}
