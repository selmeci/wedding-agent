import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Accommodations table - Stores recommended accommodations in Modra
 */
export const accommodations = sqliteTable("accommodations", {
	address: text("address").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	description: text("description").notNull(),
	distanceKm: integer("distance_km").notNull(), // Distance from venue in kilometers
	email: text("email"),
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	phone: text("phone").notNull(),
	priceRange: text("price_range").notNull(), // e.g., "€€", "€€€"
	website: text("website"),
});

export type Accommodation = typeof accommodations.$inferSelect;
export type NewAccommodation = typeof accommodations.$inferInsert;
