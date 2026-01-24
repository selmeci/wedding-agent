import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guests } from "./guests";

/**
 * Photo uploads table - Tracks wedding photos uploaded by guests
 */
export const photoUploads = sqliteTable("photo_uploads", {
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
	r2Key: text("r2_key").notNull().unique(), // R2 object key
	thumbnailR2Key: text("thumbnail_r2_key"), // For video thumbnails
	uploadedAt: integer("uploaded_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type PhotoUpload = typeof photoUploads.$inferSelect;
export type NewPhotoUpload = typeof photoUploads.$inferInsert;
