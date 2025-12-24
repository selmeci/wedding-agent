import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guests } from "./guests";
import { guestGroups } from "./guest-groups";

/**
 * Chat sessions table - Tracks chat sessions for guests and visitors
 */
export const chatSessions = sqliteTable("chat_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guestId: text("guest_id").references(() => guests.id, {
    onDelete: "set null"
  }), // Identified individual guest
  groupId: text("group_id").references(() => guestGroups.id, {
    onDelete: "set null"
  }), // Group that arrived via QR code (before individual identification)
  sessionToken: text("session_token").notNull().unique(),
  conversationState: text("conversation_state", {
    enum: [
      "group_welcome",
      "identifying_individual",
      "identified",
      "collecting_rsvp",
      "completed"
    ] as const
  })
    .notNull()
    .default("identified"),
  identificationAttempts: integer("identification_attempts")
    .notNull()
    .default(0), // Number of attempts to identify guest
  identificationFailed: integer("identification_failed", { mode: "boolean" })
    .notNull()
    .default(false), // True if identification failed after max attempts
  identifiedAt: integer("identified_at", { mode: "timestamp" }), // Timestamp when guest was identified
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  lastActivityAt: integer("last_activity_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
