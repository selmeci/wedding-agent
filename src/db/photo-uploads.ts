import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guests } from "./guests";

/**
 * Photo uploads table - Tracks wedding photos uploaded by guests
 */
export const photoUploads = sqliteTable("photo_uploads", {
	cloudflareImageId: text("cloudflare_image_id"), // CF Images UUID (for images)
	duration: integer("duration"), // Video duration in seconds
	fileName: text("file_name").notNull(),
	fileSize: integer("file_size").notNull(), // Size in bytes
	guestId: text("guest_id")
		.notNull()
		.references(() => guests.id, { onDelete: "cascade" }),
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	mediaType: text("media_type", { enum: ["image", "video"] })
		.notNull()
		.default("image"),
	mimeType: text("mime_type").notNull(),
	r2Key: text("r2_key"), // R2 object key (nullable — deprecated, used during migration)
	streamReady: integer("stream_ready", { mode: "boolean" }).default(false), // Stream processing complete
	streamVideoUid: text("stream_video_uid"), // CF Stream UID (for videos)
	thumbnailR2Key: text("thumbnail_r2_key"), // For video thumbnails (deprecated)
	uploadedAt: integer("uploaded_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const photoUploadsRelations = relations(photoUploads, ({ one }) => ({
	guest: one(guests, {
		fields: [photoUploads.guestId],
		references: [guests.id],
	}),
}));

export type PhotoUpload = typeof photoUploads.$inferSelect;
export type NewPhotoUpload = typeof photoUploads.$inferInsert;
