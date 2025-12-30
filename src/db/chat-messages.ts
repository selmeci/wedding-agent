import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { chatSessions } from "./chat-sessions";

/**
 * Chat messages table - Stores all chat conversation history
 */
export const chatMessages = sqliteTable("chat_messages", {
	content: text("content").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
	sessionId: text("session_id")
		.notNull()
		.references(() => chatSessions.id, { onDelete: "cascade" }),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
