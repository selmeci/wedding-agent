import { getCurrentAgent } from "agents";
import { tool } from "ai";
import type { Chat } from "@/agents";
import {
	type SendMessageToCoupleInput,
	SendMessageToCoupleInputSchema,
	type SendMessageToCoupleOutput,
	SendMessageToCoupleOutputSchema,
} from "@/tools/types";
import { sendGuestMessage } from "@/utils/email";

/**
 * Send Message to Couple Tool
 *
 * Allows guests to send a message to Ivonka and Roman through the chat assistant.
 * The message is sent as an email to both bride and groom.
 *
 * This tool should only be called AFTER the user has confirmed the message content.
 * The AI agent should always show a preview and ask for confirmation before calling this tool.
 *
 * Security:
 * - Only available in 'completed' state (after RSVP is done)
 * - Message length limited to 1000 characters
 * - Requires explicit user confirmation before sending
 */
export const sendMessageToCoupleTool = tool<
	SendMessageToCoupleInput,
	SendMessageToCoupleOutput
>({
	description: `Send a message from the guest to Ivonka and Roman.

  IMPORTANT: Only call this tool AFTER showing the message preview and receiving explicit confirmation from the user!

  Flow:
  1. User says they want to send a message
  2. Ask what they want to say
  3. Show preview: "Chystám sa poslať túto správu:\n\n[message]\n\nMôžem ju odoslať?"
  4. Wait for confirmation (áno, pošli, ok)
  5. ONLY THEN call this tool

  Never call this tool without user confirmation!

  Input:
  - message: The message text to send (max 1000 characters)

  The tool will automatically include:
  - Guest name and group name
  - Timestamp
  - Sender identification`,

	execute: async ({ message }) => {
		console.log("Sending message to couple...", {
			messageLength: message.length,
		});

		const { agent } = getCurrentAgent<Chat>();
		if (!agent) throw new Error("No agent found");

		const db = agent.getDatabase();
		const { groupId, guestId } = agent.state;

		if (!groupId) {
			return {
				error: "Skupina nie je nastavená. Prosím, začni znovu cez QR kód.",
				success: false,
				type: "send-message-to-couple",
			};
		}

		// Get guest and group info for the email
		let guestName = "Hosť";
		let groupName = "Neznáma skupina";

		try {
			const group = await db.query.guestGroups.findFirst({
				where: (t, { eq }) => eq(t.id, groupId),
				with: { guests: true },
			});

			if (group) {
				groupName = group.name;

				if (guestId) {
					const guest = group.guests.find((g) => g.id === guestId);
					if (guest) {
						guestName = `${guest.firstName} ${guest.lastName}`;
					}
				} else if (group.guests.length === 1) {
					// Single guest group
					guestName = `${group.guests[0].firstName} ${group.guests[0].lastName}`;
				} else {
					// Multi-guest group, unknown who is writing
					guestName = `Člen skupiny ${group.name}`;
				}
			}
		} catch (error) {
			console.error("Error fetching guest info:", error);
			// Continue with default names
		}

		// Send the email
		const result = await sendGuestMessage(agent.getEnv(), {
			guestName,
			groupName,
			message,
		});

		if (!result.success) {
			console.error("Failed to send message:", result.error);
			return {
				error:
					result.error ||
					"Nepodarilo sa odoslať správu. Skús to prosím neskôr.",
				success: false,
				type: "send-message-to-couple",
			};
		}

		console.log("Message sent successfully:", result.messageId);

		return {
			message:
				"Správa bola úspešne odoslaná! Ivonka a Roman ju čoskoro uvidia. 💌",
			success: true,
			type: "send-message-to-couple",
		};
	},

	inputSchema: SendMessageToCoupleInputSchema,
	outputSchema: SendMessageToCoupleOutputSchema,
});
