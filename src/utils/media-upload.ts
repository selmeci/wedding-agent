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
			onRetry: (attempt) => console.log(`[Upload] Presign retry #${attempt}`),
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
								new Error(
									"Missing ETag in response - check R2 CORS ExposeHeaders",
								),
							);
							return;
						}
						resolve(etag);
					} else {
						reject(new Error(`Part upload failed: status ${xhr.status}`));
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

					const etag = await uploadPart(part.uploadUrl, blob, file.type);

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

async function completeMultipart(
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

async function abortMultipart(
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
	presignData: {
		mediaId: string;
		r2Key: string;
		guestId: string;
		mediaType: "image" | "video";
	},
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
			onRetry: (attempt) => console.log(`[Upload] Confirm retry #${attempt}`),
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

			await completeMultipart(
				multipart.uploadId,
				multipart.r2Key,
				completedParts,
				qrToken,
			);
		} catch (error) {
			// Abort multipart upload on failure (best-effort cleanup)
			await abortMultipart(multipart.uploadId, multipart.r2Key, qrToken);
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
