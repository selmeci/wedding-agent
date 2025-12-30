import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guests } from "./guests";

/**
 * Guest responses table - Stores responses collected from guests via chatbot
 */
export const guestResponses = sqliteTable("guest_responses", {
	attendCeremony: integer("attend_ceremony", { mode: "boolean" }), // Attend ceremony even if not invited to reception
	dietaryRestrictions: text("dietary_restrictions"),
	guestId: text("guest_id")
		.notNull()
		.references(() => guests.id, { onDelete: "cascade" }),
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	needsDirections: integer("needs_directions", { mode: "boolean" })
		.notNull()
		.default(false),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	willAttend: integer("will_attend", { mode: "boolean" }), // null = not answered yet
});

export type GuestResponse = typeof guestResponses.$inferSelect;
export type NewGuestResponse = typeof guestResponses.$inferInsert;
