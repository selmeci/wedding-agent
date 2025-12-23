import { routeAgentRequest } from "agents";
import { Hono } from "hono";
import { accommodationSeedData } from "@/data/accommodations";
import { guestGroupSeedData } from "@/data/guest-groups";
import {
	accommodations,
	chatMessages,
	chatSessions,
	createDb,
	guestGroupResponses,
	guestGroups,
	guestResponses,
	guests,
	photoUploads,
} from "@/db";

export * from "@/agents";

const app = new Hono<{ Bindings: Env }>();

// Seed import route
app.post("/api/seed", async (c) => {
	try {
		// Verify API key
		const apiKey = c.req.header("x-api-key");
		const expectedKey = c.env.SECRET;

		if (!apiKey || apiKey !== expectedKey) {
			return c.status(401);
		}

		const db = createDb(c.env.DB);

		console.log("🧹 Starting database cleanup...");

		// Step 1: Clear all D1 tables (in correct order due to foreign keys)
		console.log("🗑️  Clearing D1 tables...");

		// Delete in order: child tables first, then parent tables
		await db.delete(photoUploads); // references guests
		console.log("  - photo_uploads cleared");

		await db.delete(chatMessages); // references chat_sessions
		console.log("  - chat_messages cleared");

		await db.delete(chatSessions); // references guests + guest_groups
		console.log("  - chat_sessions cleared");

		await db.delete(guestGroupResponses); // references guest_groups
		console.log("  - guest_group_responses cleared");

		await db.delete(guestResponses); // references guests
		console.log("  - guest_responses cleared");

		await db.delete(accommodations); // no dependencies
		console.log("  - accommodations cleared");

		await db.delete(guests); // references guest_groups
		console.log("  - guests cleared");

		await db.delete(guestGroups); // parent table
		console.log("  - guest_groups cleared");

		console.log("✅ All D1 tables cleared");

		// Step 2: Insert guest groups and their members
		console.log("📝 Seeding guest groups into D1...");
		let totalGroupGuests = 0;

		for (const groupSeed of guestGroupSeedData) {
			// Insert the group
			const [insertedGroup] = await db
				.insert(guestGroups)
				.values(groupSeed.group)
				.returning();

			console.log(`  - Inserted group: ${groupSeed.group.name}`);

			// Insert all guests in this group
			const groupGuestsWithGroupId = groupSeed.guests.map((guest) => ({
				...guest,
				groupId: insertedGroup.id,
			}));

			await db.insert(guests).values(groupGuestsWithGroupId);
			totalGroupGuests += groupGuestsWithGroupId.length;

			console.log(
				`    → ${groupGuestsWithGroupId.length} guests added to group`,
			);
		}

		console.log(
			`✅ Inserted ${guestGroupSeedData.length} groups with ${totalGroupGuests} total guests`,
		);

		// Step 3: Insert accommodations into D1
		console.log("📝 Seeding accommodations into D1...");
		const insertedAccommodations = await db
			.insert(accommodations)
			.values(accommodationSeedData)
			.returning();

		console.log(
			`✅ Inserted ${insertedAccommodations.length} accommodations into D1`,
		);

		// Success response
		return c.json({
			message: "Database seeded successfully",
			stats: {
				accommodations: insertedAccommodations.length,
				guestGroups: guestGroupSeedData.length,
				totalGuests: totalGroupGuests,
			},
			success: true,
		});
	} catch (error) {
		console.error("❌ Seed error:", error);

		return c.json(
			{
				details: error instanceof Error ? error.message : String(error),
				error: "Failed to seed database",
			},
			500,
		);
	}
});

// Agent route
app.all("/agents/*", async (c) => {
	const response = await routeAgentRequest(c.req.raw, c.env, {
		jurisdiction: "eu",
	});
	return response || c.notFound();
});

/**
 * Worker entry point that routes incoming requests to the appropriate handler
 */
export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
