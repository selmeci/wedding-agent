import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface R2PresignConfig {
	endpoint: string;
	accessKeyId: string;
	secretAccessKey: string;
}

export function createR2Client(config: R2PresignConfig): S3Client {
	return new S3Client({
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
		throw new Error("No UploadId returned from CreateMultipartUpload");
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

	for (let partNumber = 1; partNumber <= partCount; partNumber++) {
		const command = new UploadPartCommand({
			Bucket: bucket,
			Key: key,
			UploadId: uploadId,
			PartNumber: partNumber,
		});

		const uploadUrl = await getSignedUrl(client, command, { expiresIn });
		parts.push({ partNumber, uploadUrl });
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
	const sortedParts = [...parts].sort((a, b) => a.partNumber - b.partNumber);

	const command = new CompleteMultipartUploadCommand({
		Bucket: bucket,
		Key: key,
		UploadId: uploadId,
		MultipartUpload: {
			Parts: sortedParts.map((part) => ({
				PartNumber: part.partNumber,
				ETag: part.etag,
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
