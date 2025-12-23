import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guests } from "./guests";

/**
 * Photo uploads table - Tracks wedding photos uploaded by guests
 */
export const photoUploads = sqliteTable("photo_uploads", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	guestId: text("guest_id")
		.notNull()
		.references(() => guests.id, { onDelete: "cascade" }),
	r2Key: text("r2_key").notNull().unique(), // R2 object key
	fileName: text("file_name").notNull(),
	fileSize: integer("file_size").notNull(), // Size in bytes
	mimeType: text("mime_type").notNull(),
	uploadedAt: integer("uploaded_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type PhotoUpload = typeof photoUploads.$inferSelect;
export type NewPhotoUpload = typeof photoUploads.$inferInsert;
