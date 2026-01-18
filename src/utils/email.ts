/**
 * Email notification parameters
 */
export interface EmailNotificationParams {
	groupId: string;
	guestName: string;
	willAttend: boolean;
	attendeeCount: number;
	dietaryRestrictions: string | null;
	needsAccommodation: boolean | null;
	needsTransport: boolean | null;
}

/**
 * Guest message parameters - for sending messages from guests to the couple
 */
export interface GuestMessageParams {
	guestName: string;
	groupName: string;
	message: string;
}

/**
 * Email notification result
 */
export interface EmailNotificationResult {
	success: boolean;
	messageId?: string;
	error?: string;
}

interface BrevoEmailRequest {
	sender: {
		email: string;
		name: string;
	};
	to: Array<{ email: string }>;
	subject: string;
	textContent: string;
}

interface BrevoEmailResponse {
	messageId: string;
}

/**
 * Send email notification to wedding couple when RSVP is completed
 *
 * @param env - Cloudflare environment bindings (for Brevo config)
 * @param params - Email notification parameters
 * @returns Result with success status and messageId or error
 */
export async function sendEmailNotification(
	env: Env,
	params: EmailNotificationParams,
): Promise<EmailNotificationResult> {
	try {
		const timestamp = new Date().toLocaleString("sk-SK", {
			timeZone: "Europe/Bratislava",
		});

		const subject = `[RSVP] ${params.willAttend ? "✅ Potvrdenie" : "❌ Ospravedlnenie"} - ${params.guestName}`;

		const textContent = `Ahoj!

Nová RSVP odpoveď od: ${params.guestName}

📋 Detaily:
• Skupina ID: ${params.groupId}
• Skupina name: ${params.guestName}
• Účasť: ${params.willAttend ? "ÁNO ✅" : "NIE ❌"}
• Počet hostí: ${params.attendeeCount}
• Diétne požiadavky: ${params.dietaryRestrictions || "Žiadne"}
• Ubytovanie: ${params.needsAccommodation !== null ? (params.needsAccommodation ? "Áno" : "Nie") : "Neuvedené"}
• Doprava späť do BA: ${params.needsTransport !== null ? (params.needsTransport ? "Áno" : "Nie") : "Neuvedené"}

🕒 Čas odpovede: ${timestamp}

---
Automatická notifikácia z Wedding RSVP systému`;

		const emailPayload: BrevoEmailRequest = {
			sender: {
				email: env.BREVO_SENDER_EMAIL,
				name: env.BREVO_SENDER_NAME,
			},
			subject,
			textContent,
			to: [
				{ email: "selmeci.roman@gmail.com" },
				{ email: "ivona.hrdlickova@gmail.com" },
			],
		};

		console.log("[Email Notification] Sending email:", emailPayload);

		const response = await fetch("https://api.brevo.com/v3/smtp/email", {
			body: JSON.stringify(emailPayload),
			headers: {
				"api-key": env.BREVO_API_KEY,
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				"[Email Notification] Brevo API error:",
				response.status,
				errorText,
			);
			return {
				error: `Brevo API returned ${response.status}: ${errorText}`,
				success: false,
			};
		}

		const result = (await response.json()) as BrevoEmailResponse;
		console.log(
			"[Email Notification] Email sent successfully:",
			result.messageId,
		);

		return {
			messageId: result.messageId,
			success: true,
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("[Email Notification] Failed to send email:", error);
		return {
			error: errorMessage,
			success: false,
		};
	}
}

/**
 * Send a message from a guest to the wedding couple
 *
 * @param env - Cloudflare environment bindings (for Brevo config)
 * @param params - Guest message parameters
 * @returns Result with success status and messageId or error
 */
export async function sendGuestMessage(
	env: Env,
	params: GuestMessageParams,
): Promise<EmailNotificationResult> {
	try {
		const timestamp = new Date().toLocaleString("sk-SK", {
			timeZone: "Europe/Bratislava",
		});

		const subject = `[Správa od hosťa] 💌 ${params.guestName}`;

		const textContent = `Ahoj Ivonka a Roman!

Máte novú správu od hosťa cez svadobného asistenta.

📨 **Od:** ${params.guestName} (${params.groupName})

---

${params.message}

---

🕒 Odoslané: ${timestamp}

---
Správa odoslaná cez Wedding RSVP asistenta`;

		const emailPayload: BrevoEmailRequest = {
			sender: {
				email: env.BREVO_SENDER_EMAIL,
				name: env.BREVO_SENDER_NAME,
			},
			subject,
			textContent,
			to: [
				{ email: "selmeci.roman@gmail.com" },
				{ email: "ivona.hrdlickova@gmail.com" },
			],
		};

		console.log("[Guest Message] Sending email:", {
			from: params.guestName,
			group: params.groupName,
			messageLength: params.message.length,
		});

		const response = await fetch("https://api.brevo.com/v3/smtp/email", {
			body: JSON.stringify(emailPayload),
			headers: {
				"api-key": env.BREVO_API_KEY,
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				"[Guest Message] Brevo API error:",
				response.status,
				errorText,
			);
			return {
				error: `Brevo API returned ${response.status}: ${errorText}`,
				success: false,
			};
		}

		const result = (await response.json()) as BrevoEmailResponse;
		console.log("[Guest Message] Email sent successfully:", result.messageId);

		return {
			messageId: result.messageId,
			success: true,
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("[Guest Message] Failed to send email:", error);
		return {
			error: errorMessage,
			success: false,
		};
	}
}
