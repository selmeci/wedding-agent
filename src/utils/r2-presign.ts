import {
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
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
): Promise<string> {
	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: key,
		ContentType: contentType,
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
