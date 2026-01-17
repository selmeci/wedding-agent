/**
 * Guest group seed data
 * Groups of guests who share one QR code (families, couples with +1)
 *
 * Each group will receive ONE QR code for all members
 * The QR code should link to: https://yourdomain.com/?token={qrToken}
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
				about: "Otec rodiny. Nemá rád chees cake. Je z Novej Dedinky",
				email: "",
				firstName: "Marek",
				lastName: "Šelméci",
				phone: "",
				relationship: "brat ženícha",
			},
			{
				about:
					"Mama rodiny. Preferuje zdravšie ale chutné jedlo. Je z Novej Dedinky",
				email: "",
				firstName: "Katka",
				lastName: "Šelméciová",
				phone: "",
				relationship: "žena brata ženícha",
			},
			{
				about: "Syn, 14 rokov. Objavuje nové chute. Je z Novej Dedinky",
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
					"Mama ženícha. Má rada klasické slovenské jedlá. Je z Novej Dedinky",
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
					"Krstný. Má zaujímave pohľady na svet a užíva si dôchodok. Je z Hamuliakova",
				email: "",
				firstName: "Krstný Roman",
				lastName: "Jablonický",
				phone: "",
				relationship: "krstný ženicha",
			},
			{
				about: "Alenka. Je z Hamuliakova.",
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
				about: "Kamarát z posilovne. Má rad steak a cvičenie. Je z Bratislavy.",
				email: "",
				firstName: "Braňo",
				lastName: "Lanči",
				phone: "",
				relationship: "kamarát ženícha",
			},
			{
				about: "Kika. Je z Bratislavy.",
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
					"Kamarát z vysokej školy. Momentálne na diete, ale inak si rád pochutná na nezdravom. Je z Bratislavy.",
				email: "",
				firstName: "Tomáš",
				lastName: "Kučečka",
				phone: "",
				relationship: "kamarát ženicha",
			},
			{
				about: "Žena Tomáša. Má rada zdravé jedlo. Je z Bratislavy.",
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
				about: "Mama. Je z mesta Modra.",
				email: "",
				firstName: "Mama",
				lastName: "",
				phone: "",
				relationship: "rodina nevesty",
			},
			{
				about: "Otec – bezmliečne. Je z mesta Modra.",
				email: "",
				firstName: "Otec",
				lastName: "",
				phone: "",
				relationship: "rodina nevesty",
			},
			{
				about:
					"Ľubka – bezpleková, bezmliečna, špeciálne menu (kuracie na prírodno, ryža/zemiaky, šalát). Je z mesta Modra.",
				email: "",
				firstName: "Ľubka",
				lastName: "",
				phone: "",
				relationship: "rodina nevesty",
			},
		],
	},
	{
		group: {
			name: "Ujo Peťo a teta Miladka",
			qrToken: "6",
		},
		guests: [
			{
				about: "Ujo Peťo. Z Častej, treba sa pýtať na dopravu.",
				email: "",
				firstName: "Ujo Peťo",
				lastName: "",
				phone: "",
				relationship: "rodina nevesty",
			},
			{
				about: "Teta Miladka. Z Častej, treba sa pýtať na dopravu.",
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
			name: "Teta Anka a ujo Pišta",
			qrToken: "16",
		},
		guests: [
			{
				about: "Teta Anka. Z Pezinka, treba sa spýtať na dopravu.",
				email: "",
				firstName: "Teta Anka",
				lastName: "",
				phone: "",
				relationship: "rodina nevesty",
			},
			{
				about: "Ujo Pišta. Z Pezinka, treba sa spýtať na dopravu.",
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
				about:
					"Zuzka – vegetarián. Z Modry, doprava ani ubytovanie nie je potrebná.",
				email: "",
				firstName: "Zuzka",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
			{
				about: "Baška. Z Modry, doprava ani ubytovanie nie je potrebná.",
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
				about: "Zuzka. Z Modry, doprava ani ubytovanie nie je potrebná.",
				email: "",
				firstName: "Zuzka",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
			{
				about: "Miško. Z Modry, doprava ani ubytovanie nie je potrebná.",
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
			name: "Bea a Matúš",
			qrToken: "5",
		},
		guests: [
			{
				about: "Bea. Z Bratislavy, spýtať sa na dopravu/ubytovanie v Modre.",
				email: "",
				firstName: "Bea",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
			{
				about: "Matúš. Z Bratislavy, spýtať sa na dopravu/ubytovanie v Modre.",
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
			name: "Peťka a Vladko",
			qrToken: "15",
		},
		guests: [
			{
				about: "Peťka. Z Preselian, odporučiť ubytovanie v Modre.",
				email: "",
				firstName: "Peťka",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
			{
				about: "Vladko. Z Preselian, odporučiť ubytovanie v Modre.",
				email: "",
				firstName: "Vladko",
				lastName: "",
				phone: "",
				relationship: "priatelia nevesty",
			},
		],
	},
];
