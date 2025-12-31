import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guestGroups } from "./guest-groups";
import { guests } from "./guests";

/**
 * Guest group responses table - Stores RSVP responses at group level
 * One response per guest group (one family member answers for the whole group)
 */
export const guestGroupResponses = sqliteTable("guest_group_responses", {
	attendCeremony: integer("attend_ceremony", { mode: "boolean" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	dietaryRestrictions: text("dietary_restrictions"),
	groupId: text("group_id")
		.notNull()
		.unique()
		.references(() => guestGroups.id, { onDelete: "cascade" }),
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	isComplete: integer("is_complete", { mode: "boolean" })
		.notNull()
		.default(false),
	needsAccommodation: integer("needs_accommodation", { mode: "boolean" }),
	needsDirections: integer("needs_directions", { mode: "boolean" }), // DEPRECATED - use getWeddingInfo for directions
	needsTransportAfter: integer("needs_transport_after", { mode: "boolean" }),
	respondedBy: text("responded_by")
		.notNull()
		.references(() => guests.id, { onDelete: "set null" }),
	transportDestination: text("transport_destination"), // Destination for transport after celebration (e.g., "Bratislava", "Pezinok")
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	willAttend: integer("will_attend", { mode: "boolean" }),
});

export const guestGroupResponsesRelations = relations(
	guestGroupResponses,
	({ one }) => ({
		group: one(guestGroups, {
			fields: [guestGroupResponses.groupId],
			references: [guestGroups.id],
		}),
	}),
);

export type GuestGroupResponse = typeof guestGroupResponses.$inferSelect;
export type NewGuestGroupResponse = typeof guestGroupResponses.$inferInsert;
