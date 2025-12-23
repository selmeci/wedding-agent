import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Accommodations table - Stores recommended accommodations in Modra
 */
export const accommodations = sqliteTable("accommodations", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	description: text("description").notNull(),
	address: text("address").notNull(),
	phone: text("phone").notNull(),
	email: text("email"),
	website: text("website"),
	priceRange: text("price_range").notNull(), // e.g., "€€", "€€€"
	distanceKm: integer("distance_km").notNull(), // Distance from venue in kilometers
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type Accommodation = typeof accommodations.$inferSelect;
export type NewAccommodation = typeof accommodations.$inferInsert;
