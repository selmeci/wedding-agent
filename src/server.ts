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
// POST /api/photos - Upload photo (direct, max 100MB)
app.post("/api/photos", async (c) => {
	console.log("📤 POST /api/photos - Direct upload started");
	try {
		// Get QR token from header for auth
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			console.log("❌ POST /api/photos - Missing QR token");
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
			console.log("❌ POST /api/photos - No file provided");
			return c.json({ error: "No file provided" }, 400);
		}

		console.log(
			`📁 POST /api/photos - File: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`,
		);

		// Validate file type
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
		const allowedTypes = [...imageTypes, ...videoTypes];
		if (!allowedTypes.includes(file.type)) {
			console.log(`❌ POST /api/photos - Invalid file type: ${file.type}`);
			return c.json({ error: "Invalid file type" }, 400);
		}

		const isVideo = videoTypes.includes(file.type);
		const mediaType = isVideo ? "video" : "image";

		// Validate file size (100MB max - Cloudflare Workers limit)
		const maxSize = 100 * 1024 * 1024;
		if (file.size > maxSize) {
			console.log(
				`❌ POST /api/photos - File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB > 100MB`,
			);
			return c.json({ error: "Súbor je príliš veľký (max 100MB)" }, 400);
		}

		// Get thumbnail and duration for videos
		const thumbnailFile = formData.get("thumbnail") as File | null;
		const durationStr = formData.get("duration") as string | null;
		const duration = durationStr ? Number.parseInt(durationStr, 10) : null;

		// Generate media ID and R2 key
		const mediaId = crypto.randomUUID();
		const fileExtension =
			file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
		const r2Key = `groups/${group.id}/photos/${mediaId}.${fileExtension}`;

		// Upload to R2
		console.log(`⬆️ POST /api/photos - Uploading to R2: ${r2Key}`);
		await c.env.BUCKET.put(r2Key, file.stream(), {
			httpMetadata: {
				contentType: file.type,
			},
		});
		console.log(`✅ POST /api/photos - R2 upload complete: ${r2Key}`);

		// Upload thumbnail for videos
		let thumbnailR2Key: string | null = null;
		if (isVideo && thumbnailFile) {
			thumbnailR2Key = `groups/${group.id}/photos/${mediaId}_thumb.webp`;
			await c.env.BUCKET.put(thumbnailR2Key, thumbnailFile.stream(), {
				httpMetadata: {
					contentType: "image/webp",
				},
			});
		}

		// Save metadata to D1
		await db.insert(photoUploads).values({
			duration: isVideo && duration ? duration : null,
			fileName: file.name,
			fileSize: file.size,
			guestId,
			id: mediaId,
			mediaType,
			mimeType: file.type,
			r2Key,
			thumbnailR2Key,
		});

		console.log(
			`✅ POST /api/photos - Success: ${mediaId} (${mediaType}, ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
		);
		return c.json({
			duration: isVideo && duration ? duration : undefined,
			fileName: file.name,
			id: mediaId,
			mediaType,
			uploadedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("❌ POST /api/photos - Error:", error);
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

		// Return photos with thumbnail and full URLs
		const photosWithUrls = photos.map((photo) => ({
			duration: photo.duration,
			fileName: photo.fileName,
			fullUrl: `/api/photos/${photo.id}/full`,
			id: photo.id,
			mediaType: photo.mediaType,
			thumbnailUrl: `/api/photos/${photo.id}/thumbnail`,
			uploadedAt: photo.uploadedAt,
		}));

		console.log(
			`✅ GET /api/photos - Found ${photos.length} items (${photos.filter((p) => p.mediaType === "video").length} videos, ${photos.filter((p) => p.mediaType === "image").length} images)`,
		);
		return c.json({ photos: photosWithUrls });
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

// GET /api/photos/:id/thumbnail - Get thumbnail
app.get("/api/photos/:id/thumbnail", async (c) => {
	const photoId = c.req.param("id");
	console.log(`🖼️ GET /api/photos/${photoId}/thumbnail - Request started`);
	try {
		const db = createDb(c.env.DB);

		// Get photo metadata
		const media = await db.query.photoUploads.findFirst({
			where: (t, { eq }) => eq(t.id, photoId),
		});

		if (!media) {
			console.log(
				`❌ GET /api/photos/${photoId}/thumbnail - Media not found in DB`,
			);
			return c.json({ error: "Media not found" }, 404);
		}

		console.log(
			`🖼️ GET /api/photos/${photoId}/thumbnail - Found ${media.mediaType}, r2Key=${media.r2Key}, thumbnailR2Key=${media.thumbnailR2Key}`,
		);

		// For videos, return the stored thumbnail
		if (media.mediaType === "video" && media.thumbnailR2Key) {
			const thumbnail = await c.env.BUCKET.get(media.thumbnailR2Key);
			if (!thumbnail) {
				console.log(
					`❌ GET /api/photos/${photoId}/thumbnail - Video thumbnail not found in R2: ${media.thumbnailR2Key}`,
				);
				return c.json({ error: "Video thumbnail not found in storage" }, 404);
			}
			console.log(
				`✅ GET /api/photos/${photoId}/thumbnail - Serving video thumbnail`,
			);

			return new Response(thumbnail.body, {
				headers: {
					"Cache-Control": "public, max-age=31536000",
					"Content-Type": "image/webp",
				},
			});
		}

		// For images, use Cloudflare Image Resizing
		const object = await c.env.BUCKET.get(media.r2Key);
		if (!object) {
			console.log(
				`❌ GET /api/photos/${photoId}/thumbnail - Image not found in R2: ${media.r2Key}`,
			);
			return c.json({ error: "Photo file not found in storage" }, 404);
		}

		console.log(
			`✅ GET /api/photos/${photoId}/thumbnail - Serving image thumbnail`,
		);
		// Return with Cloudflare Image Resizing headers
		return new Response(object.body, {
			headers: {
				"Cache-Control": "public, max-age=31536000",
				"CF-Image-Fit": "cover",
				"CF-Image-Format": "webp",
				"CF-Image-Height": "400",
				"CF-Image-Width": "400",
				"Content-Type": media.mimeType,
			},
		});
	} catch (error) {
		console.error(`❌ GET /api/photos/${photoId}/thumbnail - Error:`, error);
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
	const photoId = c.req.param("id");
	console.log(`📺 GET /api/photos/${photoId}/full - Request started`);
	try {
		const db = createDb(c.env.DB);

		// Get photo metadata
		const photo = await db.query.photoUploads.findFirst({
			where: (t, { eq }) => eq(t.id, photoId),
		});

		if (!photo) {
			console.log(`❌ GET /api/photos/${photoId}/full - Not found in DB`);
			return c.json({ error: "Photo not found" }, 404);
		}

		console.log(
			`📺 GET /api/photos/${photoId}/full - Found ${photo.mediaType}, r2Key=${photo.r2Key}, size=${photo.fileSize}`,
		);

		// Get object from R2
		const object = await c.env.BUCKET.get(photo.r2Key);
		if (!object) {
			console.log(
				`❌ GET /api/photos/${photoId}/full - File not found in R2: ${photo.r2Key}`,
			);
			return c.json({ error: "Photo file not found in storage" }, 404);
		}

		console.log(
			`✅ GET /api/photos/${photoId}/full - Serving ${photo.mediaType} (${(photo.fileSize / 1024 / 1024).toFixed(2)}MB)`,
		);
		// Return full resolution
		return new Response(object.body, {
			headers: {
				"Cache-Control": "public, max-age=31536000",
				"Content-Disposition": `inline; filename="${photo.fileName}"`,
				"Content-Type": photo.mimeType,
			},
		});
	} catch (error) {
		console.error(`❌ GET /api/photos/${photoId}/full - Error:`, error);
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

		// Delete from R2
		await c.env.BUCKET.delete(photo.r2Key);

		// Delete thumbnail if exists (for videos)
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

// Presigned URL API for large file uploads
// POST /api/media/presign - Get presigned URL for direct R2 upload
app.post("/api/media/presign", async (c) => {
	console.log("🔑 POST /api/media/presign - Presign request started");
	try {
		// Get QR token from header for auth
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			console.log("❌ POST /api/media/presign - Missing QR token");
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

		// Parse request body
		const { fileName, contentType, fileSize } = await c.req.json<{
			fileName: string;
			contentType: string;
			fileSize: number;
		}>();

		console.log(
			`📁 POST /api/media/presign - File: ${fileName}, Size: ${(fileSize / 1024 / 1024).toFixed(2)}MB, Type: ${contentType}`,
		);

		// Allowed MIME types
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
		const allowedTypes = [...imageTypes, ...videoTypes];

		if (!allowedTypes.includes(contentType)) {
			return c.json({ error: "Nepovolený typ súboru" }, 400);
		}

		// Validate file size (1GB max for presigned uploads)
		const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
		if (fileSize > MAX_FILE_SIZE) {
			return c.json({ error: "Súbor je príliš veľký (max 1GB)" }, 400);
		}

		// Generate media ID and R2 key
		const mediaId = crypto.randomUUID();
		const fileExtension = fileName.split(".").pop()?.toLowerCase() || "bin";
		const r2Key = `groups/${group.id}/photos/${mediaId}.${fileExtension}`;
		const isVideo = videoTypes.includes(contentType);

		// Create R2 client and generate presigned URL
		const { createR2Client, generatePresignedPutUrl } = await import(
			"@/utils/r2-presign"
		);

		const r2Client = createR2Client({
			endpoint: c.env.R2_ENDPOINT,
			accessKeyId: c.env.R2_ACCESS_KEY_ID,
			secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
		});

		const uploadUrl = await generatePresignedPutUrl(
			r2Client,
			"wedding-photos",
			r2Key,
			contentType,
			3600, // 1 hour expiry
		);

		console.log(
			`✅ POST /api/media/presign - Success: ${mediaId}, r2Key: ${r2Key}`,
		);
		return c.json({
			mediaId,
			uploadUrl,
			r2Key,
			mediaType: isVideo ? "video" : "image",
			guestId,
		});
	} catch (error) {
		console.error("❌ POST /api/media/presign - Error:", error);
		return c.json(
			{
				error: "Failed to generate upload URL",
				details: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
});

// POST /api/media/confirm - Confirm upload and save metadata
app.post("/api/media/confirm", async (c) => {
	console.log("✔️ POST /api/media/confirm - Confirm request started");
	try {
		// Get QR token from header for auth
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			console.log("❌ POST /api/media/confirm - Missing QR token");
			return c.json({ error: "Missing QR token" }, 401);
		}

		const db = createDb(c.env.DB);

		// Validate QR token and get group
		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
			with: { guests: true },
		});

		if (!group) {
			console.log("❌ POST /api/media/confirm - Invalid QR token");
			return c.json({ error: "Invalid QR token" }, 403);
		}

		// Parse form data
		console.log("📋 POST /api/media/confirm - Parsing form data...");
		const formData = await c.req.formData();
		const mediaId = formData.get("mediaId") as string;
		const r2Key = formData.get("r2Key") as string;
		const fileName = formData.get("fileName") as string;
		const guestId = formData.get("guestId") as string;
		const mediaType = formData.get("mediaType") as "image" | "video";
		const durationStr = formData.get("duration") as string | null;
		const thumbnailFile = formData.get("thumbnail") as File | null;

		console.log(
			`📋 POST /api/media/confirm - Data: mediaId=${mediaId}, r2Key=${r2Key}, fileName=${fileName}, mediaType=${mediaType}, duration=${durationStr}, hasThumbnail=${!!thumbnailFile}`,
		);

		if (!mediaId || !r2Key || !fileName || !guestId || !mediaType) {
			console.log(
				`❌ POST /api/media/confirm - Missing required fields: mediaId=${!!mediaId}, r2Key=${!!r2Key}, fileName=${!!fileName}, guestId=${!!guestId}, mediaType=${!!mediaType}`,
			);
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

		// Verify file exists in R2
		console.log(`🔍 POST /api/media/confirm - Verifying file in R2: ${r2Key}`);
		const { createR2Client, verifyObjectExists } = await import(
			"@/utils/r2-presign"
		);

		const r2Client = createR2Client({
			endpoint: c.env.R2_ENDPOINT,
			accessKeyId: c.env.R2_ACCESS_KEY_ID,
			secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
		});

		const verification = await verifyObjectExists(
			r2Client,
			"wedding-photos",
			r2Key,
		);
		console.log(
			`🔍 POST /api/media/confirm - R2 verification: exists=${verification.exists}, size=${verification.size}, contentType=${verification.contentType}`,
		);
		if (!verification.exists) {
			console.log(
				`❌ POST /api/media/confirm - File not found in R2: ${r2Key}`,
			);
			return c.json({ error: "File not found in storage", r2Key }, 400);
		}

		// Upload thumbnail for videos (via Worker binding - small file)
		let thumbnailR2Key: string | null = null;
		if (mediaType === "video" && thumbnailFile) {
			thumbnailR2Key = `groups/${group.id}/photos/${mediaId}_thumb.webp`;
			console.log(
				`🖼️ POST /api/media/confirm - Uploading thumbnail: ${thumbnailR2Key}`,
			);
			await c.env.BUCKET.put(thumbnailR2Key, thumbnailFile.stream(), {
				httpMetadata: { contentType: "image/webp" },
			});
			console.log(`✅ POST /api/media/confirm - Thumbnail uploaded`);
		}

		// Save metadata to D1
		const duration = durationStr ? Number.parseInt(durationStr, 10) : null;

		console.log(
			`💾 POST /api/media/confirm - Saving to DB: id=${mediaId}, size=${verification.size}, duration=${duration}`,
		);
		await db.insert(photoUploads).values({
			id: mediaId,
			fileName,
			fileSize: verification.size || 0,
			mimeType: verification.contentType || "application/octet-stream",
			mediaType,
			duration,
			r2Key,
			thumbnailR2Key,
			guestId,
		});

		console.log(
			`✅ POST /api/media/confirm - Success: ${mediaId} (${mediaType}, ${(verification.size || 0) / 1024 / 1024}MB)`,
		);
		return c.json({
			success: true,
			id: mediaId,
			mediaType,
			fileName,
			duration,
			uploadedAt: new Date().toISOString(),
		});
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
