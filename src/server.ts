import { getAgentByName } from "agents";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import type { Chat, ReportAgent } from "@/agents";
import { accommodationSeedData } from "@/data/accommodations";
import { guestGroupSeedData } from "@/data/guest-groups";
import {
	accommodations,
	audioRecordings,
	chatMessages,
	chatSessions,
	createDb,
	guestGroupResponses,
	guestGroups,
	guestResponses,
	guests,
	photoUploads,
} from "@/db";
import { fetchGalleryMedia } from "@/db/queries/gallery-media";

export * from "@/agents";

const app = new Hono<{ Bindings: Env }>();

// Seed import route
app.post("/api/seed", async (c) => {
	try {
		// Verify API key
		const apiKey = c.req.header("x-api-key");
		const expectedKey = c.env.SECRET;

		if (!apiKey || apiKey !== expectedKey) {
			return c.status(401);
		}

		const db = createDb(c.env.DB);

		console.log("🧹 Starting database cleanup...");

		// Step 1: Clear all D1 tables (in correct order due to foreign keys)
		console.log("🗑️  Clearing D1 tables...");

		// Delete in order: child tables first, then parent tables
		await db.delete(audioRecordings); // references guest_groups
		console.log("  - audio_recordings cleared");

		await db.delete(photoUploads); // references guests
		console.log("  - photo_uploads cleared");

		await db.delete(chatMessages); // references chat_sessions
		console.log("  - chat_messages cleared");

		await db.delete(chatSessions); // references guests + guest_groups
		console.log("  - chat_sessions cleared");

		await db.delete(guestGroupResponses); // references guest_groups
		console.log("  - guest_group_responses cleared");

		await db.delete(guestResponses); // references guests
		console.log("  - guest_responses cleared");

		await db.delete(accommodations); // no dependencies
		console.log("  - accommodations cleared");

		await db.delete(guests); // references guest_groups
		console.log("  - guests cleared");

		await db.delete(guestGroups); // parent table
		console.log("  - guest_groups cleared");

		console.log("✅ All D1 tables cleared");

		// Step 2: Insert guest groups and their members
		console.log("📝 Seeding guest groups into D1...");
		let totalGroupGuests = 0;

		for (const groupSeed of guestGroupSeedData) {
			// Insert the group
			const [insertedGroup] = await db
				.insert(guestGroups)
				.values(groupSeed.group)
				.returning();

			console.log(`  - Inserted group: ${groupSeed.group.name}`);

			// Insert all guests in this group
			const groupGuestsWithGroupId = groupSeed.guests.map((guest) => ({
				...guest,
				groupId: insertedGroup.id,
			}));

			await db.insert(guests).values(groupGuestsWithGroupId);
			totalGroupGuests += groupGuestsWithGroupId.length;

			console.log(
				`    → ${groupGuestsWithGroupId.length} guests added to group`,
			);
		}

		console.log(
			`✅ Inserted ${guestGroupSeedData.length} groups with ${totalGroupGuests} total guests`,
		);

		// Step 3: Insert accommodations into D1
		console.log("📝 Seeding accommodations into D1...");
		const insertedAccommodations = await db
			.insert(accommodations)
			.values(accommodationSeedData)
			.returning();

		console.log(
			`✅ Inserted ${insertedAccommodations.length} accommodations into D1`,
		);

		// Success response
		return c.json({
			message: "Database seeded successfully",
			stats: {
				accommodations: insertedAccommodations.length,
				guestGroups: guestGroupSeedData.length,
				totalGuests: totalGroupGuests,
			},
			success: true,
		});
	} catch (error) {
		console.error("❌ Seed error:", error);

		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to seed database",
			},
			500,
		);
	}
});

// Agent route
app.all("/agents/chat/:qrToken", async (c) => {
	const qrToken = c.req.param("qrToken");
	console.log("Received request for agent with QR token:", qrToken);
	if (!qrToken) {
		return c.status(401);
	}
	const db = createDb(c.env.DB);
	const group = await db.query.guestGroups.findFirst({
		where: (t, { eq }) => eq(t.qrToken, qrToken),
	});
	if (!group) {
		return c.status(403);
	}
	const agent = await getAgentByName<Env, Chat>(
		c.env.Chat as unknown as DurableObjectNamespace<Chat>,
		qrToken,
	);
	await agent.setGroupId(group.id);

	const response = await agent.fetch(c.req.raw);
	return response || c.notFound();
});

app.get("/agents/chat/:qrToken/get-messages", async (c) => {
	const qrToken = c.req.param("qrToken");
	console.log("Received request for agent with QR token:", qrToken);
	if (!qrToken) {
		return c.status(401);
	}
	const db = createDb(c.env.DB);
	const group = await db.query.guestGroups.findFirst({
		where: (t, { eq }) => eq(t.qrToken, qrToken),
	});
	if (!group) {
		return c.status(403);
	}
	const agent = await getAgentByName<Env, Chat>(
		c.env.Chat as unknown as DurableObjectNamespace<Chat>,
		qrToken,
	);
	await agent.setGroupId(group.id);

	const response = await agent.fetch(c.req.raw);
	return response || c.notFound();
});

app.get("/agents/chat/:qrToken/reset", async (c) => {
	const qrToken = c.req.param("qrToken");
	console.log("Received request for agent with QR token:", qrToken);
	if (!qrToken) {
		return c.status(401);
	}
	const db = createDb(c.env.DB);
	const group = await db.query.guestGroups.findFirst({
		where: (t, { eq }) => eq(t.qrToken, qrToken),
	});
	if (!group) {
		return c.status(403);
	}
	const agent = await getAgentByName<Env, Chat>(
		c.env.Chat as unknown as DurableObjectNamespace<Chat>,
		qrToken,
	);
	await agent.resetState();

	return c.json({ message: "Agent state reset successfully" }, 200);
});

// Report Agent route - Token-protected analytics
app.all("/agents/report/:qrToken", async (c) => {
	const qrToken = c.req.param("qrToken");
	const expectedToken = c.env.SECRET_REPORT_TOKEN;

	console.log("Received request for report agent with qrToken");

	// Validate qrToken against expected report token
	if (!qrToken || qrToken !== expectedToken) {
		console.log("Unauthorized report agent access attempt");
		return c.json({ error: "Unauthorized" }, 401);
	}

	// Get or create ReportAgent DO instance
	const agent = await getAgentByName<Env, ReportAgent>(
		c.env.ReportAgent as unknown as DurableObjectNamespace<ReportAgent>,
		qrToken, // Use qrToken as agent name (singleton per token)
	);

	const response = await agent.fetch(c.req.raw);
	return response || c.notFound();
});

// Report Agent - Get messages endpoint
app.get("/agents/report/:qrToken/get-messages", async (c) => {
	const qrToken = c.req.param("qrToken");
	const expectedToken = c.env.SECRET_REPORT_TOKEN;

	console.log("Received get-messages request for report agent");

	// Validate qrToken against expected report token
	if (!qrToken || qrToken !== expectedToken) {
		console.log("Unauthorized report agent get-messages access attempt");
		return c.json({ error: "Unauthorized" }, 401);
	}

	// Get ReportAgent DO instance
	const agent = await getAgentByName<Env, ReportAgent>(
		c.env.ReportAgent as unknown as DurableObjectNamespace<ReportAgent>,
		qrToken,
	);

	const response = await agent.fetch(c.req.raw);
	return response || c.notFound();
});

// Report Agent - Reset endpoint
app.get("/agents/report/:qrToken/reset", async (c) => {
	const qrToken = c.req.param("qrToken");
	const expectedToken = c.env.SECRET_REPORT_TOKEN;

	console.log("Received reset request for report agent");

	// Validate qrToken against expected report token
	if (!qrToken || qrToken !== expectedToken) {
		console.log("Unauthorized report agent reset access attempt");
		return c.json({ error: "Unauthorized" }, 401);
	}

	// Get ReportAgent DO instance
	const agent = await getAgentByName<Env, ReportAgent>(
		c.env.ReportAgent as unknown as DurableObjectNamespace<ReportAgent>,
		qrToken,
	);

	// ReportAgent doesn't have resetState method, so we'll use clearHistory via fetch
	const resetRequest = new Request(`${c.req.url}/clear-history`, {
		method: "POST",
	});
	await agent.fetch(resetRequest);

	return c.json({ message: "Report agent history cleared successfully" }, 200);
});

// Constant-time token comparison for gallery/report endpoints
function secureTokenEquals(token: string, expected: string): boolean {
	const encoder = new TextEncoder();
	const a = encoder.encode(token);
	const b = encoder.encode(expected);
	if (a.byteLength !== b.byteLength) return false;
	// timingSafeEqual is available in Cloudflare Workers runtime
	return (
		crypto.subtle as unknown as {
			timingSafeEqual(a: BufferSource, b: BufferSource): boolean;
		}
	).timingSafeEqual(a, b);
}

// Gallery API - Token-protected media listing
app.get("/api/gallery/media", async (c) => {
	const token = c.req.query("token");
	const expectedToken = c.env.SECRET_REPORT_TOKEN;

	if (!expectedToken) {
		console.error(
			"GET /api/gallery/media - SECRET_REPORT_TOKEN is not configured",
		);
		return c.json({ error: "Gallery is not configured" }, 500);
	}
	if (!token || !secureTokenEquals(token, expectedToken)) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	try {
		const db = createDb(c.env.DB);
		const groups = await fetchGalleryMedia(db);
		return c.json(
			{
				cfImagesHash: c.env.CF_IMAGES_ACCOUNT_HASH,
				cfStreamCode: c.env.CF_STREAM_CUSTOMER_CODE,
				groups,
			},
			200,
			{
				"Cache-Control": "private, max-age=60",
			},
		);
	} catch (error) {
		console.error("Gallery media fetch error:", error);
		return c.json({ error: "Failed to fetch gallery media" }, 500);
	}
});

// GET /api/photos - List photos for group
app.get("/api/photos", async (c) => {
	console.log("📋 GET /api/photos - List request started");
	try {
		// Get QR token from header for auth
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			console.log("❌ GET /api/photos - Missing QR token");
			return c.json({ error: "Missing QR token" }, 401);
		}

		const db = createDb(c.env.DB);

		// Validate QR token and get group
		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
		});

		if (!group) {
			return c.json({ error: "Invalid QR token" }, 403);
		}

		// First get all guest IDs in this group
		const groupGuests = await db.query.guests.findMany({
			columns: { id: true },
			where: (t, { eq }) => eq(t.groupId, group.id),
		});

		const guestIds = groupGuests.map((g) => g.id);

		// Get all photos for guests in this group
		const photos = await db.query.photoUploads.findMany({
			orderBy: (t, { desc }) => [desc(t.uploadedAt)],
			where: (t, { inArray }) =>
				guestIds.length > 0 ? inArray(t.guestId, guestIds) : undefined,
		});

		// Return photos with CF IDs for direct CDN delivery
		const photosWithUrls = photos.map((photo) => ({
			cloudflareImageId: photo.cloudflareImageId,
			duration: photo.duration,
			fileName: photo.fileName,
			id: photo.id,
			mediaType: photo.mediaType,
			streamReady: photo.streamReady,
			streamVideoUid: photo.streamVideoUid,
			uploadedAt: photo.uploadedAt,
		}));

		console.log(
			`✅ GET /api/photos - Found ${photos.length} items (${photos.filter((p) => p.mediaType === "video").length} videos, ${photos.filter((p) => p.mediaType === "image").length} images)`,
		);
		return c.json({
			cfImagesHash: c.env.CF_IMAGES_ACCOUNT_HASH,
			cfStreamCode: c.env.CF_STREAM_CUSTOMER_CODE,
			photos: photosWithUrls,
		});
	} catch (error) {
		console.error("❌ GET /api/photos - Error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to list photos",
			},
			500,
		);
	}
});

// DELETE /api/photos/:id - Delete photo/video
app.delete("/api/photos/:id", async (c) => {
	const photoId = c.req.param("id");
	console.log(`🗑️ DELETE /api/photos/${photoId} - Request started`);
	try {
		// Get QR token from header for auth
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			console.log(`❌ DELETE /api/photos/${photoId} - Missing QR token`);
			return c.json({ error: "Missing QR token" }, 401);
		}

		const db = createDb(c.env.DB);

		// Validate QR token and get group
		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
			with: { guests: true },
		});

		if (!group) {
			return c.json({ error: "Invalid QR token" }, 403);
		}

		// Get photo metadata
		const photo = await db.query.photoUploads.findFirst({
			where: (t, { eq }) => eq(t.id, photoId),
		});

		if (!photo) {
			return c.json({ error: "Photo not found" }, 404);
		}

		// Verify photo belongs to someone in this group
		const guestBelongsToGroup = group.guests.some(
			(g) => g.id === photo.guestId,
		);
		if (!guestBelongsToGroup) {
			return c.json({ error: "Cannot delete photo from another group" }, 403);
		}

		const cfAccountId = c.env.CF_ACCOUNT_ID;
		const cfToken = c.env.CF_IMAGE_TOKEN;

		// Delete from CF Images (if stored there)
		if (photo.cloudflareImageId) {
			try {
				await fetch(
					`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/images/v1/${photo.cloudflareImageId}`,
					{
						method: "DELETE",
						headers: { Authorization: `Bearer ${cfToken}` },
					},
				);
			} catch (err) {
				console.error(
					`⚠️ Failed to delete CF Image ${photo.cloudflareImageId}:`,
					err,
				);
			}
		}

		// Delete from CF Stream (if stored there)
		if (photo.streamVideoUid) {
			try {
				await fetch(
					`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/stream/${photo.streamVideoUid}`,
					{
						method: "DELETE",
						headers: { Authorization: `Bearer ${cfToken}` },
					},
				);
			} catch (err) {
				console.error(
					`⚠️ Failed to delete CF Stream ${photo.streamVideoUid}:`,
					err,
				);
			}
		}

		// Delete from R2 (backward compat for partially migrated items)
		if (photo.r2Key) {
			await c.env.BUCKET.delete(photo.r2Key);
		}
		if (photo.thumbnailR2Key) {
			await c.env.BUCKET.delete(photo.thumbnailR2Key);
		}

		// Delete from D1
		await db.delete(photoUploads).where(eq(photoUploads.id, photoId));

		console.log(`✅ DELETE /api/photos/${photoId} - Successfully deleted`);
		return c.json({ success: true });
	} catch (error) {
		console.error(`❌ DELETE /api/photos/${photoId} - Error:`, error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to delete photo",
			},
			500,
		);
	}
});

// POST /api/media/upload-url - Get CF Images or CF Stream Direct Creator Upload URL
app.post("/api/media/upload-url", async (c) => {
	console.log("🔑 POST /api/media/upload-url - Request started");
	try {
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			console.log("❌ POST /api/media/upload-url - Missing QR token");
			return c.json({ error: "Missing QR token" }, 401);
		}

		const db = createDb(c.env.DB);

		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
			with: { guests: true },
		});

		if (!group) {
			return c.json({ error: "Invalid QR token" }, 403);
		}

		let guestId = c.req.header("x-guest-id");
		if (!guestId && group.guests.length > 0) {
			guestId = group.guests[0].id;
		}
		if (!guestId) {
			return c.json({ error: "No guest available in group" }, 400);
		}

		const { fileName, contentType, mediaType } = await c.req.json<{
			fileName: string;
			contentType: string;
			mediaType: "image" | "video";
		}>();

		if (!fileName || !contentType || !mediaType) {
			return c.json({ error: "Missing required fields" }, 400);
		}

		// Validate content type
		const imageTypes = [
			"image/jpeg",
			"image/png",
			"image/heic",
			"image/heif",
			"image/webp",
		];
		const videoTypes = [
			"video/mp4",
			"video/quicktime",
			"video/webm",
			"video/x-m4v",
		];
		const baseContentType = contentType.split(";")[0].trim();

		if (mediaType === "image" && !imageTypes.includes(baseContentType)) {
			return c.json({ error: "Nepovolený typ súboru pre obrázok" }, 400);
		}
		if (mediaType === "video" && !videoTypes.includes(baseContentType)) {
			return c.json({ error: "Nepovolený typ súboru pre video" }, 400);
		}

		console.log(
			`📁 POST /api/media/upload-url - File: ${fileName}, Type: ${contentType}, MediaType: ${mediaType}`,
		);

		const cfAccountId = c.env.CF_ACCOUNT_ID;
		const cfToken = c.env.CF_IMAGE_TOKEN;

		if (mediaType === "image") {
			// CF Images Direct Creator Upload
			const cfResponse = await fetch(
				`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/images/v2/direct_upload`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${cfToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						metadata: {
							guestId,
							groupId: group.id,
							fileName,
						},
					}),
				},
			);

			if (!cfResponse.ok) {
				const errorBody = await cfResponse.text();
				console.error(
					`❌ POST /api/media/upload-url - CF Images API error: ${cfResponse.status} ${errorBody}`,
				);
				return c.json(
					{ error: "Failed to create upload URL from Cloudflare Images" },
					500,
				);
			}

			const cfData = await cfResponse.json<{
				result: { id: string; uploadURL: string };
				success: boolean;
			}>();

			console.log(
				`✅ POST /api/media/upload-url - CF Images upload URL created: ${cfData.result.id}`,
			);

			return c.json({
				uploadURL: cfData.result.uploadURL,
				mediaId: cfData.result.id,
				mediaType: "image" as const,
				guestId,
			});
		}

		// CF Stream Direct Creator Upload (video)
		const cfResponse = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/stream/direct_upload`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${cfToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					maxDurationSeconds: 600,
					meta: {
						guestId,
						groupId: group.id,
						fileName,
					},
				}),
			},
		);

		if (!cfResponse.ok) {
			const errorBody = await cfResponse.text();
			console.error(
				`❌ POST /api/media/upload-url - CF Stream API error: ${cfResponse.status} ${errorBody}`,
			);
			return c.json(
				{ error: "Failed to create upload URL from Cloudflare Stream" },
				500,
			);
		}

		const cfData = await cfResponse.json<{
			result: { uid: string; uploadURL: string };
			success: boolean;
		}>();

		console.log(
			`✅ POST /api/media/upload-url - CF Stream upload URL created: ${cfData.result.uid}`,
		);

		return c.json({
			uploadURL: cfData.result.uploadURL,
			mediaId: cfData.result.uid,
			mediaType: "video" as const,
			guestId,
		});
	} catch (error) {
		console.error("❌ POST /api/media/upload-url - Error:", error);
		return c.json(
			{
				error: "Failed to create upload URL",
				details: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
});

// POST /api/media/confirm - Confirm CF Images/Stream upload and save metadata
app.post("/api/media/confirm", async (c) => {
	console.log("✔️ POST /api/media/confirm - Confirm request started");
	try {
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			console.log("❌ POST /api/media/confirm - Missing QR token");
			return c.json({ error: "Missing QR token" }, 401);
		}

		const db = createDb(c.env.DB);

		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
			with: { guests: true },
		});

		if (!group) {
			console.log("❌ POST /api/media/confirm - Invalid QR token");
			return c.json({ error: "Invalid QR token" }, 403);
		}

		const body = await c.req.json<{
			mediaId: string;
			cloudflareImageId?: string;
			streamVideoUid?: string;
			fileName: string;
			guestId: string;
			mediaType: "image" | "video";
			fileSize?: number;
			mimeType?: string;
		}>();

		const { mediaId, fileName, guestId, mediaType } = body;

		if (!mediaId || !fileName || !guestId || !mediaType) {
			console.log("❌ POST /api/media/confirm - Missing required fields");
			return c.json({ error: "Missing required fields" }, 400);
		}

		// Verify guest belongs to group
		const guestBelongsToGroup = group.guests.some((g) => g.id === guestId);
		if (!guestBelongsToGroup) {
			console.log(
				`❌ POST /api/media/confirm - Guest ${guestId} does not belong to group`,
			);
			return c.json({ error: "Invalid guest ID" }, 403);
		}

		if (body.cloudflareImageId) {
			// CF Images upload confirm
			console.log(
				`💾 POST /api/media/confirm - CF Images: id=${mediaId}, cfImageId=${body.cloudflareImageId}`,
			);
			await db.insert(photoUploads).values({
				id: mediaId,
				fileName,
				fileSize: body.fileSize || 0,
				mimeType: body.mimeType || "image/jpeg",
				mediaType: "image",
				cloudflareImageId: body.cloudflareImageId,
				guestId,
			});

			console.log(`✅ POST /api/media/confirm - CF Images success: ${mediaId}`);
			return c.json({
				success: true,
				id: mediaId,
				mediaType: "image",
				fileName,
				uploadedAt: new Date().toISOString(),
			});
		}

		if (body.streamVideoUid) {
			// CF Stream upload confirm
			console.log(
				`💾 POST /api/media/confirm - CF Stream: id=${mediaId}, streamUid=${body.streamVideoUid}`,
			);
			await db.insert(photoUploads).values({
				id: mediaId,
				fileName,
				fileSize: body.fileSize || 0,
				mimeType: body.mimeType || "video/mp4",
				mediaType: "video",
				streamVideoUid: body.streamVideoUid,
				streamReady: false,
				guestId,
			});

			console.log(`✅ POST /api/media/confirm - CF Stream success: ${mediaId}`);
			return c.json({
				success: true,
				id: mediaId,
				mediaType: "video",
				fileName,
				uploadedAt: new Date().toISOString(),
			});
		}

		return c.json(
			{ error: "Missing cloudflareImageId or streamVideoUid" },
			400,
		);
	} catch (error) {
		console.error("❌ POST /api/media/confirm - Error:", error);
		return c.json(
			{
				error: "Failed to confirm upload",
				details: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
});

// POST /api/webhooks/stream - Cloudflare Stream processing webhook
app.post("/api/webhooks/stream", async (c) => {
	console.log("🎬 POST /api/webhooks/stream - Webhook received");
	try {
		const body = await c.req.json<{
			uid: string;
			readyToStream: boolean;
			duration: number;
			[key: string]: unknown;
		}>();

		const { uid, readyToStream, duration } = body;

		if (!uid) {
			console.log("❌ POST /api/webhooks/stream - Missing uid in payload");
			return c.json({ error: "Missing uid" }, 400);
		}

		console.log(
			`🎬 POST /api/webhooks/stream - uid=${uid}, readyToStream=${readyToStream}, duration=${duration}`,
		);

		if (readyToStream) {
			const db = createDb(c.env.DB);

			await db
				.update(photoUploads)
				.set({
					streamReady: true,
					duration: duration ? Math.round(duration) : null,
				})
				.where(eq(photoUploads.streamVideoUid, uid));

			console.log(
				`✅ POST /api/webhooks/stream - Updated streamReady=true for uid=${uid}`,
			);
		}

		return c.json({ success: true });
	} catch (error) {
		console.error("❌ POST /api/webhooks/stream - Error:", error);
		return c.json(
			{
				error: "Webhook processing failed",
				details: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
});

// Audio recording API
// POST /api/audio - Upload audio recording
app.post("/api/audio", async (c) => {
	try {
		// Get QR token from header for auth
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			return c.json({ error: "Missing QR token" }, 401);
		}

		const db = createDb(c.env.DB);

		// Validate QR token and get group
		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
		});

		if (!group) {
			return c.json({ error: "Invalid QR token" }, 403);
		}

		// Parse multipart form data
		const formData = await c.req.formData();
		const file = formData.get("file") as File | null;
		const durationStr = formData.get("duration") as string | null;

		if (!file) {
			return c.json({ error: "No file provided" }, 400);
		}

		// Validate file type (audio formats supported by MediaRecorder)
		// Using startsWith to handle codec parameters like "audio/webm;codecs=opus"
		const allowedBaseTypes = [
			"audio/mp4",
			"audio/webm",
			"audio/ogg",
			"audio/mpeg",
			"audio/wav",
			"audio/aac",
			"audio/3gpp",
			"audio/3gpp2",
			"audio/x-m4a",
		];
		const isValidType = allowedBaseTypes.some(
			(baseType) =>
				file.type === baseType || file.type.startsWith(`${baseType};`),
		);
		if (!isValidType) {
			console.log("Rejected audio type:", file.type);
			return c.json({ error: `Invalid audio type: ${file.type}` }, 400);
		}

		// Validate file size (max 10MB for voice messages)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return c.json({ error: "File too large (max 10MB)" }, 400);
		}

		// Parse duration if provided
		const duration = durationStr ? Number.parseInt(durationStr, 10) : null;

		// Generate audio ID and R2 key
		const audioId = crypto.randomUUID();
		const extensionMap: Record<string, string> = {
			"audio/3gpp": "3gp",
			"audio/3gpp2": "3g2",
			"audio/aac": "aac",
			"audio/mp4": "m4a",
			"audio/mpeg": "mp3",
			"audio/ogg": "ogg",
			"audio/wav": "wav",
			"audio/webm": "webm",
			"audio/x-m4a": "m4a",
		};
		// Extract base MIME type without codec parameters (e.g., "audio/webm;codecs=opus" -> "audio/webm")
		const baseMimeType = file.type.split(";")[0];
		const fileExtension = extensionMap[baseMimeType] || "audio";
		const r2Key = `groups/${group.id}/audio/${audioId}.${fileExtension}`;

		// Upload to R2
		await c.env.BUCKET.put(r2Key, file.stream(), {
			httpMetadata: {
				contentType: file.type,
			},
		});

		// Save metadata to D1
		await db.insert(audioRecordings).values({
			duration,
			fileName: file.name || `recording.${fileExtension}`,
			fileSize: file.size,
			groupId: group.id,
			id: audioId,
			mimeType: file.type,
			r2Key,
		});

		return c.json({
			duration,
			fileName: file.name || `recording.${fileExtension}`,
			id: audioId,
			uploadedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Audio upload error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to upload audio",
			},
			500,
		);
	}
});

// GET /api/audio - List audio recordings for group
app.get("/api/audio", async (c) => {
	try {
		// Get QR token from header for auth
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			return c.json({ error: "Missing QR token" }, 401);
		}

		const db = createDb(c.env.DB);

		// Validate QR token and get group
		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
		});

		if (!group) {
			return c.json({ error: "Invalid QR token" }, 403);
		}

		// Get all audio recordings for this group
		const recordings = await db.query.audioRecordings.findMany({
			orderBy: (t, { desc }) => [desc(t.uploadedAt)],
			where: (t, { eq }) => eq(t.groupId, group.id),
		});

		// Return recordings with stream URLs
		const recordingsWithUrls = recordings.map((recording) => ({
			duration: recording.duration,
			fileName: recording.fileName,
			id: recording.id,
			mimeType: recording.mimeType,
			streamUrl: `/api/audio/${recording.id}`,
			uploadedAt: recording.uploadedAt,
		}));

		return c.json({ recordings: recordingsWithUrls });
	} catch (error) {
		console.error("Audio list error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to list audio recordings",
			},
			500,
		);
	}
});

// GET /api/audio/:id - Stream audio file
app.get("/api/audio/:id", async (c) => {
	try {
		const audioId = c.req.param("id");
		const db = createDb(c.env.DB);

		// Get audio metadata
		const recording = await db.query.audioRecordings.findFirst({
			where: (t, { eq }) => eq(t.id, audioId),
		});

		if (!recording) {
			return c.json({ error: "Audio recording not found" }, 404);
		}

		// Get object from R2
		const object = await c.env.BUCKET.get(recording.r2Key);
		if (!object) {
			return c.json({ error: "Audio file not found in storage" }, 404);
		}

		// Return audio stream
		return new Response(object.body, {
			headers: {
				"Cache-Control": "public, max-age=31536000",
				"Content-Disposition": `inline; filename="${recording.fileName}"`,
				"Content-Type": recording.mimeType,
			},
		});
	} catch (error) {
		console.error("Audio stream error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to stream audio",
			},
			500,
		);
	}
});

// DELETE /api/audio/:id - Delete audio recording
app.delete("/api/audio/:id", async (c) => {
	try {
		// Get QR token from header for auth
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			return c.json({ error: "Missing QR token" }, 401);
		}

		const audioId = c.req.param("id");
		const db = createDb(c.env.DB);

		// Validate QR token and get group
		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
		});

		if (!group) {
			return c.json({ error: "Invalid QR token" }, 403);
		}

		// Get audio metadata
		const recording = await db.query.audioRecordings.findFirst({
			where: (t, { eq }) => eq(t.id, audioId),
		});

		if (!recording) {
			return c.json({ error: "Audio recording not found" }, 404);
		}

		// Verify recording belongs to this group
		if (recording.groupId !== group.id) {
			return c.json({ error: "Cannot delete audio from another group" }, 403);
		}

		// Delete from R2
		await c.env.BUCKET.delete(recording.r2Key);

		// Delete from D1
		await db.delete(audioRecordings).where(eq(audioRecordings.id, audioId));

		return c.json({ success: true });
	} catch (error) {
		console.error("Audio delete error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to delete audio",
			},
			500,
		);
	}
});

// POST /api/admin/migrate-media - Migrate existing R2 media to CF Images/Stream
app.post("/api/admin/migrate-media", async (c) => {
	const apiKey = c.req.header("x-api-key");
	if (!apiKey || apiKey !== c.env.SECRET) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const BATCH_SIZE = 5;
	const errors: { id: string; error: string }[] = [];
	let migratedImages = 0;
	let migratedVideos = 0;

	const db = createDb(c.env.DB);
	const cfAccountId = c.env.CF_ACCOUNT_ID;
	const cfToken = c.env.CF_IMAGE_TOKEN;

	try {
		// Find unmigrated images
		const unmigratedImages = await db.query.photoUploads.findMany({
			where: (t, { and, isNull, isNotNull, eq: colEq }) =>
				and(
					isNull(t.cloudflareImageId),
					colEq(t.mediaType, "image"),
					isNotNull(t.r2Key),
				),
			limit: BATCH_SIZE,
		});

		// Find unmigrated videos
		const remainingImageSlots = BATCH_SIZE - unmigratedImages.length;
		const unmigratedVideos =
			remainingImageSlots > 0
				? await db.query.photoUploads.findMany({
						where: (t, { and, isNull, isNotNull, eq: colEq }) =>
							and(
								isNull(t.streamVideoUid),
								colEq(t.mediaType, "video"),
								isNotNull(t.r2Key),
							),
						limit: remainingImageSlots,
					})
				: [];

		// Process images
		for (const image of unmigratedImages) {
			try {
				const r2Object = await c.env.BUCKET.get(image.r2Key!);
				if (!r2Object) {
					errors.push({
						id: image.id,
						error: `R2 object not found: ${image.r2Key}`,
					});
					continue;
				}

				// Upload to CF Images
				const formData = new FormData();
				const blob = await r2Object.blob();
				formData.append("file", blob, image.fileName);
				formData.append(
					"metadata",
					JSON.stringify({
						guestId: image.guestId,
						migratedFrom: "r2",
						originalId: image.id,
					}),
				);

				const cfResponse = await fetch(
					`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/images/v1`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${cfToken}`,
						},
						body: formData,
					},
				);

				if (!cfResponse.ok) {
					const errorBody = await cfResponse.text();
					errors.push({
						id: image.id,
						error: `CF Images API error: ${cfResponse.status} ${errorBody}`,
					});
					continue;
				}

				const cfData = await cfResponse.json<{
					result: { id: string };
					success: boolean;
				}>();

				// Update D1 with CF Images ID
				await db
					.update(photoUploads)
					.set({ cloudflareImageId: cfData.result.id })
					.where(eq(photoUploads.id, image.id));

				// Delete R2 object
				await c.env.BUCKET.delete(image.r2Key!);
				if (image.thumbnailR2Key) {
					await c.env.BUCKET.delete(image.thumbnailR2Key);
				}

				migratedImages++;
				console.log(
					`✅ Migrated image ${image.id} → CF Images ${cfData.result.id}`,
				);
			} catch (err) {
				errors.push({
					id: image.id,
					error: err instanceof Error ? err.message : String(err),
				});
			}
		}

		// Process videos
		for (const video of unmigratedVideos) {
			try {
				const r2Object = await c.env.BUCKET.get(video.r2Key!);
				if (!r2Object) {
					errors.push({
						id: video.id,
						error: `R2 object not found: ${video.r2Key}`,
					});
					continue;
				}

				// Check size — CF Stream direct upload limit is 200MB from Worker
				if (video.fileSize > 200 * 1024 * 1024) {
					errors.push({
						id: video.id,
						error: `Video too large for Worker migration (${(video.fileSize / 1024 / 1024).toFixed(1)}MB > 200MB). Will continue serving from R2 fallback.`,
					});
					continue;
				}

				// Upload to CF Stream
				const streamFormData = new FormData();
				const blob = await r2Object.blob();
				streamFormData.append("file", blob, video.fileName);
				streamFormData.append(
					"meta",
					JSON.stringify({
						guestId: video.guestId,
						migratedFrom: "r2",
						originalId: video.id,
					}),
				);

				const cfResponse = await fetch(
					`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/stream`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${cfToken}`,
						},
						body: streamFormData,
					},
				);

				if (!cfResponse.ok) {
					const errorBody = await cfResponse.text();
					errors.push({
						id: video.id,
						error: `CF Stream API error: ${cfResponse.status} ${errorBody}`,
					});
					continue;
				}

				const cfData = await cfResponse.json<{
					result: { uid: string };
					success: boolean;
				}>();

				// Update D1 with Stream UID (streamReady will be set by webhook)
				await db
					.update(photoUploads)
					.set({
						streamVideoUid: cfData.result.uid,
						streamReady: false,
					})
					.where(eq(photoUploads.id, video.id));

				// Delete R2 object
				await c.env.BUCKET.delete(video.r2Key!);
				if (video.thumbnailR2Key) {
					await c.env.BUCKET.delete(video.thumbnailR2Key);
				}

				migratedVideos++;
				console.log(
					`✅ Migrated video ${video.id} → CF Stream ${cfData.result.uid}`,
				);
			} catch (err) {
				errors.push({
					id: video.id,
					error: err instanceof Error ? err.message : String(err),
				});
			}
		}

		// Count remaining unmigrated items
		const allUnmigratedImages = await db.query.photoUploads.findMany({
			columns: { id: true },
			where: (t, { and, isNull, isNotNull, eq: colEq }) =>
				and(
					isNull(t.cloudflareImageId),
					colEq(t.mediaType, "image"),
					isNotNull(t.r2Key),
				),
		});
		const allUnmigratedVideos = await db.query.photoUploads.findMany({
			columns: { id: true },
			where: (t, { and, isNull, isNotNull, eq: colEq }) =>
				and(
					isNull(t.streamVideoUid),
					colEq(t.mediaType, "video"),
					isNotNull(t.r2Key),
				),
		});

		return c.json({
			migrated: migratedImages + migratedVideos,
			migratedImages,
			migratedVideos,
			remaining: allUnmigratedImages.length + allUnmigratedVideos.length,
			remainingImages: allUnmigratedImages.length,
			remainingVideos: allUnmigratedVideos.length,
			errors,
		});
	} catch (error) {
		console.error("❌ Migration error:", error);
		return c.json(
			{
				error: "Migration failed",
				details: error instanceof Error ? error.message : String(error),
				migrated: migratedImages + migratedVideos,
				errors,
			},
			500,
		);
	}
});

// Admin mode validation endpoint
app.get("/api/admin/verify", async (c) => {
	const adminSecret = c.req.query("adminSecret");
	const expectedSecret = c.env.SECRET;

	if (!adminSecret || adminSecret !== expectedSecret) {
		return c.json({ valid: false }, 401);
	}

	return c.json({ valid: true });
});

// Couple mode validation endpoint
app.get("/api/couple/verify", async (c) => {
	const coupleSecret = c.req.query("coupleSecret");
	const expectedSecret = c.env.COUPLE_SECRET;

	if (!coupleSecret || !expectedSecret || coupleSecret !== expectedSecret) {
		return c.json({ valid: false }, 401);
	}

	return c.json({ valid: true });
});

// Serve static assets and handle SPA routing
app.get("/*", async (c) => {
	const url = new URL(c.req.url);

	console.log(`[SPA] Catch-all hit: ${url.pathname}${url.search}`);

	// Try to fetch the requested asset
	const assetResponse = await c.env.ASSETS.fetch(c.req.raw);

	console.log(
		`[SPA] ASSETS response for ${url.pathname}: status=${assetResponse.status}, ok=${assetResponse.ok}, type=${assetResponse.headers.get("content-type")}, location=${assetResponse.headers.get("location")}`,
	);

	// If asset exists and is a real file (not a redirect/404), return it
	if (assetResponse.ok) {
		return assetResponse;
	}

	// Otherwise, serve index.html for SPA routing (gallery, etc.)
	console.log(`[SPA] Serving index.html for SPA route: ${url.pathname}`);
	const indexRequest = new Request(
		new URL("/index.html", url.origin),
		c.req.raw,
	);
	const indexResponse = await c.env.ASSETS.fetch(indexRequest);
	console.log(
		`[SPA] index.html response: status=${indexResponse.status}, ok=${indexResponse.ok}, type=${indexResponse.headers.get("content-type")}`,
	);
	return indexResponse;
});

app.get("/version", (c) => {
	return c.json({ version: "202512300006" }, 200);
});

/**
 * Worker entry point that routes incoming requests to the appropriate handler
 */
export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
