import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guests } from "./guests";

/**
 * Guest groups table - Stores groups of guests who share one QR code
 * Example: Family, couple with +1
 */
export const guestGroups = sqliteTable("guest_groups", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(), // e.g., "Rodina Novákovcov", "Marek a Katka"
	qrToken: text("qr_token").notNull().unique(),
	isFromModra: integer("is_from_modra", { mode: "boolean" }).default(false),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const guestGroupsRelations = relations(guestGroups, ({ many }) => ({
	guests: many(guests),
}));

export type GuestGroup = typeof guestGroups.$inferSelect;
export type NewGuestGroup = typeof guestGroups.$inferInsert;
