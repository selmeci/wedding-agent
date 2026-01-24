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
 * Newsletter message parameters - for couple messages to subscribed group
 */
export interface NewsletterMessageParams {
	email: string;
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
	htmlContent?: string;
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

/**
 * Send a newsletter-style message from the couple to a subscribed group email
 */
export async function sendNewsletterMessage(
	env: Env,
	params: NewsletterMessageParams,
): Promise<EmailNotificationResult> {
	try {
		const timestamp = new Date().toLocaleString("sk-SK", {
			timeZone: "Europe/Bratislava",
		});

		const subject = "Odkaz od Ivonky a Romana 💌";
		const safeMessage = escapeHtml(params.message);
		const htmlMessage = safeMessage.replace(/\r?\n/g, "<br />");
		const heroImageUrl =
			"https://ivonka-roman-forever.love/wedding_pixel_art_transparent.png";

		const htmlContent = `
<div style="margin:0;padding:0;background-color:#fff5f7;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fff5f7;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 12px 30px rgba(255, 61, 111, 0.18);border:4px solid #ff9bb0;">
          <tr>
            <td style="background-color:#ffe3e8;padding:18px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:6px 0;">
                    <img src="${heroImageUrl}" alt="Pixel art svadobný motív" width="320" style="display:block;width:320px;max-width:85%;height:auto;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:6px 0 0 0;">
                    <div style="font-family:'Courier New',Consolas,monospace;font-size:14px;color:#e6215c;letter-spacing:1px;">
                      ♥ ♥ ♥ ♥ ♥
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:8px 0 0 0;">
                    <div style="font-family:'Playfair Display','Times New Roman',serif;font-size:26px;line-height:1.2;color:#111827;">
                      Svadobné novinky
                    </div>
                    <div style="font-family:'Inter','Segoe UI',sans-serif;font-size:13px;color:#4b5563;">
                      Odkaz od Ivonky a Romana pre skupinu ${escapeHtml(params.groupName)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 26px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:2px solid #ffd1dc;background-color:#fff9fb;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-family:'Inter','Segoe UI',sans-serif;font-size:16px;line-height:1.6;color:#1f2937;">
                      ${htmlMessage}
                    </div>
                    <div style="margin-top:18px;font-family:'Inter','Segoe UI',sans-serif;font-size:13px;color:#6b7280;">
                      Odoslané: ${escapeHtml(timestamp)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 26px 22px 26px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <div style="font-family:'Courier New',Consolas,monospace;font-size:12px;color:#ff3d6f;letter-spacing:2px;">
                      ♥ ▓ ♥ ▓ ♥ ▓ ♥ ▓ ♥
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:'Inter','Segoe UI',sans-serif;font-size:12px;color:#4b5563;">
                    Tento email si dostal, pretože tvoja skupina je prihlásená na svadobné novinky.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;

		const textContent = `Ahoj!

Máte nový odkaz od Ivonky a Romana pre skupinu ${params.groupName}.

${params.message}

Odoslané: ${timestamp}

--- 
Toto je automatická správa zo svadobného asistenta.`;

		const emailPayload: BrevoEmailRequest = {
			htmlContent,
			sender: {
				email: env.BREVO_SENDER_EMAIL,
				name: env.BREVO_SENDER_NAME,
			},
			subject,
			textContent,
			to: [{ email: params.email }],
		};

		console.log("[Newsletter Message] Sending email:", {
			email: params.email,
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
				"[Newsletter Message] Brevo API error:",
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
			"[Newsletter Message] Email sent successfully:",
			result.messageId,
		);

		return {
			messageId: result.messageId,
			success: true,
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("[Newsletter Message] Failed to send email:", error);
		return {
			error: errorMessage,
			success: false,
		};
	}
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
