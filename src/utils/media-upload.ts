import { retryWithBackoff } from "@/utils/upload-retry";

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
	uploadURL: string;
	mediaId: string;
	mediaType: "image" | "video";
	guestId: string;
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
	const videoTypes = [
		"video/mp4",
		"video/quicktime",
		"video/webm",
		"video/x-m4v",
	];
	const baseType = file.type.split(";")[0].trim();
	const isVideo = videoTypes.includes(baseType);
	const mediaType: "image" | "video" = isVideo ? "video" : "image";

	console.log(
		`[CF Upload] Starting: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, ${mediaType})`,
	);

	// Step 1: Get one-time upload URL from our Worker
	onProgress?.({ phase: "preparing", percent: 0 });

	const uploadUrlData = await retryWithBackoff(
		() =>
			jsonPost<CFUploadUrlResponse>(
				"/api/media/upload-url",
				{
					fileName: file.name,
					contentType: file.type,
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

	// Step 3: Confirm upload with our Worker (saves metadata to D1)
	onProgress?.({ phase: "confirming", percent: 100 });

	const confirmBody: Record<string, unknown> = {
		mediaId: uploadUrlData.mediaId,
		fileName: file.name,
		guestId: resolvedGuestId,
		mediaType,
		fileSize: file.size,
		mimeType: file.type,
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

	onProgress?.({ phase: "done", percent: 100 });

	console.log(
		`[CF Upload] Complete: ${file.name} → ${result.id} (${result.mediaType})`,
	);

	return result;
}
