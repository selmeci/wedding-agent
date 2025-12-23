import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guestGroups } from "./guest-groups";
import { guests } from "./guests";

/**
 * Guest group responses table - Stores RSVP responses at group level
 * One response per guest group (one family member answers for the whole group)
 */
export const guestGroupResponses = sqliteTable("guest_group_responses", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	groupId: text("group_id")
		.notNull()
		.unique()
		.references(() => guestGroups.id, { onDelete: "cascade" }),
	respondedBy: text("responded_by")
		.notNull()
		.references(() => guests.id, { onDelete: "set null" }),
	willAttend: integer("will_attend", { mode: "boolean" }),
	attendCeremony: integer("attend_ceremony", { mode: "boolean" }),
	dietaryRestrictions: text("dietary_restrictions"),
	needsAccommodation: integer("needs_accommodation", { mode: "boolean" }),
	needsTransportAfter: integer("needs_transport_after", { mode: "boolean" }),
	needsDirections: integer("needs_directions", { mode: "boolean" }), // DEPRECATED - use getWeddingInfo for directions
	isComplete: integer("is_complete", { mode: "boolean" })
		.notNull()
		.default(false),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type GuestGroupResponse = typeof guestGroupResponses.$inferSelect;
export type NewGuestGroupResponse = typeof guestGroupResponses.$inferInsert;
