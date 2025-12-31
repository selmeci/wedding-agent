import type { Connection } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	type StreamTextOnFinishCallback,
	stepCountIs,
	streamText,
	type ToolSet,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { buildReportSystemPrompt } from "@/agents/report/system-prompt";
import type { ReportAgentState } from "@/agents/report/types";
import { createDb, type Database } from "@/db";
import { fetchRsvpSummary } from "@/db/queries/rsvp-summary";
import { cleanupMessages } from "@/utils";

/**
 * Report Agent - RSVP Analytics & Reporting
 *
 * Purpose: Analyze RSVP data and answer organizational questions
 * Strategy: Data-in-prompt (no tools needed)
 * Access: Token-protected (only wedding organizers)
 *
 * Key features:
 * - Loads fresh RSVP data on each message
 * - AI reasoning for ad-hoc questions
 * - Markdown formatted responses
 * - Message history for follow-up questions
 */
export class ReportAgent extends AIChatAgent<Env, ReportAgentState> {
	private db: Database | null = null;

	initialState: ReportAgentState = {};

	getDatabase(): Database {
		if (!this.db) {
			this.db = createDb(this.env.DB);
		}

		return this.db;
	}

	/**
	 * Handle incoming questions about RSVP data
	 */
	async onChatMessage(
		onFinish: StreamTextOnFinishCallback<ToolSet>,
		_options?: { abortSignal?: AbortSignal },
	) {
		if (this.messages.length === 1) {
			return;
		}

		console.log("ReportAgent: Processing query");

		// 1. Load FRESH RSVP data from database
		const db = this.getDatabase();
		const rsvpData = await fetchRsvpSummary(db);

		console.log("ReportAgent: RSVP data loaded, length:", rsvpData.length);

		// 2. Build system prompt with embedded data
		const system = buildReportSystemPrompt(rsvpData);

		// 3. Stream AI response (NO TOOLS - just reasoning)
		const stream = createUIMessageStream({
			execute: async ({ writer }) => {
				const cleanedMessages = cleanupMessages(this.messages);

				const result = streamText({
					maxOutputTokens: 4096, // Allow longer responses for detailed reports
					messages: await convertToModelMessages(cleanedMessages),
					model: openai("gpt-4o"), // Good for analysis and reasoning
					onFinish,
					stopWhen: stepCountIs(100),
					system,
					tools: {}, // NO TOOLS - data is in prompt
				});

				writer.merge(result.toUIMessageStream());
			},
		});

		return createUIMessageStreamResponse({ stream });
	}

	/**
	 * On connect: Send welcome message with example questions
	 */
	async onConnect(connection: Connection) {
		console.log(
			`ReportAgent: User ${connection.id} has connected to the report agent...`,
		);

		// Send welcome message on first connect
		if (this.messages.length === 0) {
			const welcomeMessage = `Ahoj Ivonka a Roman! 👋

Som váš **reporting asistent** pre analýzu RSVP odpovedí. Moja úloha je pomôcť vám získať prehľad o potvrdených účastiach, diétnych požiadavkách hostí, potrebách dopravy a ubytovania.

---

## 🎯 Čo pre vás môžem urobiť?

Mám prístup k **aktuálnym RSVP dátam** zo všetkých potvrdených aj nepotvrdených hostí. Môžete sa ma opýtať na čokoľvek a odpoviem s konkrétnymi údajmi a štatistikami.

### Príklady otázok:

**📊 Celkové štatistiky**
- "Koľko hostí celkovo potvrdilo účasť?"
- "Koľko skupín ešte neodpovedalo?"
- "Urob mi komplexný prehľad všetkých RSVP"
- "Koľko percent hostí už potvrdilo?"

**🍽️ Jedlo a diétne požiadavky**
- "Kto má nejaké alergie?" → dostanete konkrétne mená
- "Kto potrebuje vegetariánske jedlo?"
- "Aké sú všetky diétne požiadavky a koľko ľudí ich má?"
- "Má niekto laktózovú intoleranciu?"

**🚗 Doprava a odvoz**
- "Kto potrebuje odvoz po oslave?"
- "Koľko ľudí chce ísť do Bratislavy?"
- "Ktoré skupiny potrebujú dopravu a kam?"
- "Urob mi zoznam transportných požiadaviek"

**🏨 Ubytovanie**
- "Kto potrebuje pomoc s ubytovaním?"
- "Koľko osôb hľadá ubytovanie v Modre?"

---

## 💡 Ako ma používať:

Jednoducho napíšte otázku v slovenčine a ja vám odpoviem s **konkrétnymi údajmi, menami a štatistikami**. Všetky odpovede formátujem prehľadne pomocou tabuliek a zoznamov.

**Pripravený odpovedať na vaše otázky!** 🎉`;

			this.messages.push({
				id: crypto.randomUUID(),
				parts: [
					{
						text: welcomeMessage,
						type: "text",
					},
				],
				role: "assistant",
			});

			await this.saveMessages(this.messages);
		}
	}
}
