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

// Photo upload API
// POST /api/photos - Upload photo
app.post("/api/photos", async (c) => {
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
			with: { guests: true },
		});

		if (!group) {
			return c.json({ error: "Invalid QR token" }, 403);
		}

		// Get guestId from header, or use first guest from group
		let guestId = c.req.header("x-guest-id");

		if (!guestId && group.guests.length > 0) {
			guestId = group.guests[0].id;
		}

		if (!guestId) {
			return c.json({ error: "No guest available in group" }, 400);
		}

		// Parse multipart form data
		const formData = await c.req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return c.json({ error: "No file provided" }, 400);
		}

		// Validate file type
		const allowedTypes = [
			"image/jpeg",
			"image/png",
			"image/heic",
			"image/heif",
			"image/webp",
		];
		if (!allowedTypes.includes(file.type)) {
			return c.json({ error: "Invalid file type" }, 400);
		}

		// Validate file size (max 25MB)
		const maxSize = 25 * 1024 * 1024; // 25MB
		if (file.size > maxSize) {
			return c.json({ error: "File too large (max 25MB)" }, 400);
		}

		// Generate photo ID and R2 key
		const photoId = crypto.randomUUID();
		const fileExtension = file.name.split(".").pop() || "jpg";
		const r2Key = `groups/${group.id}/photos/${photoId}.${fileExtension}`;

		// Upload to R2
		await c.env.BUCKET.put(r2Key, file.stream(), {
			httpMetadata: {
				contentType: file.type,
			},
		});

		// Save metadata to D1
		await db.insert(photoUploads).values({
			fileName: file.name,
			fileSize: file.size,
			guestId,
			id: photoId,
			mimeType: file.type,
			r2Key,
		});

		return c.json({
			fileName: file.name,
			id: photoId,
			uploadedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Photo upload error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to upload photo",
			},
			500,
		);
	}
});

// GET /api/photos - List photos for group
app.get("/api/photos", async (c) => {
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

		// Return photos with thumbnail and full URLs
		const photosWithUrls = photos.map((photo) => ({
			fileName: photo.fileName,
			fullUrl: `/api/photos/${photo.id}/full`,
			id: photo.id,
			thumbnailUrl: `/api/photos/${photo.id}/thumbnail`,
			uploadedAt: photo.uploadedAt,
		}));

		return c.json({ photos: photosWithUrls });
	} catch (error) {
		console.error("Photo list error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to list photos",
			},
			500,
		);
	}
});

// GET /api/photos/:id/thumbnail - Get thumbnail
app.get("/api/photos/:id/thumbnail", async (c) => {
	try {
		const photoId = c.req.param("id");
		const db = createDb(c.env.DB);

		// Get photo metadata
		const photo = await db.query.photoUploads.findFirst({
			where: (t, { eq }) => eq(t.id, photoId),
		});

		if (!photo) {
			return c.json({ error: "Photo not found" }, 404);
		}

		// Get object from R2
		const object = await c.env.BUCKET.get(photo.r2Key);
		if (!object) {
			return c.json({ error: "Photo file not found in storage" }, 404);
		}

		// Return with Cloudflare Image Resizing headers
		return new Response(object.body, {
			headers: {
				"Cache-Control": "public, max-age=31536000",
				"CF-Image-Fit": "cover",
				"CF-Image-Format": "webp",
				"CF-Image-Height": "400",
				"CF-Image-Width": "400",
				"Content-Type": photo.mimeType,
			},
		});
	} catch (error) {
		console.error("Thumbnail error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to get thumbnail",
			},
			500,
		);
	}
});

// GET /api/photos/:id/full - Get full resolution
app.get("/api/photos/:id/full", async (c) => {
	try {
		const photoId = c.req.param("id");
		const db = createDb(c.env.DB);

		// Get photo metadata
		const photo = await db.query.photoUploads.findFirst({
			where: (t, { eq }) => eq(t.id, photoId),
		});

		if (!photo) {
			return c.json({ error: "Photo not found" }, 404);
		}

		// Get object from R2
		const object = await c.env.BUCKET.get(photo.r2Key);
		if (!object) {
			return c.json({ error: "Photo file not found in storage" }, 404);
		}

		// Return full resolution
		return new Response(object.body, {
			headers: {
				"Cache-Control": "public, max-age=31536000",
				"Content-Disposition": `inline; filename="${photo.fileName}"`,
				"Content-Type": photo.mimeType,
			},
		});
	} catch (error) {
		console.error("Full photo error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to get photo",
			},
			500,
		);
	}
});

// DELETE /api/photos/:id - Delete photo
app.delete("/api/photos/:id", async (c) => {
	try {
		// Get QR token from header for auth
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			return c.json({ error: "Missing QR token" }, 401);
		}

		const photoId = c.req.param("id");
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

		// Delete from R2
		await c.env.BUCKET.delete(photo.r2Key);

		// Delete from D1
		await db.delete(photoUploads).where(eq(photoUploads.id, photoId));

		return c.json({ success: true });
	} catch (error) {
		console.error("Photo delete error:", error);
		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to delete photo",
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
			"audio/mp4": "m4a",
			"audio/mpeg": "mp3",
			"audio/ogg": "ogg",
			"audio/wav": "wav",
			"audio/webm": "webm",
			"audio/aac": "aac",
			"audio/3gpp": "3gp",
			"audio/3gpp2": "3g2",
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

// Admin mode validation endpoint
app.get("/api/admin/verify", async (c) => {
	const adminSecret = c.req.query("adminSecret");
	const expectedSecret = c.env.SECRET;

	if (!adminSecret || adminSecret !== expectedSecret) {
		return c.json({ valid: false }, 401);
	}

	return c.json({ valid: true });
});

// Serve static assets and handle SPA routing
app.get("/*", async (c) => {
	const url = new URL(c.req.url);

	// Try to fetch the requested asset
	const assetResponse = await c.env.ASSETS.fetch(c.req.raw);

	// If asset exists, return it
	if (assetResponse.status !== 404) {
		return assetResponse;
	}

	// Otherwise, serve index.html for SPA routing
	const indexRequest = new Request(
		new URL("/index.html", url.origin),
		c.req.raw,
	);
	return await c.env.ASSETS.fetch(indexRequest);
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
