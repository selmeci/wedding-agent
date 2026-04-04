# Fix Media Upload Pipeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken photo/video uploads so all formats work reliably on both Android and iPhone, previews display correctly, and original files are preserved in R2.

**Architecture:** The current pipeline sends the entire original file through the Worker's `/api/media/confirm` endpoint (via FormData), which buffers the whole file in memory and hits the 100MB Worker body limit. Fix: split the confirm endpoint into metadata-only JSON confirm + a separate streaming endpoint for the original file that pipes `request.body` directly to R2 without buffering. Also fix mobile file type detection, video thumbnail fallback, and add a client-side file size guard.

**Tech Stack:** Cloudflare Workers, R2, CF Images, CF Stream, Hono, React, TypeScript

---

## Root Cause Analysis

| # | Bug | Severity | Root Cause |
|---|-----|----------|------------|
| 1 | Uploads fail for large files (especially after first video) | **Critical** | Commit `22ecf2c` changed `/api/media/confirm` from JSON to FormData with the **entire original file**. Worker buffers it via `arrayBuffer()` (128MB memory limit) and the edge enforces a 100MB body size limit (no `[limits]` in wrangler.jsonc). |
| 2 | Video previews/thumbnails don't show | **High** | CF Stream thumbnails return 404 until processing completes (`streamReady=true` via webhook). No fallback shown during processing. |
| 3 | Mobile uploads rejected or misclassified | **Medium** | `file.type` can be empty on iOS/Android. Server rejects unknown content types. No extension-based fallback. |
| 4 | No file size guard | **Medium** | No client-side or server-side size limit. Large files fail silently deep in the pipeline. |

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `wrangler.jsonc` | Add `[limits]` section to raise body size to 500MB |
| Modify | `src/server.ts` | Revert confirm to JSON-only; add streaming `/api/media/upload-original/:mediaId` endpoint; fix content-type validation |
| Modify | `src/utils/media-upload.ts` | Split upload into 3 steps: CF upload → original stream to R2 → JSON confirm; add extension-based MIME fallback |
| Modify | `src/components/PhotoUpload.tsx` | Add file size guard; fix post-upload preview for videos during processing |
| Modify | `src/components/Gallery/GalleryPage.tsx` | Fix video thumbnail placeholder during processing |

---

## Task 1: Increase Worker body size limit

**Files:**
- Modify: `wrangler.jsonc`

This is the quickest safety net — even after we fix the streaming, it protects against edge cases.

- [ ] **Step 1: Add limits section to wrangler.jsonc**

Add the `"limits"` key after the `"vars"` block (before the trailing comments):

```jsonc
  "limits": {
    "cpu_ms": 30000
  }
```

> Note: `cpu_ms: 30000` raises the CPU time limit for large R2 streams. The actual incoming body size for the new streaming endpoint is controlled by Workers Standard pricing (default 100MB is fine for the new raw-body streaming approach since we bypass FormData parsing). We do NOT set `body_size` here because the new architecture avoids large bodies on the confirm endpoint.

- [ ] **Step 2: Verify wrangler config parses correctly**

Run: `npx wrangler deploy --dry-run 2>&1 | head -20`
Expected: No JSON parse errors. May show "Total Upload" size info.

- [ ] **Step 3: Commit**

```bash
git add wrangler.jsonc
git commit -m "chore: raise Worker CPU time limit for large R2 streams"
```

---

## Task 2: Add streaming original-upload endpoint to server

**Files:**
- Modify: `src/server.ts:815-941` (confirm endpoint area)

This is the critical fix. We add a new endpoint that streams the raw request body directly to R2 (no FormData parsing, no `arrayBuffer()` buffering), then revert the confirm endpoint to accept JSON only.

- [ ] **Step 1: Add the streaming upload-original endpoint**

Add this new endpoint **before** the existing `POST /api/media/confirm` endpoint (around line 815):

```typescript
// PUT /api/media/upload-original/:mediaId - Stream original file to R2 (no buffering)
app.put("/api/media/upload-original/:mediaId", async (c) => {
	const mediaId = c.req.param("mediaId");
	console.log(`📦 PUT /api/media/upload-original/${mediaId} - Stream started`);
	try {
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
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

		const fileName = c.req.header("x-file-name") || "unknown";
		const mimeType = c.req.header("content-type") || "application/octet-stream";
		const ext = fileName.split(".").pop()?.toLowerCase() || "bin";
		const r2Key = `groups/${group.id}/originals/${mediaId}.${ext}`;

		const body = c.req.raw.body;
		if (!body) {
			return c.json({ error: "Empty body" }, 400);
		}

		// Stream directly to R2 — no buffering in Worker memory
		await c.env.BUCKET.put(r2Key, body, {
			httpMetadata: { contentType: mimeType },
		});

		// Update the photo_uploads record with the R2 key
		await db
			.update(photoUploads)
			.set({ r2Key })
			.where(eq(photoUploads.id, mediaId));

		console.log(
			`✅ PUT /api/media/upload-original/${mediaId} - Stored at ${r2Key}`,
		);
		return c.json({ r2Key, success: true });
	} catch (error) {
		console.error(
			`❌ PUT /api/media/upload-original/${mediaId} - Error:`,
			error,
		);
		return c.json(
			{
				error: "Failed to store original",
				details: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
});
```

- [ ] **Step 2: Revert confirm endpoint to JSON-only**

Replace the entire `POST /api/media/confirm` handler (currently lines ~816-941) with this version that accepts JSON instead of FormData:

```typescript
// POST /api/media/confirm - Confirm CF Images/Stream upload and save metadata (JSON only, no file)
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

		const {
			mediaId,
			fileName,
			guestId,
			mediaType,
			fileSize,
			mimeType,
			cloudflareImageId,
			streamVideoUid,
		} = await c.req.json<{
			mediaId: string;
			fileName: string;
			guestId: string;
			mediaType: "image" | "video";
			fileSize: number;
			mimeType: string;
			cloudflareImageId?: string | null;
			streamVideoUid?: string | null;
		}>();

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

		if (cloudflareImageId) {
			console.log(
				`💾 POST /api/media/confirm - CF Images: id=${mediaId}, cfImageId=${cloudflareImageId}`,
			);
			await db.insert(photoUploads).values({
				id: mediaId,
				fileName,
				fileSize,
				mimeType: mimeType || "application/octet-stream",
				mediaType: "image",
				cloudflareImageId,
				guestId,
			});

			return c.json({
				id: mediaId,
				mediaType: "image",
				fileName,
				success: true,
				uploadedAt: new Date().toISOString(),
			});
		}

		if (streamVideoUid) {
			console.log(
				`💾 POST /api/media/confirm - CF Stream: id=${mediaId}, streamUid=${streamVideoUid}`,
			);
			await db.insert(photoUploads).values({
				id: mediaId,
				fileName,
				fileSize,
				mimeType: mimeType || "application/octet-stream",
				mediaType: "video",
				streamVideoUid,
				streamReady: false,
				guestId,
			});

			return c.json({
				id: mediaId,
				mediaType: "video",
				fileName,
				success: true,
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
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No errors related to the changed endpoints.

- [ ] **Step 4: Commit**

```bash
git add src/server.ts
git commit -m "fix: split confirm into JSON metadata + streaming original upload

Reverts confirm endpoint from FormData (which buffered entire file in
Worker memory, hitting 100MB body limit) to JSON-only metadata.
Adds PUT /api/media/upload-original/:mediaId that streams raw body
directly to R2 without buffering."
```

---

## Task 3: Update client upload flow — 3-step pipeline

**Files:**
- Modify: `src/utils/media-upload.ts`

Change the client to: (1) upload to CF, (2) confirm with JSON metadata, (3) stream original to R2 via the new endpoint. Also add extension-based MIME type fallback for mobile devices where `file.type` is empty.

- [ ] **Step 1: Add MIME type fallback helper**

Add this helper function at the top of `media-upload.ts`, after the existing imports:

```typescript
/** Infer MIME type from file extension when file.type is empty (common on iOS/Android) */
function inferMimeType(file: File): string {
	if (file.type) return file.type;
	const ext = file.name.split(".").pop()?.toLowerCase();
	const mimeMap: Record<string, string> = {
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		heic: "image/heic",
		heif: "image/heif",
		webp: "image/webp",
		mp4: "video/mp4",
		mov: "video/quicktime",
		webm: "video/webm",
		m4v: "video/x-m4v",
		"3gp": "video/3gpp",
	};
	return (ext && mimeMap[ext]) || "application/octet-stream";
}

/** Check if a MIME type is a video type */
function isVideoMimeType(mimeType: string): boolean {
	const videoTypes = [
		"video/mp4",
		"video/quicktime",
		"video/webm",
		"video/x-m4v",
		"video/3gpp",
	];
	return videoTypes.includes(mimeType.split(";")[0].trim());
}
```

- [ ] **Step 2: Rewrite uploadMediaViaCF to use the 3-step pipeline**

Replace the body of `uploadMediaViaCF` (from the `const videoTypes` line through the end of the function) with:

```typescript
export async function uploadMediaViaCF(
	file: File,
	qrToken: string,
	guestId: string | null,
	onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
	const mimeType = inferMimeType(file);
	const isVideo = isVideoMimeType(mimeType);
	const mediaType: "image" | "video" = isVideo ? "video" : "image";

	console.log(
		`[CF Upload] Starting: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, ${mediaType}, mime=${mimeType})`,
	);

	// Step 1: Get one-time upload URL from our Worker
	onProgress?.({ phase: "preparing", percent: 0 });

	const uploadUrlData = await retryWithBackoff(
		() =>
			jsonPost<CFUploadUrlResponse>(
				"/api/media/upload-url",
				{
					fileName: file.name,
					contentType: mimeType,
					mediaType,
				},
				authHeaders(qrToken, guestId),
			),
		{
			maxRetries: 3,
			onRetry: (attempt) =>
				console.log(`[CF Upload] Upload URL retry #${attempt}`),
		},
	);

	const resolvedGuestId = uploadUrlData.guestId;

	// Step 2: Upload file directly to CF via XHR (for progress tracking)
	onProgress?.({ phase: "uploading", percent: 0 });

	await retryWithBackoff(
		() =>
			new Promise<void>((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				xhr.upload.addEventListener("progress", (e) => {
					if (e.lengthComputable) {
						onProgress?.({
							phase: "uploading",
							percent: Math.round((e.loaded / e.total) * 100),
						});
					}
				});

				xhr.addEventListener("load", () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						resolve();
					} else {
						reject(
							new Error(
								`CF upload failed: status ${xhr.status} ${xhr.responseText?.substring(0, 200)}`,
							),
						);
					}
				});

				xhr.addEventListener("error", () => {
					reject(
						new Error(
							`CF upload network error (readyState=${xhr.readyState}, status=${xhr.status})`,
						),
					);
				});

				xhr.addEventListener("timeout", () => {
					reject(new Error("CF upload timeout"));
				});

				xhr.timeout = 10 * 60 * 1000; // 10 min for large videos
				xhr.open("POST", uploadUrlData.uploadURL);

				// CF Direct Creator Upload expects FormData with a "file" field
				const formData = new FormData();
				formData.append("file", file);
				xhr.send(formData);
			}),
		{
			maxRetries: 2,
			onRetry: (attempt) =>
				console.log(`[CF Upload] File upload retry #${attempt}`),
		},
	);

	// Step 3: Confirm upload with JSON metadata (no file — fast, small payload)
	onProgress?.({ phase: "confirming", percent: 100 });

	const confirmBody: Record<string, unknown> = {
		mediaId: uploadUrlData.mediaId,
		fileName: file.name,
		guestId: resolvedGuestId,
		mediaType,
		fileSize: file.size,
		mimeType,
	};

	if (mediaType === "image") {
		confirmBody.cloudflareImageId = uploadUrlData.mediaId;
	} else {
		confirmBody.streamVideoUid = uploadUrlData.mediaId;
	}

	const result = await retryWithBackoff(
		async () => {
			const response = await fetch("/api/media/confirm", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-qr-token": qrToken,
				},
				body: JSON.stringify(confirmBody),
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				throw new Error(
					(error as { error?: string }).error || "Failed to confirm CF upload",
				);
			}

			return response.json() as Promise<UploadResult>;
		},
		{
			maxRetries: 3,
			onRetry: (attempt) =>
				console.log(`[CF Upload] Confirm retry #${attempt}`),
		},
	);

	// Step 4: Stream original file to R2 (background — non-blocking for UX)
	// This runs after the upload is "done" from the user's perspective
	try {
		await fetch(`/api/media/upload-original/${uploadUrlData.mediaId}`, {
			method: "PUT",
			headers: {
				"x-qr-token": qrToken,
				"x-file-name": file.name,
				"Content-Type": mimeType,
			},
			body: file,
		});
		console.log(`[CF Upload] Original stored in R2 for ${file.name}`);
	} catch (err) {
		// Non-fatal — CF still has the file for serving
		console.warn(`[CF Upload] Failed to store original in R2:`, err);
	}

	onProgress?.({ phase: "done", percent: 100 });

	console.log(
		`[CF Upload] Complete: ${file.name} → ${result.id} (${result.mediaType})`,
	);

	return result;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/utils/media-upload.ts
git commit -m "fix: split upload into CF + JSON confirm + R2 stream

Confirm step now sends JSON metadata only (no file). Original file
is streamed to R2 in a separate PUT request with raw body, bypassing
Worker body size limits. Also adds MIME type fallback for mobile
devices where file.type is empty."
```

---

## Task 4: Fix content-type validation on server for mobile

**Files:**
- Modify: `src/server.ts:680-700` (upload-url endpoint validation)

The server rejects files with unexpected content types. Mobile devices often send empty or unusual MIME types. Fix: accept `application/octet-stream` as a fallback and validate by extension.

- [ ] **Step 1: Update content-type validation in upload-url endpoint**

Find the validation block in `POST /api/media/upload-url` (around lines 680-700) and replace:

```typescript
		if (mediaType === "image" && !imageTypes.includes(baseContentType)) {
			return c.json({ error: "Nepovolený typ súboru pre obrázok" }, 400);
		}
		if (mediaType === "video" && !videoTypes.includes(baseContentType)) {
			return c.json({ error: "Nepovolený typ súboru pre video" }, 400);
		}
```

With this more lenient validation that also allows `application/octet-stream` (common on mobile):

```typescript
		const allowedFallback = baseContentType === "application/octet-stream";
		if (
			mediaType === "image" &&
			!imageTypes.includes(baseContentType) &&
			!allowedFallback
		) {
			return c.json({ error: "Nepovolený typ súboru pre obrázok" }, 400);
		}
		if (
			mediaType === "video" &&
			!videoTypes.includes(baseContentType) &&
			!allowedFallback
		) {
			return c.json({ error: "Nepovolený typ súboru pre video" }, 400);
		}
```

- [ ] **Step 2: Commit**

```bash
git add src/server.ts
git commit -m "fix: accept application/octet-stream for mobile uploads

Mobile browsers (especially iOS) sometimes report empty or generic
MIME types. Allow application/octet-stream as fallback since the
client already determines mediaType from the file extension."
```

---

## Task 5: Fix video preview and thumbnail handling

**Files:**
- Modify: `src/components/PhotoUpload.tsx:140-167` (post-upload media item construction)
- Modify: `src/components/Gallery/GalleryPage.tsx:418-427` (thumbnail error handling)

Videos in CF Stream need time to process. During processing, the thumbnail URL returns 404. Fix: show a proper processing placeholder instead of a broken image.

- [ ] **Step 1: Fix post-upload media item in PhotoUpload.tsx**

Find the `newMedia` construction block in `handleFileSelect` (around lines 140-167) and replace it with:

```typescript
					// Add to media list with CF URLs
					const newMedia: Media = {
						fileName: file.name,
						fullUrl: "",
						id: result.id,
						mediaType: result.mediaType || "image",
						thumbnailUrl: "",
						uploadedAt: new Date(),
					};

					if (result.mediaType === "video") {
						// Video — mark as processing, use placeholder
						newMedia.streamVideoUid = result.id;
						newMedia.streamReady = false;
						if (cfStreamCode) {
							newMedia.thumbnailUrl = `https://customer-${cfStreamCode}.cloudflarestream.com/${result.id}/thumbnails/thumbnail.jpg`;
							newMedia.fullUrl = `https://customer-${cfStreamCode}.cloudflarestream.com/${result.id}/iframe?autoplay=true&muted=true`;
						}
					} else {
						// Image — CF Images ready immediately
						newMedia.cloudflareImageId = result.id;
						if (cfImagesHash) {
							newMedia.thumbnailUrl = `https://imagedelivery.net/${cfImagesHash}/${result.id}/thumbnail`;
							newMedia.fullUrl = `https://imagedelivery.net/${cfImagesHash}/${result.id}/public`;
						}
					}
```

This is simpler and correctly sets `streamReady = false` for newly uploaded videos.

- [ ] **Step 2: Add onError fallback for thumbnail images in PhotoUpload.tsx**

In the media grid `<img>` tag (around line 358), add an `onError` handler:

```tsx
								<img
									src={media.thumbnailUrl}
									alt={media.fileName}
									className="w-full h-full object-cover"
									loading="lazy"
									onError={(e) => {
										(e.target as HTMLImageElement).style.opacity = "0.3";
									}}
								/>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PhotoUpload.tsx
git commit -m "fix: correctly handle video preview state after upload

Newly uploaded videos are marked streamReady=false and show processing
state. Thumbnail img elements fade on error instead of showing broken
image icon."
```

---

## Task 6: Add client-side file size guard

**Files:**
- Modify: `src/components/PhotoUpload.tsx` (inside `handleFileSelect`)

Reject files > 500MB with a clear error message rather than letting them fail deep in the pipeline.

- [ ] **Step 1: Add size check at the start of handleFileSelect**

Inside the `for (const file of Array.from(files))` loop, before the `try` block, add:

```typescript
				// Guard: reject files > 500MB
				const maxFileSize = 500 * 1024 * 1024; // 500MB
				if (file.size > maxFileSize) {
					alert(
						`Súbor ${file.name} je príliš veľký (${(file.size / 1024 / 1024).toFixed(0)} MB). Maximum je 500 MB.`,
					);
					continue;
				}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PhotoUpload.tsx
git commit -m "fix: add client-side 500MB file size guard

Large files now show a clear error message instead of failing
silently deep in the upload pipeline."
```

---

## Task 7: Verify CF Stream customer code configuration

**Files:**
- No code changes — verification only

The `CF_STREAM_CUSTOMER_CODE` in `wrangler.jsonc` is set to `fb0866add4b7bc5813b01a16ce090bfc` which is the same as `CF_ACCOUNT_ID`. CF Stream customer subdomain codes are typically different. If this is wrong, ALL video thumbnail and playback URLs are broken.

- [ ] **Step 1: Verify the customer code**

Check the Cloudflare dashboard: **Stream > Settings > Customer Subdomain** (or **Delivery > Customer Subdomain**).

The current URL format is:
```
https://customer-fb0866add4b7bc5813b01a16ce090bfc.cloudflarestream.com/{uid}/...
```

If the dashboard shows a different code, update `wrangler.jsonc`:
```jsonc
"CF_STREAM_CUSTOMER_CODE": "<correct-code-from-dashboard>"
```

- [ ] **Step 2: Test a video thumbnail URL**

If you have an existing video UID from the database, test:
```bash
curl -I "https://customer-fb0866add4b7bc5813b01a16ce090bfc.cloudflarestream.com/<VIDEO_UID>/thumbnails/thumbnail.jpg"
```

Expected: `200 OK` if the code is correct, `404` or DNS error if wrong.

- [ ] **Step 3: If incorrect, update and commit**

```bash
git add wrangler.jsonc
git commit -m "fix: correct CF_STREAM_CUSTOMER_CODE for video delivery"
```

---

## Task 8: Format, build, and deploy

**Files:**
- All modified files

- [ ] **Step 1: Format code**

Run: `pnpm exec biome format --write .`

- [ ] **Step 2: Run checks**

Run: `npm run check`
Expected: No errors.

- [ ] **Step 3: Build**

Run: `npm run deploy -- --dry-run`
Expected: Build succeeds, dry-run shows deployment preview.

- [ ] **Step 4: Deploy**

Run: `npm run deploy`

- [ ] **Step 5: End-to-end verification**

Test each scenario on a real device or emulator:

| Test | Device | Expected |
|------|--------|----------|
| Upload JPEG photo | Android | Succeeds, thumbnail shows immediately |
| Upload HEIC photo | iPhone | Succeeds, thumbnail shows (CF Images converts) |
| Upload MP4 video (<50MB) | Android | Succeeds, shows "processing" then thumbnail |
| Upload MOV video | iPhone | Succeeds, MIME inferred from extension |
| Upload 2nd file after video | Any | Succeeds (no more pipeline blockage) |
| Gallery page loads | Desktop | All thumbnails display, videos playable |
| Download from gallery | Desktop | Original file downloads from R2 |
| Upload >500MB file | Any | Clear Slovak error message shown |
