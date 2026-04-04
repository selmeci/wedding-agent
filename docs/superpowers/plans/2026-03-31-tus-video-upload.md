# TUS Video Upload (1500 MB limit) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch video uploads from basic 200 MB POST to TUS resumable protocol (up to 1500 MB), with chunked uploads and resume on connection loss.

**Architecture:** The server's video branch in `/api/media/upload-url` switches from CF Stream basic direct upload (`/stream/direct_upload`) to the TUS-compatible endpoint (`/stream?direct_user=true`). The Worker creates the TUS upload, gets back a `Location` URL and `stream-media-id`, and returns them to the client. The client uses `tus-js-client` with `uploadUrl` set to the Location (skips TUS creation, goes straight to chunked PATCH uploads). Images remain unchanged (CF Images basic POST).

**Tech Stack:** tus-js-client (browser), Cloudflare Stream TUS API, Hono, React

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `package.json` | Add `tus-js-client` dependency |
| Modify | `src/server.ts` | Switch video upload-url to TUS creation endpoint |
| Modify | `src/utils/media-upload.ts` | Route videos through tus-js-client; images keep XHR |
| Modify | `src/components/PhotoUpload.tsx` | Raise file size limit to 1500 MB |

---

## Task 1: Add tus-js-client dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install tus-js-client**

```bash
npm install tus-js-client
```

- [ ] **Step 2: Verify installation**

Run: `ls node_modules/tus-js-client/lib.esm/browser/ | head -5`
Expected: Files like `index.js` exist (ESM browser build).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add tus-js-client for resumable video uploads

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Switch server video upload-url to TUS creation

**Files:**
- Modify: `src/server.ts` — the video branch inside `POST /api/media/upload-url` (around line 766)

The existing video branch calls `/stream/direct_upload` (basic upload, 200 MB limit). Replace it with a call to `/stream?direct_user=true` using TUS headers. This creates a TUS upload on CF Stream and returns a Location URL for the client to PATCH data to.

The request body now requires `fileSize` in addition to existing fields.

- [ ] **Step 1: Add `fileSize` to the request body type**

Find the JSON body parsing in `POST /api/media/upload-url`:

```typescript
		const { fileName, contentType, mediaType } = await c.req.json<{
			fileName: string;
			contentType: string;
			mediaType: "image" | "video";
		}>();
```

Replace with:

```typescript
		const { fileName, contentType, mediaType, fileSize } = await c.req.json<{
			fileName: string;
			contentType: string;
			mediaType: "image" | "video";
			fileSize?: number;
		}>();
```

- [ ] **Step 2: Replace the CF Stream video branch**

Find the block starting with the comment `// CF Stream Direct Creator Upload (video)` (around line 766) through the end of the `return c.json({ uploadURL: ..., mediaId: cfData.result.uid, ... })` response.

Replace the entire video branch with:

```typescript
		// CF Stream Direct Creator Upload via TUS (resumable, supports large files)
		// Encode metadata as base64 key-value pairs per TUS spec
		const tusMetadata = [
			`name ${btoa(fileName)}`,
			`filetype ${btoa(contentType)}`,
			`guestId ${btoa(guestId)}`,
			`groupId ${btoa(group.id)}`,
		].join(",");

		const cfResponse = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/stream?direct_user=true`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${cfToken}`,
					"Tus-Resumable": "1.0.0",
					"Upload-Length": String(fileSize || 0),
					"Upload-Metadata": tusMetadata,
				},
			},
		);

		if (!cfResponse.ok) {
			const errorBody = await cfResponse.text();
			console.error(
				`❌ POST /api/media/upload-url - CF Stream TUS API error: ${cfResponse.status} ${errorBody}`,
			);
			return c.json(
				{ error: "Failed to create TUS upload for Cloudflare Stream" },
				500,
			);
		}

		const tusLocation = cfResponse.headers.get("location");
		const streamMediaId = cfResponse.headers.get("stream-media-id");

		if (!tusLocation || !streamMediaId) {
			console.error(
				"❌ POST /api/media/upload-url - CF Stream TUS response missing Location or stream-media-id header",
			);
			return c.json(
				{ error: "Invalid response from Cloudflare Stream TUS" },
				500,
			);
		}

		console.log(
			`✅ POST /api/media/upload-url - CF Stream TUS upload created: ${streamMediaId}`,
		);

		return c.json({
			tusUploadUrl: tusLocation,
			mediaId: streamMediaId,
			mediaType: "video" as const,
			guestId,
		});
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/server.ts
git commit -m "$(cat <<'EOF'
feat: switch video upload-url to TUS creation endpoint

Replaces /stream/direct_upload (200MB basic POST limit) with
/stream?direct_user=true (TUS resumable, up to 30GB).
Worker creates the TUS upload and returns the Location URL +
stream-media-id for the client's tus-js-client to PATCH to.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Route video uploads through tus-js-client

**Files:**
- Modify: `src/utils/media-upload.ts`

Split the upload function: images use XHR FormData (existing), videos use tus-js-client. The TUS client gets `uploadUrl` from the server (Step 2 output) and PATCHes chunks directly to CF Stream.

- [ ] **Step 1: Add tus-js-client import**

Add at the top of the file, after the existing import:

```typescript
import * as tus from "tus-js-client";
```

- [ ] **Step 2: Update CFUploadUrlResponse type**

The response now includes `tusUploadUrl` for videos instead of `uploadURL`. Update the interface:

```typescript
interface CFUploadUrlResponse {
	uploadURL?: string;
	tusUploadUrl?: string;
	mediaId: string;
	mediaType: "image" | "video";
	guestId: string;
}
```

- [ ] **Step 3: Add TUS video upload helper function**

Add this new function before the existing `uploadMediaViaCF` function:

```typescript
/**
 * Upload a video file via tus-js-client to Cloudflare Stream.
 * Uses chunked, resumable upload protocol — survives connection drops.
 */
function uploadVideoViaTus(
	file: File,
	tusUploadUrl: string,
	onProgress?: (progress: UploadProgress) => void,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const upload = new tus.Upload(file, {
			uploadUrl: tusUploadUrl,
			// 10 MB chunks — good balance for mobile (min 5 MB per CF docs)
			chunkSize: 10 * 1024 * 1024,
			retryDelays: [0, 1000, 3000, 5000, 10000],
			metadata: {
				filename: file.name,
				filetype: file.type || "video/mp4",
			},
			onProgress(bytesUploaded, bytesTotal) {
				const percent = Math.round((bytesUploaded / bytesTotal) * 100);
				onProgress?.({ phase: "uploading", percent });
			},
			onSuccess() {
				console.log(`[TUS] Upload finished: ${file.name}`);
				resolve();
			},
			onError(error) {
				console.error(`[TUS] Upload error: ${file.name}`, error);
				reject(
					new Error(
						`TUS upload failed: ${error.message || "Unknown error"}`,
					),
				);
			},
		});

		upload.start();
	});
}
```

- [ ] **Step 4: Modify uploadMediaViaCF to route videos through TUS**

In the `uploadMediaViaCF` function, make these changes:

**4a.** In Step 1 (get upload URL), add `fileSize` to the request body. Find:

```typescript
			jsonPost<CFUploadUrlResponse>(
				"/api/media/upload-url",
				{
					fileName: file.name,
					contentType: mimeType,
					mediaType,
				},
```

Replace with:

```typescript
			jsonPost<CFUploadUrlResponse>(
				"/api/media/upload-url",
				{
					fileName: file.name,
					contentType: mimeType,
					mediaType,
					fileSize: file.size,
				},
```

**4b.** Replace Step 2 (the XHR upload block) with a conditional that routes videos through TUS and images through XHR. Find the entire Step 2 block from `// Step 2: Upload file directly to CF via XHR` through the closing of `retryWithBackoff`. Replace with:

```typescript
	// Step 2: Upload file to CF
	onProgress?.({ phase: "uploading", percent: 0 });

	if (uploadUrlData.tusUploadUrl) {
		// Video: TUS resumable upload — chunked, survives connection drops
		await uploadVideoViaTus(file, uploadUrlData.tusUploadUrl, onProgress);
	} else if (uploadUrlData.uploadURL) {
		// Image: basic XHR FormData upload
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

					xhr.timeout = 10 * 60 * 1000;
					xhr.open("POST", uploadUrlData.uploadURL);

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
	} else {
		throw new Error("No upload URL returned from server");
	}
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/utils/media-upload.ts
git commit -m "$(cat <<'EOF'
feat: route all video uploads through tus-js-client

Videos now use TUS resumable protocol with 10MB chunks.
Survives connection drops on mobile. Supports files up to 1500MB.
Images still use basic XHR FormData upload via CF Images.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Raise file size limit to 1500 MB

**Files:**
- Modify: `src/components/PhotoUpload.tsx`

- [ ] **Step 1: Update the file size guard**

Find the current size guard in `handleFileSelect`:

```typescript
				const maxFileSize = 500 * 1024 * 1024; // 500MB
				if (file.size > maxFileSize) {
					alert(
						`Súbor ${file.name} je príliš veľký (${(file.size / 1024 / 1024).toFixed(0)} MB). Maximum je 500 MB.`,
					);
```

Replace with:

```typescript
				const maxFileSize = 1500 * 1024 * 1024; // 1500MB
				if (file.size > maxFileSize) {
					alert(
						`Súbor ${file.name} je príliš veľký (${(file.size / 1024 / 1024).toFixed(0)} MB). Maximum je 1500 MB.`,
					);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PhotoUpload.tsx
git commit -m "$(cat <<'EOF'
feat: raise file size limit to 1500 MB

TUS resumable upload now supports large video files.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Format, build, and verify

**Files:**
- All modified files

- [ ] **Step 1: Format code**

Run: `pnpm exec biome format --write .`

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Build**

Run: `npm run deploy -- --dry-run`
Expected: Build succeeds.

- [ ] **Step 4: Commit any formatting changes**

```bash
git add -A && git diff --cached --stat
# If files changed:
git commit -m "style: format after TUS integration

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: End-to-end verification checklist**

| Test | Device | Expected |
|------|--------|----------|
| Upload JPEG <10 MB | Any | Uses XHR basic upload, succeeds |
| Upload HEIC from camera | iPhone | Uses XHR basic upload, CF Images handles HEIC |
| Upload MP4 <200 MB | Android | Uses TUS, chunked upload with progress |
| Upload MOV 500 MB | iPhone | Uses TUS, resume on reconnect |
| Upload MP4 1.2 GB | Any | Uses TUS, chunked 10 MB, progress shows |
| Upload >1500 MB file | Any | Client rejects with Slovak error message |
| Kill WiFi mid-upload, reconnect | Mobile | TUS resumes from last chunk |
| Gallery shows uploaded video | Desktop | Thumbnail appears after processing |
