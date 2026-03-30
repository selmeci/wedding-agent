# R2 Upload Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix photo/video upload failures by adding R2 CORS configuration, retry logic with exponential backoff, multipart uploads for large files, and Safari/iOS compatibility.

**Architecture:** Three-step presigned URL flow (presign → upload → confirm) stays the same for small files (<10MB). Large files (>=10MB) use S3 multipart upload: server creates multipart upload + presigned part URLs, client uploads 10MB chunks with per-chunk retry and parallel upload (3 concurrent), then server completes the multipart assembly. A generic retry wrapper protects all network calls. CORS rules on R2 bucket allow cross-origin PUTs.

**Tech Stack:** @aws-sdk/client-s3, @aws-sdk/s3-request-presigner (already in deps), Hono server endpoints, XHR for upload progress, Cloudflare R2

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/utils/upload-retry.ts` | Generic retry with exponential backoff (client-side) |
| Modify | `src/utils/r2-presign.ts` | Add multipart S3 commands + Content-Length to presigned PUT |
| Modify | `src/utils/media-upload.ts` | Rewrite: retry on all calls, multipart client, Safari-safe uploads |
| Modify | `src/server.ts` | Add 3 multipart endpoints + Content-Length in presign |
| Modify | `src/components/PhotoUpload.tsx` | Use new `uploadFile()`, multipart progress display |
| Create | `docs/R2-CORS-SETUP.md` | CORS configuration instructions for R2 bucket |

---

## Task 1: R2 CORS Configuration Documentation

**Files:**
- Create: `docs/R2-CORS-SETUP.md`

This is a **manual prerequisite** - CORS must be configured on the R2 bucket before code changes work.

- [ ] **Step 1: Create CORS setup documentation**

```markdown
# R2 CORS Configuration

The `wedding-photos` R2 bucket needs CORS rules to allow browser-based uploads via presigned URLs.

## Apply via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com → R2 Object Storage → `wedding-photos` bucket
2. Click **Settings** tab
3. Scroll to **CORS Policy** section
4. Click **Add CORS policy** and paste:

```json
[
  {
    "AllowedOrigins": [
      "https://ivonka-roman-forever.love",
      "http://localhost:5173",
      "http://localhost:*"
    ],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Content-Length"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 86400
  }
]
```

5. Click **Save**

## Why Each Field Matters

- **AllowedOrigins**: Your app domains. Presigned PUT requests come from these origins.
- **AllowedMethods**: PUT for uploads, HEAD for verification, GET for retrieval.
- **AllowedHeaders**: Content-Type is sent with every upload. Content-Length for validation.
- **ExposeHeaders**: ETag is needed for multipart upload completion (client must read it from response).
- **MaxAgeSeconds**: Cache preflight for 24h to reduce OPTIONS requests.

## Verify

After applying, test with:
```bash
curl -I -X OPTIONS \
  -H "Origin: https://ivonka-roman-forever.love" \
  -H "Access-Control-Request-Method: PUT" \
  "https://<your-r2-endpoint>/wedding-photos/test"
```

Should return `Access-Control-Allow-Origin: https://ivonka-roman-forever.love`.
```

- [ ] **Step 2: Apply CORS rules in Cloudflare Dashboard**

Follow the steps in the doc above. This must be done before testing any upload changes.

- [ ] **Step 3: Commit**

```bash
git add docs/R2-CORS-SETUP.md
git commit -m "docs: add R2 CORS configuration instructions for upload reliability"
```

---

## Task 2: Create Retry Utility

**Files:**
- Create: `src/utils/upload-retry.ts`

- [ ] **Step 1: Create the retry utility**

Create `src/utils/upload-retry.ts`:

```typescript
/**
 * Retry wrapper with exponential backoff for upload operations.
 * Retries on network errors and 5xx server errors. Does NOT retry 4xx client errors.
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	options: {
		maxRetries?: number;
		baseDelayMs?: number;
		maxDelayMs?: number;
		onRetry?: (attempt: number, error: unknown) => void;
	} = {},
): Promise<T> {
	const {
		maxRetries = 3,
		baseDelayMs = 1000,
		maxDelayMs = 30000,
		onRetry,
	} = options;

	let lastError: unknown;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;

			// Don't retry client errors (4xx)
			if (error instanceof Error && error.message.includes("status 4")) {
				throw error;
			}

			if (attempt === maxRetries) {
				break;
			}

			const delay = Math.min(
				baseDelayMs * 2 ** attempt + Math.random() * 1000,
				maxDelayMs,
			);

			onRetry?.(attempt + 1, error);

			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}
```

- [ ] **Step 2: Run format check**

Run: `pnpm exec biome format --write src/utils/upload-retry.ts`

- [ ] **Step 3: Commit**

```bash
git add src/utils/upload-retry.ts
git commit -m "feat(upload): add retry utility with exponential backoff"
```

---

## Task 3: Extend r2-presign.ts with Multipart Support

**Files:**
- Modify: `src/utils/r2-presign.ts`

- [ ] **Step 1: Add multipart S3 commands and Content-Length**

Replace the full content of `src/utils/r2-presign.ts` with:

```typescript
import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	HeadObjectCommand,
	PutObjectCommand,
	type S3Client,
	S3Client as S3ClientClass,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface R2PresignConfig {
	endpoint: string;
	accessKeyId: string;
	secretAccessKey: string;
}

export function createR2Client(config: R2PresignConfig): S3Client {
	return new S3ClientClass({
		region: "auto",
		endpoint: config.endpoint,
		credentials: {
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
		},
	});
}

export async function generatePresignedPutUrl(
	client: S3Client,
	bucket: string,
	key: string,
	contentType: string,
	expiresIn = 3600,
	contentLength?: number,
): Promise<string> {
	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: key,
		ContentType: contentType,
		...(contentLength !== undefined && { ContentLength: contentLength }),
	});

	return getSignedUrl(client, command, { expiresIn });
}

export async function verifyObjectExists(
	client: S3Client,
	bucket: string,
	key: string,
): Promise<{ exists: boolean; size?: number; contentType?: string }> {
	try {
		const command = new HeadObjectCommand({
			Bucket: bucket,
			Key: key,
		});
		const response = await client.send(command);
		return {
			exists: true,
			size: response.ContentLength,
			contentType: response.ContentType,
		};
	} catch {
		return { exists: false };
	}
}

// --- Multipart Upload ---

export async function createMultipartUpload(
	client: S3Client,
	bucket: string,
	key: string,
	contentType: string,
): Promise<string> {
	const command = new CreateMultipartUploadCommand({
		Bucket: bucket,
		Key: key,
		ContentType: contentType,
	});
	const response = await client.send(command);
	if (!response.UploadId) {
		throw new Error("Failed to create multipart upload: no UploadId returned");
	}
	return response.UploadId;
}

export async function generatePresignedPartUrls(
	client: S3Client,
	bucket: string,
	key: string,
	uploadId: string,
	partCount: number,
	expiresIn = 3600,
): Promise<{ partNumber: number; uploadUrl: string }[]> {
	const parts: { partNumber: number; uploadUrl: string }[] = [];
	for (let i = 1; i <= partCount; i++) {
		const command = new UploadPartCommand({
			Bucket: bucket,
			Key: key,
			UploadId: uploadId,
			PartNumber: i,
		});
		const url = await getSignedUrl(client, command, { expiresIn });
		parts.push({ partNumber: i, uploadUrl: url });
	}
	return parts;
}

export async function completeMultipartUpload(
	client: S3Client,
	bucket: string,
	key: string,
	uploadId: string,
	parts: { partNumber: number; etag: string }[],
): Promise<void> {
	const command = new CompleteMultipartUploadCommand({
		Bucket: bucket,
		Key: key,
		UploadId: uploadId,
		MultipartUpload: {
			Parts: parts
				.sort((a, b) => a.partNumber - b.partNumber)
				.map((p) => ({
					PartNumber: p.partNumber,
					ETag: p.etag,
				})),
		},
	});
	await client.send(command);
}

export async function abortMultipartUpload(
	client: S3Client,
	bucket: string,
	key: string,
	uploadId: string,
): Promise<void> {
	const command = new AbortMultipartUploadCommand({
		Bucket: bucket,
		Key: key,
		UploadId: uploadId,
	});
	await client.send(command);
}
```

- [ ] **Step 2: Run format check**

Run: `pnpm exec biome format --write src/utils/r2-presign.ts`

- [ ] **Step 3: Commit**

```bash
git add src/utils/r2-presign.ts
git commit -m "feat(upload): add multipart upload support and Content-Length to r2-presign"
```

---

## Task 4: Add Multipart Server Endpoints

**Files:**
- Modify: `src/server.ts` (add 3 new endpoints after the existing `/api/media/confirm` endpoint, around line 939)

The new endpoints follow the same auth pattern as `/api/media/presign`: QR token validation, group lookup, guest resolution.

- [ ] **Step 1: Add helper to create R2 client from env**

Add this helper function near the top of `src/server.ts` (after the imports, before the first route), to avoid repeating R2 client creation in every endpoint:

```typescript
function getR2Client(env: Env) {
	// Lazy import to avoid loading @aws-sdk at startup for non-upload requests
	return import("@/utils/r2-presign").then(({ createR2Client }) =>
		createR2Client({
			endpoint: env.R2_ENDPOINT,
			accessKeyId: env.R2_ACCESS_KEY_ID,
			secretAccessKey: env.R2_SECRET_ACCESS_KEY,
		}),
	);
}
```

- [ ] **Step 2: Update `/api/media/presign` to include Content-Length**

In the existing `/api/media/presign` endpoint, update the `generatePresignedPutUrl` call to pass `fileSize`:

Change:
```typescript
		const uploadUrl = await generatePresignedPutUrl(
			r2Client,
			"wedding-photos",
			r2Key,
			contentType,
			3600, // 1 hour expiry
		);
```

To:
```typescript
		const uploadUrl = await generatePresignedPutUrl(
			r2Client,
			"wedding-photos",
			r2Key,
			contentType,
			3600, // 1 hour expiry
			fileSize,
		);
```

- [ ] **Step 3: Add `POST /api/media/multipart/create` endpoint**

Add after the `/api/media/confirm` endpoint (after its closing `});`):

```typescript
// Multipart upload API for large files (>10MB)
// POST /api/media/multipart/create - Initiate multipart upload
app.post("/api/media/multipart/create", async (c) => {
	console.log("🔑 POST /api/media/multipart/create - Request started");
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

		let guestId = c.req.header("x-guest-id");
		if (!guestId && group.guests.length > 0) {
			guestId = group.guests[0].id;
		}
		if (!guestId) {
			return c.json({ error: "No guest available in group" }, 400);
		}

		const { fileName, contentType, fileSize } = await c.req.json<{
			fileName: string;
			contentType: string;
			fileSize: number;
		}>();

		console.log(
			`📁 POST /api/media/multipart/create - File: ${fileName}, Size: ${(fileSize / 1024 / 1024).toFixed(2)}MB, Type: ${contentType}`,
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

		const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
		if (fileSize > MAX_FILE_SIZE) {
			return c.json({ error: "Súbor je príliš veľký (max 1GB)" }, 400);
		}

		const mediaId = crypto.randomUUID();
		const fileExtension = fileName.split(".").pop()?.toLowerCase() || "bin";
		const r2Key = `groups/${group.id}/photos/${mediaId}.${fileExtension}`;
		const isVideo = videoTypes.includes(contentType);

		const PART_SIZE = 10 * 1024 * 1024; // 10MB
		const partCount = Math.ceil(fileSize / PART_SIZE);

		const {
			createR2Client,
			createMultipartUpload,
			generatePresignedPartUrls,
		} = await import("@/utils/r2-presign");

		const r2Client = createR2Client({
			endpoint: c.env.R2_ENDPOINT,
			accessKeyId: c.env.R2_ACCESS_KEY_ID,
			secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
		});

		const uploadId = await createMultipartUpload(
			r2Client,
			"wedding-photos",
			r2Key,
			contentType,
		);

		const parts = await generatePresignedPartUrls(
			r2Client,
			"wedding-photos",
			r2Key,
			uploadId,
			partCount,
			3600,
		);

		console.log(
			`✅ POST /api/media/multipart/create - Success: ${mediaId}, ${partCount} parts, uploadId: ${uploadId.substring(0, 8)}...`,
		);

		return c.json({
			uploadId,
			mediaId,
			r2Key,
			mediaType: isVideo ? "video" : "image",
			guestId,
			partSize: PART_SIZE,
			parts,
		});
	} catch (error) {
		console.error("❌ POST /api/media/multipart/create - Error:", error);
		return c.json(
			{
				error: "Failed to create multipart upload",
				details: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
});
```

- [ ] **Step 4: Add `POST /api/media/multipart/complete` endpoint**

Add immediately after the create endpoint:

```typescript
// POST /api/media/multipart/complete - Complete multipart upload
app.post("/api/media/multipart/complete", async (c) => {
	console.log("✔️ POST /api/media/multipart/complete - Request started");
	try {
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			return c.json({ error: "Missing QR token" }, 401);
		}

		const db = createDb(c.env.DB);
		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
		});

		if (!group) {
			return c.json({ error: "Invalid QR token" }, 403);
		}

		const { uploadId, r2Key, parts } = await c.req.json<{
			uploadId: string;
			r2Key: string;
			parts: { partNumber: number; etag: string }[];
		}>();

		if (!uploadId || !r2Key || !parts || parts.length === 0) {
			return c.json({ error: "Missing required fields" }, 400);
		}

		console.log(
			`📋 POST /api/media/multipart/complete - uploadId: ${uploadId.substring(0, 8)}..., ${parts.length} parts`,
		);

		const { createR2Client, completeMultipartUpload } = await import(
			"@/utils/r2-presign"
		);

		const r2Client = createR2Client({
			endpoint: c.env.R2_ENDPOINT,
			accessKeyId: c.env.R2_ACCESS_KEY_ID,
			secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
		});

		await completeMultipartUpload(
			r2Client,
			"wedding-photos",
			r2Key,
			uploadId,
			parts,
		);

		console.log(
			`✅ POST /api/media/multipart/complete - Success: ${r2Key}`,
		);
		return c.json({ success: true });
	} catch (error) {
		console.error("❌ POST /api/media/multipart/complete - Error:", error);
		return c.json(
			{
				error: "Failed to complete multipart upload",
				details: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
});
```

- [ ] **Step 5: Add `POST /api/media/multipart/abort` endpoint**

Add immediately after the complete endpoint:

```typescript
// POST /api/media/multipart/abort - Abort multipart upload (cleanup)
app.post("/api/media/multipart/abort", async (c) => {
	console.log("🗑️ POST /api/media/multipart/abort - Request started");
	try {
		const qrToken = c.req.header("x-qr-token");
		if (!qrToken) {
			return c.json({ error: "Missing QR token" }, 401);
		}

		const db = createDb(c.env.DB);
		const group = await db.query.guestGroups.findFirst({
			where: (t, { eq }) => eq(t.qrToken, qrToken),
		});

		if (!group) {
			return c.json({ error: "Invalid QR token" }, 403);
		}

		const { uploadId, r2Key } = await c.req.json<{
			uploadId: string;
			r2Key: string;
		}>();

		if (!uploadId || !r2Key) {
			return c.json({ error: "Missing required fields" }, 400);
		}

		const { createR2Client, abortMultipartUpload } = await import(
			"@/utils/r2-presign"
		);

		const r2Client = createR2Client({
			endpoint: c.env.R2_ENDPOINT,
			accessKeyId: c.env.R2_ACCESS_KEY_ID,
			secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
		});

		await abortMultipartUpload(r2Client, "wedding-photos", r2Key, uploadId);

		console.log(`✅ POST /api/media/multipart/abort - Success: ${r2Key}`);
		return c.json({ success: true });
	} catch (error) {
		console.error("❌ POST /api/media/multipart/abort - Error:", error);
		return c.json(
			{
				error: "Failed to abort multipart upload",
				details: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
});
```

- [ ] **Step 6: Run format check**

Run: `pnpm exec biome format --write src/server.ts`

- [ ] **Step 7: Commit**

```bash
git add src/server.ts
git commit -m "feat(upload): add multipart upload server endpoints and Content-Length to presign"
```

---

## Task 5: Rewrite Client Upload Module

**Files:**
- Modify: `src/utils/media-upload.ts`

This is the biggest change. The new module:
1. Wraps all network calls in `retryWithBackoff`
2. Auto-selects single PUT vs multipart based on file size (threshold: 10MB)
3. Uploads multipart chunks with 3 concurrent uploads
4. Tracks progress for both single and multipart uploads
5. Cleans up on failure (abort multipart)

- [ ] **Step 1: Rewrite media-upload.ts**

Replace the full content of `src/utils/media-upload.ts`:

```typescript
import { retryWithBackoff } from "@/utils/upload-retry";

// --- Types ---

export interface PresignResponse {
	mediaId: string;
	uploadUrl: string;
	r2Key: string;
	mediaType: "image" | "video";
	guestId: string;
}

export interface MultipartCreateResponse {
	uploadId: string;
	mediaId: string;
	r2Key: string;
	mediaType: "image" | "video";
	guestId: string;
	partSize: number;
	parts: { partNumber: number; uploadUrl: string }[];
}

export interface UploadProgress {
	phase: "preparing" | "uploading" | "confirming" | "done";
	percent: number;
}

export interface UploadResult {
	id: string;
	mediaType: "image" | "video";
	duration?: number;
}

// --- Constants ---

/** Files >= 10MB use multipart upload */
const MULTIPART_THRESHOLD = 10 * 1024 * 1024;

/** Max concurrent part uploads */
const MAX_CONCURRENT_PARTS = 3;

// --- Helpers ---

function authHeaders(
	qrToken: string,
	guestId: string | null,
): Record<string, string> {
	const headers: Record<string, string> = { "x-qr-token": qrToken };
	if (guestId) {
		headers["x-guest-id"] = guestId;
	}
	return headers;
}

async function jsonPost<T>(
	url: string,
	body: unknown,
	headers: Record<string, string> = {},
): Promise<T> {
	const response = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...headers },
		body: JSON.stringify(body),
	});
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(
			(error as { error?: string }).error ||
				`Request failed: status ${response.status}`,
		);
	}
	return response.json() as Promise<T>;
}

// --- Single PUT Upload (files < 10MB) ---

async function getPresignedUrl(
	file: File,
	qrToken: string,
	guestId: string | null,
): Promise<PresignResponse> {
	return retryWithBackoff(
		() =>
			jsonPost<PresignResponse>(
				"/api/media/presign",
				{ fileName: file.name, contentType: file.type, fileSize: file.size },
				authHeaders(qrToken, guestId),
			),
		{
			maxRetries: 3,
			onRetry: (attempt) =>
				console.log(`[Upload] Presign retry #${attempt}`),
		},
	);
}

function uploadSinglePut(
	url: string,
	file: File,
	onProgress?: (percent: number) => void,
): Promise<void> {
	return retryWithBackoff(
		() =>
			new Promise<void>((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				xhr.upload.addEventListener("progress", (e) => {
					if (e.lengthComputable) {
						onProgress?.(Math.round((e.loaded / e.total) * 100));
					}
				});

				xhr.addEventListener("load", () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						resolve();
					} else {
						reject(
							new Error(
								`Upload failed: status ${xhr.status} ${xhr.responseText?.substring(0, 200)}`,
							),
						);
					}
				});

				xhr.addEventListener("error", () => {
					reject(
						new Error(
							`Network error (readyState=${xhr.readyState}, status=${xhr.status})`,
						),
					);
				});

				xhr.addEventListener("timeout", () => {
					reject(new Error("Upload timeout"));
				});

				xhr.timeout = 5 * 60 * 1000; // 5 min for single file
				xhr.open("PUT", url);
				xhr.setRequestHeader("Content-Type", file.type);
				xhr.send(file);
			}),
		{
			maxRetries: 2,
			onRetry: (attempt) =>
				console.log(`[Upload] Single PUT retry #${attempt}`),
		},
	);
}

// --- Multipart Upload (files >= 10MB) ---

async function createMultipartUpload(
	file: File,
	qrToken: string,
	guestId: string | null,
): Promise<MultipartCreateResponse> {
	return retryWithBackoff(
		() =>
			jsonPost<MultipartCreateResponse>(
				"/api/media/multipart/create",
				{ fileName: file.name, contentType: file.type, fileSize: file.size },
				authHeaders(qrToken, guestId),
			),
		{
			maxRetries: 3,
			onRetry: (attempt) =>
				console.log(`[Upload] Multipart create retry #${attempt}`),
		},
	);
}

function uploadPart(
	url: string,
	blob: Blob,
	contentType: string,
): Promise<string> {
	return retryWithBackoff(
		() =>
			new Promise<string>((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				xhr.addEventListener("load", () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						const etag = xhr.getResponseHeader("ETag");
						if (!etag) {
							reject(
								new Error("Missing ETag in response - check R2 CORS ExposeHeaders"),
							);
							return;
						}
						resolve(etag);
					} else {
						reject(
							new Error(`Part upload failed: status ${xhr.status}`),
						);
					}
				});

				xhr.addEventListener("error", () => {
					reject(new Error("Part upload network error"));
				});

				xhr.addEventListener("timeout", () => {
					reject(new Error("Part upload timeout"));
				});

				xhr.timeout = 3 * 60 * 1000; // 3 min per 10MB part
				xhr.open("PUT", url);
				xhr.setRequestHeader("Content-Type", contentType);
				xhr.send(blob);
			}),
		{
			maxRetries: 3,
			baseDelayMs: 2000,
			onRetry: (attempt) =>
				console.log(`[Upload] Part upload retry #${attempt}`),
		},
	);
}

async function uploadPartsWithConcurrency(
	file: File,
	multipart: MultipartCreateResponse,
	onProgress?: (percent: number) => void,
): Promise<{ partNumber: number; etag: string }[]> {
	const completedParts: { partNumber: number; etag: string }[] = [];
	let completedCount = 0;
	const totalParts = multipart.parts.length;

	// Process parts with limited concurrency
	const queue = [...multipart.parts];
	const workers: Promise<void>[] = [];

	for (let i = 0; i < Math.min(MAX_CONCURRENT_PARTS, queue.length); i++) {
		workers.push(
			(async () => {
				while (queue.length > 0) {
					const part = queue.shift();
					if (!part) break;

					const start = (part.partNumber - 1) * multipart.partSize;
					const end = Math.min(start + multipart.partSize, file.size);
					const blob = file.slice(start, end);

					const etag = await uploadPart(
						part.uploadUrl,
						blob,
						file.type,
					);

					completedParts.push({
						partNumber: part.partNumber,
						etag,
					});

					completedCount++;
					onProgress?.(Math.round((completedCount / totalParts) * 100));
				}
			})(),
		);
	}

	await Promise.all(workers);
	return completedParts;
}

async function completeMultipartUpload(
	uploadId: string,
	r2Key: string,
	parts: { partNumber: number; etag: string }[],
	qrToken: string,
): Promise<void> {
	await retryWithBackoff(
		() =>
			jsonPost(
				"/api/media/multipart/complete",
				{ uploadId, r2Key, parts },
				{ "x-qr-token": qrToken },
			),
		{
			maxRetries: 3,
			onRetry: (attempt) =>
				console.log(`[Upload] Multipart complete retry #${attempt}`),
		},
	);
}

async function abortMultipartUpload(
	uploadId: string,
	r2Key: string,
	qrToken: string,
): Promise<void> {
	try {
		await jsonPost(
			"/api/media/multipart/abort",
			{ uploadId, r2Key },
			{ "x-qr-token": qrToken },
		);
	} catch (error) {
		// Best-effort cleanup - don't fail the main error flow
		console.error("[Upload] Failed to abort multipart upload:", error);
	}
}

// --- Confirm Upload (shared by both flows) ---

export async function confirmUpload(
	presignData: { mediaId: string; r2Key: string; guestId: string; mediaType: "image" | "video" },
	file: File,
	qrToken: string,
	thumbnail: Blob | null,
	duration: number | null,
): Promise<UploadResult> {
	return retryWithBackoff(
		async () => {
			const formData = new FormData();
			formData.append("mediaId", presignData.mediaId);
			formData.append("r2Key", presignData.r2Key);
			formData.append("fileName", file.name);
			formData.append("guestId", presignData.guestId);
			formData.append("mediaType", presignData.mediaType);

			if (duration !== null) {
				formData.append("duration", duration.toString());
			}
			if (thumbnail) {
				formData.append("thumbnail", thumbnail, "thumbnail.webp");
			}

			const response = await fetch("/api/media/confirm", {
				method: "POST",
				headers: { "x-qr-token": qrToken },
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				throw new Error(
					(error as { error?: string }).error || "Failed to confirm upload",
				);
			}

			return response.json() as Promise<UploadResult>;
		},
		{
			maxRetries: 3,
			onRetry: (attempt) =>
				console.log(`[Upload] Confirm retry #${attempt}`),
		},
	);
}

// --- Main Upload Function ---

/**
 * Upload a file to R2. Automatically uses multipart for files >= 10MB.
 * Includes retry with exponential backoff on all steps.
 */
export async function uploadFile(
	file: File,
	qrToken: string,
	guestId: string | null,
	onProgress?: (progress: UploadProgress) => void,
	thumbnail?: Blob | null,
	duration?: number | null,
): Promise<UploadResult> {
	const useMultipart = file.size >= MULTIPART_THRESHOLD;

	console.log(
		`[Upload] Starting ${useMultipart ? "multipart" : "single"} upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
	);

	onProgress?.({ phase: "preparing", percent: 0 });

	let presignData: {
		mediaId: string;
		r2Key: string;
		guestId: string;
		mediaType: "image" | "video";
	};

	if (useMultipart) {
		// --- Multipart flow ---
		const multipart = await createMultipartUpload(file, qrToken, guestId);
		presignData = {
			mediaId: multipart.mediaId,
			r2Key: multipart.r2Key,
			guestId: multipart.guestId,
			mediaType: multipart.mediaType,
		};

		onProgress?.({ phase: "uploading", percent: 0 });

		try {
			const completedParts = await uploadPartsWithConcurrency(
				file,
				multipart,
				(percent) => onProgress?.({ phase: "uploading", percent }),
			);

			onProgress?.({ phase: "confirming", percent: 100 });

			await completeMultipartUpload(
				multipart.uploadId,
				multipart.r2Key,
				completedParts,
				qrToken,
			);
		} catch (error) {
			// Abort multipart upload on failure (best-effort cleanup)
			await abortMultipartUpload(
				multipart.uploadId,
				multipart.r2Key,
				qrToken,
			);
			throw error;
		}
	} else {
		// --- Single PUT flow ---
		const presign = await getPresignedUrl(file, qrToken, guestId);
		presignData = {
			mediaId: presign.mediaId,
			r2Key: presign.r2Key,
			guestId: presign.guestId,
			mediaType: presign.mediaType,
		};

		onProgress?.({ phase: "uploading", percent: 0 });

		await uploadSinglePut(presign.uploadUrl, file, (percent) =>
			onProgress?.({ phase: "uploading", percent }),
		);
	}

	// --- Confirm (shared) ---
	onProgress?.({ phase: "confirming", percent: 100 });

	const result = await confirmUpload(
		presignData,
		file,
		qrToken,
		thumbnail ?? null,
		duration ?? null,
	);

	onProgress?.({ phase: "done", percent: 100 });

	console.log(
		`[Upload] Complete: ${file.name} → ${result.id} (${result.mediaType})`,
	);

	return result;
}
```

- [ ] **Step 2: Run format check**

Run: `pnpm exec biome format --write src/utils/media-upload.ts`

- [ ] **Step 3: Commit**

```bash
git add src/utils/media-upload.ts src/utils/upload-retry.ts
git commit -m "feat(upload): rewrite client upload with retry, multipart, and Safari compatibility"
```

---

## Task 6: Update PhotoUpload Component

**Files:**
- Modify: `src/components/PhotoUpload.tsx`

The component needs to use the new `uploadFile()` function instead of calling `getPresignedUrl` + `uploadToR2` + `confirmUpload` separately.

- [ ] **Step 1: Update imports**

In `src/components/PhotoUpload.tsx`, change the import from:

```typescript
import {
	type UploadProgress,
	confirmUpload,
	getPresignedUrl,
	uploadToR2,
} from "@/utils/media-upload";
```

To:

```typescript
import {
	type UploadProgress,
	uploadFile,
} from "@/utils/media-upload";
```

- [ ] **Step 2: Simplify the handleFileSelect upload loop**

Replace the entire upload logic inside the `for (const file of Array.from(files))` loop (lines 184-252 approximately). The new version uses the single `uploadFile()` function:

Replace the content of the `try` block inside the for loop (from `const isVideo = ...` through `setCurrentUpload(uploaded)`) with:

```typescript
					const isVideo = videoTypes.includes(file.type);

					// Generate thumbnail and duration for videos
					let thumbnail: Blob | null = null;
					let duration: number | null = null;

					if (isVideo) {
						setUploadProgress({ phase: "preparing", percent: 10 });
						const [thumb, dur] = await Promise.all([
							generateVideoThumbnail(file),
							getVideoDuration(file),
						]);
						thumbnail = thumb;
						duration = dur;
					}

					// Upload file (auto-selects single PUT vs multipart)
					const result = await uploadFile(
						file,
						qrToken,
						guestId,
						(progress) => setUploadProgress(progress),
						thumbnail,
						duration,
					);

					// Add to media list
					setMediaList((prev) => [
						{
							duration: duration ?? undefined,
							fileName: file.name,
							fullUrl: `/api/photos/${result.id}/full`,
							id: result.id,
							mediaType: result.mediaType || "image",
							thumbnailUrl: `/api/photos/${result.id}/thumbnail`,
							uploadedAt: new Date(),
						},
						...prev,
					]);

					uploaded++;
					setCurrentUpload(uploaded);
```

- [ ] **Step 3: Run format check**

Run: `pnpm exec biome format --write src/components/PhotoUpload.tsx`

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No type errors related to upload changes.

- [ ] **Step 5: Commit**

```bash
git add src/components/PhotoUpload.tsx
git commit -m "feat(upload): use new uploadFile() with auto multipart and retry"
```

---

## Task 7: Build Verification and Testing

- [ ] **Step 1: Run build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Run existing tests**

Run: `npm test`
Expected: Existing tests pass (should not break anything).

- [ ] **Step 3: Run linting**

Run: `npm run check`
Expected: No lint errors in changed files.

- [ ] **Step 4: Manual test - small file upload (<10MB)**

1. Start dev server: `npm run dev`
2. Open the app in browser, navigate to Photos tab
3. Upload a small JPEG (<5MB)
4. Verify: presign → single PUT → confirm flow works
5. Check browser console for `[Upload] Starting single upload` log
6. Photo appears in grid after upload

- [ ] **Step 5: Manual test - large file upload (>10MB)**

1. Upload a video or large photo (>10MB)
2. Verify: multipart create → parts upload → complete → confirm flow
3. Check browser console for `[Upload] Starting multipart upload` log
4. Progress bar shows incremental progress per chunk
5. File appears in grid after upload

- [ ] **Step 6: Manual test - retry behavior**

1. Open Network tab in DevTools
2. Start an upload, then throttle to "Offline" mid-upload
3. Verify: browser console shows retry attempts
4. Switch back to online, verify upload eventually succeeds or fails gracefully

- [ ] **Step 7: Manual test - Safari/iPhone**

1. Open the app on iPhone Safari
2. Upload a photo from Camera Roll
3. Verify: upload completes successfully
4. Upload a large video (>10MB)
5. Switch to another app briefly during upload, then return
6. Verify: upload completes (multipart chunks are individually small enough to survive brief suspension)

- [ ] **Step 8: Commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix(upload): address issues found during manual testing"
```

---

## Summary of Changes

| Change | Impact |
|--------|--------|
| R2 CORS configuration | Fixes the #1 cause of upload failures (cross-origin PUT blocked) |
| Retry with exponential backoff | Handles transient network/server errors at every step |
| Multipart upload (>10MB) | Large files split into 10MB chunks, each retried independently |
| Concurrent part uploads (3x) | Faster uploads for large files |
| Content-Length in presigned URL | Better server-side validation of upload size |
| Multipart abort on failure | Cleans up incomplete uploads in R2 |
| Simplified PhotoUpload component | Single `uploadFile()` call replaces 3-step manual flow |
