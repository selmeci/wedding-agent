export interface PresignResponse {
	mediaId: string;
	uploadUrl: string;
	r2Key: string;
	mediaType: "image" | "video";
	guestId: string;
}

export interface UploadProgress {
	phase: "preparing" | "uploading" | "confirming" | "done";
	percent: number;
}

export async function getPresignedUrl(
	file: File,
	qrToken: string,
	guestId: string | null,
): Promise<PresignResponse> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"x-qr-token": qrToken,
	};
	if (guestId) {
		headers["x-guest-id"] = guestId;
	}

	const response = await fetch("/api/media/presign", {
		method: "POST",
		headers,
		body: JSON.stringify({
			fileName: file.name,
			contentType: file.type,
			fileSize: file.size,
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(
			(error as { error?: string }).error || "Failed to get upload URL",
		);
	}

	return response.json();
}

export function uploadToR2(
	url: string,
	file: File,
	onProgress?: (percent: number) => void,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		const startTime = Date.now();
		let lastProgressTime = startTime;
		let lastLoaded = 0;

		// Log upload start (mask the signature part of presigned URL for security)
		const urlForLog = url.split("?")[0];
		console.log(
			`[R2 Upload] Starting: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) to ${urlForLog}`,
		);

		xhr.upload.addEventListener("progress", (e) => {
			if (e.lengthComputable) {
				const percent = Math.round((e.loaded / e.total) * 100);
				const now = Date.now();
				const timeDiff = (now - lastProgressTime) / 1000;
				const bytesDiff = e.loaded - lastLoaded;
				const speed = timeDiff > 0 ? bytesDiff / timeDiff / 1024 / 1024 : 0;

				// Log progress every 10%
				if (percent % 10 === 0 || percent === 100) {
					console.log(
						`[R2 Upload] Progress: ${percent}% (${(e.loaded / 1024 / 1024).toFixed(2)}/${(e.total / 1024 / 1024).toFixed(2)}MB, ${speed.toFixed(2)}MB/s)`,
					);
				}

				lastProgressTime = now;
				lastLoaded = e.loaded;

				if (onProgress) {
					onProgress(percent);
				}
			}
		});

		xhr.addEventListener("load", () => {
			const duration = ((Date.now() - startTime) / 1000).toFixed(1);
			if (xhr.status >= 200 && xhr.status < 300) {
				console.log(
					`[R2 Upload] Success: ${file.name} in ${duration}s (status ${xhr.status})`,
				);
				resolve();
			} else {
				const errorMsg = `Upload failed: status ${xhr.status}, response: ${xhr.responseText?.substring(0, 200)}`;
				console.error(`[R2 Upload] Failed: ${errorMsg}`);
				reject(new Error(errorMsg));
			}
		});

		xhr.addEventListener("error", () => {
			const duration = ((Date.now() - startTime) / 1000).toFixed(1);
			const errorInfo = {
				readyState: xhr.readyState,
				status: xhr.status,
				statusText: xhr.statusText,
				responseText: xhr.responseText?.substring(0, 200),
				duration: `${duration}s`,
				uploadedBytes: lastLoaded,
				totalBytes: file.size,
				uploadedPercent: Math.round((lastLoaded / file.size) * 100),
			};
			console.error(`[R2 Upload] Network error:`, errorInfo);
			reject(
				new Error(
					`Network error at ${errorInfo.uploadedPercent}% after ${duration}s (readyState=${xhr.readyState}, status=${xhr.status})`,
				),
			);
		});

		xhr.addEventListener("abort", () => {
			const duration = ((Date.now() - startTime) / 1000).toFixed(1);
			console.error(
				`[R2 Upload] Aborted after ${duration}s at ${Math.round((lastLoaded / file.size) * 100)}%`,
			);
			reject(new Error("Upload aborted"));
		});

		xhr.addEventListener("timeout", () => {
			const duration = ((Date.now() - startTime) / 1000).toFixed(1);
			console.error(
				`[R2 Upload] Timeout after ${duration}s at ${Math.round((lastLoaded / file.size) * 100)}%`,
			);
			reject(new Error(`Upload timeout after ${duration}s`));
		});

		// Set timeout to 10 minutes for large files
		xhr.timeout = 10 * 60 * 1000;

		xhr.open("PUT", url);
		xhr.setRequestHeader("Content-Type", file.type);
		xhr.send(file);
	});
}

export async function confirmUpload(
	presignData: PresignResponse,
	file: File,
	qrToken: string,
	thumbnail: Blob | null,
	duration: number | null,
): Promise<{ id: string; mediaType: "image" | "video"; duration?: number }> {
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
		const error = await response.json();
		throw new Error(
			(error as { error?: string }).error || "Failed to confirm upload",
		);
	}

	return response.json();
}
