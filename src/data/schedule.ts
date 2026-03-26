export interface ScheduleItem {
	time: string;
	title: string;
	subtitle?: string;
	emoji: string;
}

export const weddingSchedule: ScheduleItem[] = [
	{
		time: "15:30",
		title: "Obrad",
		subtitle: "Sobášna sieň v Modre, Štúrova 59",
		emoji: "💍",
	},
	{
		time: "15:45",
		title: "Koniec obradu",
		emoji: "🎉",
	},
	{
		time: "15:45 – 16:15",
		title: "Gratulácie, fotenie",
		emoji: "📸",
	},
	{
		time: "16:15 – 16:20",
		title: "Presun hostí do Starého domu",
		subtitle: "Reštaurácia Starý Dom, Dukelská 2",
		emoji: "🚶",
	},
	{
		time: "16:20 – 16:25",
		title: "Privítanie personálom SD",
		emoji: "👋",
	},
	{
		time: "16:35 – 16:40",
		title: "Príhovor + prípitok",
		emoji: "🥂",
	},
	{
		time: "16:40 – 17:00",
		title: "Predjedlo",
		emoji: "🍽️",
	},
	{
		time: "17:00 – 17:45",
		title: "Roznášanie polievky a hlavného jedla",
		emoji: "🍲",
	},
	{
		time: "17:45",
		title: "Slané pečivo na stoly",
		subtitle: "po večeri, do košíčkov",
		emoji: "🥨",
	},
	{
		time: "18:15",
		title: "Svadobný tanec",
		emoji: "💃",
	},
	{
		time: "18:30",
		title: "Svadobná torta",
		emoji: "🎂",
	},
	{
		time: "18:30",
		title: "Zákusky na Candy bar",
		subtitle: "po torte",
		emoji: "🍬",
	},
	{
		time: "20:00",
		title: "Fotenie s prskavkami",
		emoji: "✨",
	},
	{
		time: "21:00",
		title: "Bufet",
		emoji: "🥗",
	},
	{
		time: "22:00",
		title: "Party",
		emoji: "🎶",
	},
	{
		time: "0:00",
		title: "Koniec",
		emoji: "🌙",
	},
];
