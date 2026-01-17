/**
 * Guest group seed data
 * Groups of guests who share one QR code (families, couples with +1)
 *
 * Each group will receive ONE QR code for all members
 * The QR code should link to: https://yourdomain.com/?token={qrToken}
 *
 * ## NORMALIZED 'about' FIELD FORMAT
 *
 * The 'about' field uses a structured format for reliable parsing:
 *
 * ```
 * [free text description]. Mesto: [city name]. Diéta: [dietary restriction].
 * ```
 *
 * - **Mesto:** (optional) City name in nominative case (1. pád)
 *   - Used for transport eligibility check
 *   - Allowed cities: Bratislava, Pezinok, Senec, Nová Dedinka, Svätý Jur, Vinosady
 *   - Cities NOT in allowed list won't be offered transport
 *
 * - **Diéta:** (optional) Dietary restrictions
 *   - Examples: vegetarián, vegán, bezlepkové, bezlaktózové, alergia na orechy
 *   - AI will personalize dietary question based on this info
 *
 * Examples:
 * - "Mama ženícha. Mesto: Nová Dedinka."
 * - "Kamarátka. Mesto: Bratislava. Diéta: vegetarián."
 * - "Sestra nevesty. Diéta: bezlepkové, bezlaktózové."
 * - "Priateľ zo školy." (no city = no transport offer, no dietary = generic question)
 */
import type { NewGuest, NewGuestGroup } from "@/db";

export interface GuestGroupSeed {
	group: Omit<NewGuestGroup, "id" | "createdAt">;
	guests: Omit<NewGuest, "id" | "createdAt" | "groupId">[];
}

export const guestGroupSeedData: GuestGroupSeed[] = [
	// Roman
	{
		group: {
			isFromModra: false,
			name: "Rodinka Šelméciových",
			qrToken: "2",
		},
		guests: [
			{
				about: "Otec rodiny, nemá rád cheesecake. Mesto: Nová Dedinka.",
				email: "",
				firstName: "Marek",
				lastName: "Šelméci",
				phone: "",
				relationship: "brat ženícha",
			},
			{
				about:
					"Mama rodiny, preferuje zdravšie ale chutné jedlo. Mesto: Nová Dedinka.",
				email: "",
				firstName: "Katka",
				lastName: "Šelméciová",
				phone: "",
				relationship: "žena brata ženícha",
			},
			{
				about: "Syn, 14 rokov, objavuje nové chute. Mesto: Nová Dedinka.",
				email: "",
				firstName: "Marko",
				lastName: "Šelméci",
				phone: "",
				relationship: "syn brata ženícha",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Mamka Ivetka",
			qrToken: "13",
		},
		guests: [
			{
				about:
					"Mama ženícha, má rada klasické slovenské jedlá. Mesto: Nová Dedinka.",
				email: "",
				firstName: "Mamka",
				lastName: "Šelmeciova",
				phone: "",
				relationship: "mama ženícha",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Krstný Roman a Alena",
			qrToken: "3",
		},
		guests: [
			{
				about:
					"Krstný, má zaujímavé pohľady na svet a užíva si dôchodok. Mesto: Kalinkovo.",
				email: "",
				firstName: "Krstný Roman",
				lastName: "Jablonický",
				phone: "",
				relationship: "krstný ženicha",
			},
			{
				about: "Alenka. Mesto: Kalinkovo.",
				email: "",
				firstName: "Alenka",
				lastName: "Kováčová",
				phone: "",
				relationship: "priatelia krstného ženicha",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Braňo a Kika",
			qrToken: "14",
		},
		guests: [
			{
				about:
					"Kamarát z posilňovne, má rád steak a cvičenie. Mesto: Bratislava.",
				email: "",
				firstName: "Braňo",
				lastName: "Lanči",
				phone: "",
				relationship: "kamarát ženícha",
			},
			{
				about: "Kika. Mesto: Bratislava.",
				email: "",
				firstName: "Kika",
				lastName: "",
				phone: "",
				relationship: "známa ženicha",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Kučečkovci",
			qrToken: "4",
		},
		guests: [
			{
				about:
					"Kamarát z vysokej školy, momentálne na diéte ale inak si rád pochutná na nezdravom. Mesto: Bratislava.",
				email: "",
				firstName: "Tomáš",
				lastName: "Kučečka",
				phone: "",
				relationship: "kamarát ženicha",
			},
			{
				about: "Žena Tomáša, má rada zdravé jedlo. Mesto: Bratislava.",
				email: "",
				firstName: "Peťa",
				lastName: "Kučečková",
				phone: "",
				relationship: "kamarát ženicha",
			},
		],
	},
	// Ivonka
	{
		group: {
			isFromModra: true,
			name: "Mama, otec, Ľubka",
			qrToken: "7",
		},
		guests: [
			{
				about: "Mama nevesty. Mesto: Modra.",
				email: "",
				firstName: "Mamina",
				lastName: "Hrdličková",
				phone: "",
				relationship: "rodina nevesty",
			},
			{
				about:
					"Otec nevesty. Zbožnuje klobásky. Mesto: Modra. Diéta: bezlaktózové, bezmliečne.",
				email: "",
				firstName: "Otec",
				lastName: "Hrdlička",
				phone: "",
				relationship: "rodina nevesty",
			},
			{
				about:
					"Sestra nevesty. Mesto: Modra. Diéta: bezlepkové, bezlaktózové, bezmliečne, špeciálne menu (kuracie na prírodno, ryža/zemiaky, šalát).",
				email: "",
				firstName: "Ľubka",
				lastName: "Hrdličková",
				phone: "",
				relationship: "rodina nevesty",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Ujo Peťko a teta Miladka",
			qrToken: "6",
		},
		guests: [
			{
				about: "Ujo Peťko. Mesto: Častá.",
				email: "",
				firstName: "Ujo Peťko",
				lastName: "",
				phone: "",
				relationship: "rodina nevesty",
			},
			{
				about: "Teta Miladka. Mesto: Častá.",
				email: "",
				firstName: "Teta Miladka",
				lastName: "",
				phone: "",
				relationship: "rodina nevesty",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Teta Anka a ujo Pišta",
			qrToken: "16",
		},
		guests: [
			{
				about: "Teta Anka. Mesto: Pezinok.",
				email: "",
				firstName: "Teta Anka",
				lastName: "",
				phone: "",
				relationship: "rodina nevesty",
			},
			{
				about: "Ujo Pišta. Mesto: Pezinok.",
				email: "",
				firstName: "Ujo Pišta",
				lastName: "",
				phone: "",
				relationship: "rodina nevesty",
			},
		],
	},
	{
		group: {
			isFromModra: true,
			name: "Zuzka a Baška",
			qrToken: "17",
		},
		guests: [
			{
				about: "Zuzka. Mesto: Modra. Diéta: vegetarián.",
				email: "",
				firstName: "Zuzka",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
			{
				about: "Baška. Mesto: Modra.",
				email: "",
				firstName: "Baška",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
		],
	},
	{
		group: {
			isFromModra: true,
			name: "Zuzka a Miško",
			qrToken: "18",
		},
		guests: [
			{
				about: "Zuzka. Mesto: Modra.",
				email: "",
				firstName: "Zuzka",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
			{
				about: "Miško. Mesto: Modra.",
				email: "",
				firstName: "Miško",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Beatka a Matúš",
			qrToken: "5",
		},
		guests: [
			{
				about: "Beatka. Mesto: Bratislava.",
				email: "",
				firstName: "Beatka",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
			{
				about: "Matúš. Mesto: Bratislava.",
				email: "",
				firstName: "Matúš",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Peťka a Vladko",
			qrToken: "15",
		},
		guests: [
			{
				about: "Peťka. Mesto: Preseľany.",
				email: "",
				firstName: "Peťka",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
			{
				about: "Vladko. Mesto: Preseľany.",
				email: "",
				firstName: "Vladko",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
		],
	},
	// Test account
	{
		group: {
			isFromModra: false,
			name: "Testovacia Skupina 1",
			qrToken: "test-1",
		},
		guests: [
			{
				about: "Testovací hosť 1. Mesto: Bratislava.",
				email: "test1@example.com",
				firstName: "Test",
				lastName: "Jeden",
				phone: "+421900111222",
				relationship: "test",
			},
		],
	},
	{
		group: {
			isFromModra: true,
			name: "Testovacia Skupina 2 (Modra)",
			qrToken: "test-2",
		},
		guests: [
			{
				about: "Testovací hosť 2. Mesto: Modra. Diéta: vegetarián.",
				email: "test2@example.com",
				firstName: "Test",
				lastName: "Dva",
				phone: "+421900333444",
				relationship: "test",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Testovacia Skupina 3 (Pár)",
			qrToken: "test-3",
		},
		guests: [
			{
				about: "Testovací hosť 3a. Mesto: Senec.",
				email: "test3a@example.com",
				firstName: "Test",
				lastName: "Tri-A",
				phone: "",
				relationship: "test",
			},
			{
				about: "Testovací hosť 3b. Mesto: Senec. Diéta: bezlepkové.",
				email: "test3b@example.com",
				firstName: "Test",
				lastName: "Tri-B",
				phone: "",
				relationship: "test",
			},
		],
	},
	{
		group: {
			isFromModra: false,
			name: "Testovacia Skupina 4",
			qrToken: "test-4",
		},
		guests: [
			{
				about: "Testovací hosť 4. Mesto: Pezinok.",
				email: "test4@example.com",
				firstName: "Test",
				lastName: "Štyri",
				phone: "",
				relationship: "test",
			},
		],
	},
	{
		group: {
			isFromModra: true,
			name: "Testovacia Skupina 5",
			qrToken: "test-5",
		},
		guests: [
			{
				about: "Testovací hosť 5. Mesto: Nová Dedinka.",
				email: "test5@example.com",
				firstName: "Test",
				lastName: "Päť",
				phone: "",
				relationship: "test",
			},
		],
	},
];
