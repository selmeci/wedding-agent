# Fix Gallery Download Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix gallery downloads for photos/videos that have no R2 copy by falling back to CF Images (for images) and CF Stream (for videos), always serving the original-size file.

**Architecture:** The download endpoint `GET /api/photos/:id/file` currently only checks R2. We add a tiered fallback: R2 first, then CF Images blob API (returns original, proxied — images are small), then CF Stream download URL (302 redirect — videos are large, avoid Worker proxy). We also enable CF Stream downloads at upload time so they're ready when needed. CORS setup for CF Stream is handled post-deploy.

**Tech Stack:** Cloudflare Workers, CF Images API, CF Stream API, Hono

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/server.ts` (lines 517-533) | Modify | Download endpoint — add CF Images + CF Stream fallback |
| `src/server.ts` (lines 770-825) | Modify | Video upload flow — enable CF Stream downloads after upload |

---

### Task 1: Add CF Images fallback to download endpoint

**Files:**
- Modify: `src/server.ts:517-533`

The current endpoint returns 404 when `r2Key` is missing. We extend it to fall back to the CF Images blob API which returns the **original uploaded image** (not a resized variant).

- [ ] **Step 1: Read current endpoint to confirm state**

Read `src/server.ts` lines 517-533 to confirm the current implementation matches our analysis.

- [ ] **Step 2: Modify endpoint with CF Images fallback**

Replace the current endpoint at `src/server.ts:517-533` with this expanded version:

```typescript
// GET /api/photos/:id/file - Download original file (R2 → CF Images → CF Stream fallback)
app.get("/api/photos/:id/file", async (c) => {
	const photoId = c.req.param("id");
	const db = createDb(c.env.DB);
	const photo = await db.query.photoUploads.findFirst({
		where: (t, { eq: colEq }) => colEq(t.id, photoId),
	});
	if (!photo) return c.json({ error: "Not found" }, 404);

	// 1. Try R2 (preferred — has the original file)
	if (photo.r2Key) {
		const obj = await c.env.BUCKET.get(photo.r2Key);
		if (obj) {
			return new Response(obj.body, {
				headers: {
					"Cache-Control": "public, max-age=31536000",
					"Content-Type": photo.mimeType,
					"Content-Disposition": `attachment; filename="${photo.fileName}"`,
				},
			});
		}
	}

	// 2. Fallback: CF Images blob API (returns original uploaded image)
	if (
		photo.cloudflareImageId &&
		!photo.cloudflareImageId.startsWith("migration_skipped")
	) {
		const cfAccountId = c.env.CF_ACCOUNT_ID;
		const cfToken = c.env.CF_IMAGE_TOKEN;
		const blobRes = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/images/v1/${photo.cloudflareImageId}/blob`,
			{ headers: { Authorization: `Bearer ${cfToken}` } },
		);
		if (blobRes.ok) {
			return new Response(blobRes.body, {
				headers: {
					"Cache-Control": "public, max-age=31536000",
					"Content-Type": blobRes.headers.get("Content-Type") || photo.mimeType,
					"Content-Disposition": `attachment; filename="${photo.fileName}"`,
				},
			});
		}
		console.error(
			`CF Images blob fetch failed for ${photo.cloudflareImageId}: ${blobRes.status}`,
		);
	}

	// 3. Fallback: CF Stream download (302 redirect — videos are large, avoid Worker proxy)
	if (photo.streamVideoUid) {
		const cfStreamCode = c.env.CF_STREAM_CUSTOMER_CODE;
		const downloadUrl = `https://customer-${cfStreamCode}.cloudflarestream.com/${photo.streamVideoUid}/downloads/default.mp4`;
		return c.redirect(downloadUrl, 302);
	}

	return c.json({ error: "File not available for download" }, 404);
});
```

Key design decisions:
- CF Images **blob API** (`/images/v1/{id}/blob`) returns the original uploaded image at full size, not a CDN variant — proxied through Worker (images are small, fast)
- CF Stream uses **302 redirect** to download URL — videos are large, no Worker proxy overhead or timeout risk
- For images: `Content-Disposition: attachment` forces download instead of browser display
- For videos: the redirect relies on CF Stream's own headers; the frontend catch block handles CORS gracefully via `window.open()` fallback
- Each fallback logs errors but doesn't crash — graceful degradation

- [ ] **Step 3: Verify the change locally**

Run: `npm run dev`

Open a browser, navigate to the gallery, try downloading a photo. Confirm:
1. Photos with R2 key still download (existing behavior preserved)
2. The endpoint returns proper headers

- [ ] **Step 4: Commit**

```bash
git add src/server.ts
git commit -m "fix: add CF Images/Stream fallback to download endpoint

Photos/videos without an R2 copy (upload step failed or pre-R2 uploads)
now fall back to CF Images blob API (original size) for images or
302 redirect to CF Stream download URL for videos."
```

---

### Task 2: Enable CF Stream downloads during video upload

**Files:**
- Modify: `src/server.ts` (video upload section, around line 770-825)

CF Stream requires downloads to be **explicitly enabled** per video before the download URL works. We add this API call right after the TUS upload URL is created, so downloads are ready by the time anyone tries to download.

- [ ] **Step 1: Read current video upload flow**

Read `src/server.ts` lines 770-825 to confirm the TUS upload response handling.

- [ ] **Step 2: Add download-enable call after Stream upload creation**

After the successful CF Stream TUS upload URL creation (around line 814-825 in the current code), add a fire-and-forget call to enable downloads. Insert this block right before the `return c.json(...)` for the video case:

```typescript
// Enable downloads for this video (fire-and-forget — non-blocking)
c.executionCtx.waitUntil(
	fetch(
		`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/stream/${streamMediaId}/downloads`,
		{
			method: "POST",
			headers: { Authorization: `Bearer ${cfToken}` },
		},
	).then((res) => {
		if (!res.ok)
			console.warn(
				`Failed to enable downloads for stream ${streamMediaId}: ${res.status}`,
			);
	}).catch((err) =>
		console.warn(`Download-enable failed for ${streamMediaId}:`, err),
	),
);
```

Key design decisions:
- Uses `c.executionCtx.waitUntil()` so the API call runs in the background without delaying the upload response
- Fire-and-forget with error logging — download enable failure shouldn't block upload
- Uses same `cfToken` already available in scope

- [ ] **Step 3: Verify locally**

Run: `npm run dev`

Upload a test video through the chat interface. Check Worker logs for:
- No errors from the download-enable call
- The TUS upload still works normally

- [ ] **Step 4: Commit**

```bash
git add src/server.ts
git commit -m "feat: enable CF Stream downloads at upload time

Adds a fire-and-forget API call to enable CF Stream downloads
when a video upload URL is created, so videos can be downloaded
via the fallback path immediately."
```

---

### Task 3: Enable downloads for existing CF Stream videos (one-time admin migration)

**Files:**
- Modify: `src/server.ts` (add new admin endpoint)

Existing videos in CF Stream don't have downloads enabled. We add a simple admin endpoint to batch-enable them.

- [ ] **Step 1: Add admin endpoint to enable downloads for all existing videos**

Add this endpoint after the existing admin endpoints (after the `migrate-media` endpoint):

```typescript
// POST /api/admin/enable-stream-downloads - Enable downloads for all existing CF Stream videos
app.post("/api/admin/enable-stream-downloads", async (c) => {
	const apiKey = c.req.header("x-api-key");
	if (!apiKey || apiKey !== c.env.SECRET) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const db = createDb(c.env.DB);
	const cfAccountId = c.env.CF_ACCOUNT_ID;
	const cfToken = c.env.CF_IMAGE_TOKEN;

	const videos = await db.query.photoUploads.findMany({
		where: (t, { and, eq, isNotNull }) =>
			and(eq(t.mediaType, "video"), isNotNull(t.streamVideoUid)),
	});

	const results: { id: string; streamVideoUid: string; status: string }[] = [];

	for (const video of videos) {
		try {
			const res = await fetch(
				`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/stream/${video.streamVideoUid}/downloads`,
				{
					method: "POST",
					headers: { Authorization: `Bearer ${cfToken}` },
				},
			);
			results.push({
				id: video.id,
				streamVideoUid: video.streamVideoUid!,
				status: res.ok ? "enabled" : `failed: ${res.status}`,
			});
		} catch (err) {
			results.push({
				id: video.id,
				streamVideoUid: video.streamVideoUid!,
				status: `error: ${err instanceof Error ? err.message : String(err)}`,
			});
		}
	}

	return c.json({
		total: videos.length,
		results,
	});
});
```

- [ ] **Step 2: Verify locally**

Run: `npm run dev`

Test the endpoint:
```bash
curl -X POST http://localhost:8787/api/admin/enable-stream-downloads \
  -H "x-api-key: YOUR_SECRET_HERE"
```

Expected: JSON response listing each video and whether downloads were enabled.

- [ ] **Step 3: Commit**

```bash
git add src/server.ts
git commit -m "feat: add admin endpoint to batch-enable CF Stream downloads

One-time migration endpoint to enable downloads for all existing
CF Stream videos, so the download fallback works for older uploads."
```

---

### Task 4: Deploy and run the migration

- [ ] **Step 1: Deploy**

```bash
npm run deploy
```

- [ ] **Step 2: Run the stream downloads migration**

```bash
curl -X POST https://your-worker-domain/api/admin/enable-stream-downloads \
  -H "x-api-key: YOUR_PRODUCTION_SECRET"
```

Verify the response shows downloads enabled for all videos.

- [ ] **Step 3: Test downloads in production gallery**

Open the gallery and test downloading:
1. A photo that previously failed to download
2. A video that previously failed to download
3. A photo/video that was already working (regression check)

Confirm all three download the original file at full size.

---

### Task 5: CF Stream CORS setup (manual — post-deploy)

The video download uses a 302 redirect to CF Stream. The frontend `fetch()` follows the redirect, but the browser may block the cross-origin response if CF Stream doesn't send CORS headers. The existing frontend catch block handles this gracefully — it falls back to `window.open(url, "_blank")` which triggers a direct browser navigation (no CORS needed).

To make the seamless `fetch()` → blob → download path work for videos too, configure CORS on CF Stream:

- [ ] **Step 1: Configure allowed origins on CF Stream**

Via Cloudflare Dashboard:
1. Go to **Stream** > **Settings**
2. Under **Allowed Origins**, add your production domain (e.g., `ivonka-roman-forever.love`)
3. This allows the browser `fetch()` to access CF Stream responses cross-origin

Or via API:
```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/stream/{video_uid}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"allowedOrigins": ["ivonka-roman-forever.love"]}'
```

Note: The `allowedOrigins` setting is **per-video**. To set it globally for all new videos, you can add it to the upload metadata or update the upload-url endpoint to include `allowedOrigins` in the TUS metadata.

**Without CORS configured:** Videos still download via `window.open()` fallback (opens in new tab), just with slightly worse UX (no progress indicator, filename defaults to `default.mp4`).

**With CORS configured:** Videos download seamlessly via fetch → blob → download (same UX as images, correct filename preserved).
