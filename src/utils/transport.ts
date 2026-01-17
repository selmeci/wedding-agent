/**
 * Transport eligibility utilities
 *
 * Shared logic for determining transport eligibility based on guest's city.
 */

export const ALLOWED_TRANSPORT_CITIES = [
	"Bratislava",
	"Pezinok",
	"Senec",
	"Nová Dedinka",
	"Svätý Jur",
	"Vinosady",
	"Hamuliakovo",
	"Častá",
] as const;

export type AllowedTransportCity = (typeof ALLOWED_TRANSPORT_CITIES)[number];

/**
 * Extract city from guest's 'about' field
 *
 * Parses normalized format: "... Mesto: [city name]."
 * The city is expected in nominative case (1. pád) to avoid Slovak grammatical case issues.
 *
 * @returns The city name if found in ALLOWED_TRANSPORT_CITIES, null otherwise
 */
export function extractCity(about: string | null): string | null {
	if (!about) return null;

	// Parse normalized format "Mesto: [value]."
	const mestoMatch = about.match(/Mesto:\s*([^.]+)\./i);
	if (!mestoMatch) return null;

	const cityFromAbout = mestoMatch[1].trim();

	// Check if extracted city is in allowed list (case-insensitive)
	for (const allowedCity of ALLOWED_TRANSPORT_CITIES) {
		if (cityFromAbout.toLowerCase() === allowedCity.toLowerCase()) {
			return allowedCity; // Return the canonical city name
		}
	}

	// City found but not in allowed list - return null (no transport offer)
	return null;
}

/**
 * Check if any guest in the group is from an eligible transport city
 *
 * @param guests - Array of guests with 'about' field
 * @returns Object with eligibility info and the city if eligible
 */
export function checkTransportEligibility(
	guests: Array<{ about: string | null }>,
): {
	isEligible: boolean;
	city: string | null;
} {
	const cities = guests
		.map((g) => extractCity(g.about))
		.filter((c): c is string => c !== null);

	const uniqueCities = [...new Set(cities)];

	return {
		isEligible: uniqueCities.length > 0,
		city: uniqueCities[0] || null,
	};
}
