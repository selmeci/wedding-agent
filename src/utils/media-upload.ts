import * as tus from "tus-js-client";
import { retryWithBackoff } from "@/utils/upload-retry";

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

// --- Types ---

export interface UploadProgress {
	phase: "preparing" | "uploading" | "confirming" | "done";
	percent: number;
}

export interface UploadResult {
	id: string;
	mediaType: "image" | "video";
	duration?: number;
}

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

// --- CF Images / CF Stream Upload ---

interface CFUploadUrlResponse {
	uploadURL?: string;
	tusUploadUrl?: string;
	mediaId: string;
	mediaType: "image" | "video";
	guestId: string;
}

/**
 * Upload a video file via tus-js-client to Cloudflare Stream.
 * Uses chunked, resumable upload protocol — survives connection drops.
 */
function uploadVideoViaTus(
	file: File,
	tusUploadUrl: string,
	onProgress?: (progress: UploadProgress) => void,
): Promise<void> {
	const tusStart = performance.now();
	let chunkCount = 0;
	let lastChunkTime = tusStart;

	console.log(
		`[TUS] Starting: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB), URL: ${tusUploadUrl.substring(0, 80)}...`,
	);

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
			onChunkComplete(chunkSize, bytesUploaded, bytesTotal) {
				chunkCount++;
				const now = performance.now();
				const chunkMs = now - lastChunkTime;
				const speedMbps = (
					(chunkSize * 8) /
					(chunkMs / 1000) /
					1_000_000
				).toFixed(1);
				console.log(
					`[TUS] Chunk ${chunkCount}: ${(bytesUploaded / 1024 / 1024).toFixed(1)}/${(bytesTotal / 1024 / 1024).toFixed(1)}MB (${chunkMs.toFixed(0)}ms, ${speedMbps} Mbps)`,
				);
				lastChunkTime = now;
			},
			onProgress(bytesUploaded, bytesTotal) {
				const percent = Math.round((bytesUploaded / bytesTotal) * 100);
				onProgress?.({ phase: "uploading", percent });
			},
			onSuccess() {
				const totalSec = ((performance.now() - tusStart) / 1000).toFixed(1);
				const avgMbps = (
					(file.size * 8) /
					Number(totalSec) /
					1_000_000
				).toFixed(1);
				console.log(
					`[TUS] ✅ Finished: ${file.name} in ${totalSec}s (${avgMbps} Mbps avg, ${chunkCount} chunks)`,
				);
				resolve();
			},
			onError(error) {
				const elapsed = ((performance.now() - tusStart) / 1000).toFixed(1);
				console.error(
					`[TUS] ❌ Error after ${elapsed}s, chunk ${chunkCount}: ${file.name}`,
					error,
				);
				reject(
					new Error(`TUS upload failed: ${error.message || "Unknown error"}`),
				);
			},
			onShouldRetry(err, retryAttempt, _options) {
				console.warn(`[TUS] ⚠️ Retry #${retryAttempt} for ${file.name}:`, err);
				return true;
			},
		});

		upload.start();
	});
}

/**
 * Upload a file via Cloudflare Images (for images) or Cloudflare Stream (for videos).
 * Uses Direct Creator Upload — browser uploads directly to CF's one-time URL.
 */
export async function uploadMediaViaCF(
	file: File,
	qrToken: string,
	guestId: string | null,
	onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
	const mimeType = inferMimeType(file);
	const isVideo = isVideoMimeType(mimeType);
	const mediaType: "image" | "video" = isVideo ? "video" : "image";

	const t0 = performance.now();
	const mb = (file.size / 1024 / 1024).toFixed(2);
	console.log(
		`[CF Upload] Starting: ${file.name} (${mb}MB, ${mediaType}, mime=${mimeType})`,
	);

	// Step 1: Get one-time upload URL from our Worker
	onProgress?.({ phase: "preparing", percent: 0 });
	const t1 = performance.now();

	const uploadUrlData = await retryWithBackoff(
		() =>
			jsonPost<CFUploadUrlResponse>(
				"/api/media/upload-url",
				{
					fileName: file.name,
					contentType: mimeType,
					mediaType,
					fileSize: file.size,
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
	console.log(
		`[CF Upload] Step 1 (get URL): ${((performance.now() - t1) / 1000).toFixed(2)}s`,
	);

	// Step 2: Upload file to CF
	onProgress?.({ phase: "uploading", percent: 0 });
	const t2 = performance.now();

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
					xhr.open("POST", uploadUrlData.uploadURL!);

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

	console.log(
		`[CF Upload] Step 2 (upload to CF): ${((performance.now() - t2) / 1000).toFixed(2)}s`,
	);

	// Step 3: Confirm upload with JSON metadata (no file — fast, small payload)
	onProgress?.({ phase: "confirming", percent: 100 });
	const t3 = performance.now();

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

	console.log(
		`[CF Upload] Step 3 (confirm): ${((performance.now() - t3) / 1000).toFixed(2)}s`,
	);

	onProgress?.({ phase: "done", percent: 100 });

	const totalSec = ((performance.now() - t0) / 1000).toFixed(2);
	console.log(
		`[CF Upload] ✅ Complete: ${file.name} → ${result.id} (${result.mediaType}) in ${totalSec}s total`,
	);

	return result;
}
