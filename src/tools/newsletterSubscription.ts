import { getCurrentAgent } from "agents";
import { tool } from "ai";
import { eq } from "drizzle-orm";
import type { Chat } from "@/agents";
import { guestGroups } from "@/db";
import {
	type NewsletterSubscriptionInput,
	NewsletterSubscriptionInputSchema,
	type NewsletterSubscriptionOutput,
	NewsletterSubscriptionOutputSchema,
} from "@/tools/types";

/**
 * Newsletter Subscription Tool
 *
 * Stores or removes a newsletter email for the entire guest group.
 * The email is optional and applies to the whole group.
 */
export const newsletterSubscriptionTool = tool<
	NewsletterSubscriptionInput,
	NewsletterSubscriptionOutput
>({
	description: `Subscribe or unsubscribe the guest group to newsletter updates.

Use when guest asks to receive updates via email or wants to unsubscribe.

Input:
- action: "subscribe" or "unsubscribe"
- email: required when action="subscribe" (group-level email)

Behavior:
- subscribe: saves the email for the group
- unsubscribe: clears the email for the group`,

	execute: async ({ action, email }) => {
		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const db = agent.getDatabase();
		const { groupId } = agent.state;

		if (!groupId) {
			return {
				error: "Skupina nie je nastavená. Prosím, začni znovu cez QR kód.",
				success: false,
				type: "newsletter-subscription",
			};
		}

		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.id, groupId),
		});

		if (!group) {
			return {
				error: "Skupina nebola nájdená.",
				success: false,
				type: "newsletter-subscription",
			};
		}

		if (action === "subscribe") {
			if (group.newsletterEmail && group.newsletterEmail === email) {
				return {
					message: `Si už prihlásený na novinky s emailom ${email}.`,
					success: true,
					type: "newsletter-subscription",
				};
			}

			await db
				.update(guestGroups)
				.set({ newsletterEmail: email ?? null })
				.where(eq(guestGroups.id, groupId));

			if (group.newsletterEmail && group.newsletterEmail !== email) {
				return {
					message: `Email pre novinky som zmenil z ${group.newsletterEmail} na ${email}.`,
					success: true,
					type: "newsletter-subscription",
				};
			}

			return {
				message: `Hotovo! Novinky budeme posielať na ${email}.`,
				success: true,
				type: "newsletter-subscription",
			};
		}

		if (!group.newsletterEmail) {
			return {
				message: "Odber noviniek je už zrušený.",
				success: true,
				type: "newsletter-subscription",
			};
		}

		await db
			.update(guestGroups)
			.set({ newsletterEmail: null })
			.where(eq(guestGroups.id, groupId));

		return {
			message: "Odber noviniek je zrušený. Ďakujeme, že si nám dal vedieť.",
			success: true,
			type: "newsletter-subscription",
		};
	},

	inputSchema: NewsletterSubscriptionInputSchema,
	outputSchema: NewsletterSubscriptionOutputSchema,
});
