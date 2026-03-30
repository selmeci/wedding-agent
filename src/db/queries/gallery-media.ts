import type { Database } from "@/db";

export type GalleryGroup = {
	groupName: string;
	groupId: string;
	mediaCount: number;
	media: {
		id: string;
		fileName: string;
		mediaType: string;
		duration: number | null;
		uploadedAt: Date;
		cloudflareImageId: string | null;
		streamVideoUid: string | null;
		streamReady: boolean | null;
	}[];
};

/**
 * Fetch all uploaded media grouped by guest group.
 *
 * - Filters out groups with no media
 * - Sorts groups alphabetically by name (ascending)
 * - Sorts media within each group by uploadedAt descending (newest first)
 */
export async function fetchGalleryMedia(db: Database): Promise<GalleryGroup[]> {
	const allGroups = await db.query.guestGroups.findMany({
		with: {
			guests: {
				with: {
					photoUploads: true,
				},
			},
		},
	});

	const result: GalleryGroup[] = allGroups
		.map((group) => {
			const media = group.guests
				.flatMap((guest) => guest.photoUploads)
				.map((upload) => ({
					cloudflareImageId: upload.cloudflareImageId,
					duration: upload.duration,
					fileName: upload.fileName,
					id: upload.id,
					mediaType: upload.mediaType,
					streamReady: upload.streamReady,
					streamVideoUid: upload.streamVideoUid,
					uploadedAt: upload.uploadedAt,
				}))
				.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

			return {
				groupId: group.id,
				groupName: group.name,
				media,
				mediaCount: media.length,
			};
		})
		.filter((group) => group.mediaCount > 0)
		.sort((a, b) => a.groupName.localeCompare(b.groupName, "sk"));

	return result;
}
