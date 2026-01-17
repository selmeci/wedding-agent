import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guestGroups } from "./guest-groups";

/**
 * Audio recordings table - Tracks wedding voice greetings uploaded by guest groups
 */
export const audioRecordings = sqliteTable("audio_recordings", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	groupId: text("group_id")
		.notNull()
		.references(() => guestGroups.id, { onDelete: "cascade" }),
	fileName: text("file_name").notNull(),
	fileSize: integer("file_size").notNull(), // Size in bytes
	mimeType: text("mime_type").notNull(), // audio/mp4, audio/webm, etc.
	duration: integer("duration"), // Duration in seconds (max 60)
	r2Key: text("r2_key").notNull().unique(), // R2 object key
	uploadedAt: integer("uploaded_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type AudioRecording = typeof audioRecordings.$inferSelect;
export type NewAudioRecording = typeof audioRecordings.$inferInsert;
