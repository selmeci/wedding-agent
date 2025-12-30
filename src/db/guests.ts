import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guestGroups } from "./guest-groups";

/**
 * Guests table - Stores information about wedding guests
 * SIMPLIFIED: All guests belong to a group (even if group has only 1 member)
 */
export const guests = sqliteTable("guests", {
	about: text("about"), // useful information about guest. Can be used for personalized messages and for matching unknown web site visitors with existing guests.
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	email: text("email").notNull(),
	firstName: text("first_name").notNull(),
	groupId: text("group_id")
		.notNull()
		.references(() => guestGroups.id, {
			onDelete: "cascade",
		}), // Every guest MUST belong to a group
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	lastName: text("last_name").notNull(),
	phone: text("phone").notNull(),
	relationship: text("relationship").notNull(), // e.g., "rodina nevesty", "priatelia zenicha"
});

export const guestsRelations = relations(guests, ({ one }) => ({
	group: one(guestGroups, {
		fields: [guests.groupId],
		references: [guestGroups.id],
	}),
}));

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
