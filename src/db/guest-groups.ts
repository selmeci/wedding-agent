import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guestGroupResponses } from "@/db/guest-group-responses";
import { guests } from "./guests";

/**
 * Guest groups table - Stores groups of guests who share one QR code
 * Example: Family, couple with +1
 */
export const guestGroups = sqliteTable("guest_groups", {
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	isFromModra: integer("is_from_modra", { mode: "boolean" }).default(false),
	name: text("name").notNull(), // e.g., "Rodina Novákovcov", "Marek a Katka"
	newsletterEmail: text("newsletter_email"),
	qrToken: text("qr_token").notNull().unique(),
});

export const guestGroupsRelations = relations(guestGroups, ({ many }) => ({
	guests: many(guests),
	responses: many(guestGroupResponses),
}));

export type GuestGroup = typeof guestGroups.$inferSelect;
export type NewGuestGroup = typeof guestGroups.$inferInsert;
