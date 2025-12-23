import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guestGroups } from "./guest-groups";

/**
 * Guests table - Stores information about wedding guests
 * SIMPLIFIED: All guests belong to a group (even if group has only 1 member)
 */
export const guests = sqliteTable("guests", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	groupId: text("group_id")
		.notNull()
		.references(() => guestGroups.id, {
			onDelete: "cascade",
		}), // Every guest MUST belong to a group
	about: text("about"), // useful information about guest. Can be used for personalized messages and for matching unknown web site visitors with existing guests.
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	relationship: text("relationship").notNull(), // e.g., "rodina nevesty", "priatelia zenicha"
	email: text("email").notNull(),
	phone: text("phone").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const guestsRelations = relations(guests, ({ one }) => ({
	group: one(guestGroups, {
		fields: [guests.groupId],
		references: [guestGroups.id],
	}),
}));

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
