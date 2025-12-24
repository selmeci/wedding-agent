import type { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/d1";
import { accommodations } from "./accommodations";
import { chatMessages } from "./chat-messages";
import { chatSessions } from "./chat-sessions";
import { guestGroupResponses } from "./guest-group-responses";
import { guestGroups, guestGroupsRelations } from "./guest-groups";
import { guestResponses } from "./guest-responses";
import { guests, guestsRelations } from "./guests";
import { photoUploads } from "./photo-uploads";

export * from "./accommodations";
export * from "./chat-messages";
export * from "./chat-sessions";
export * from "./guest-group-responses";
export * from "./guest-groups";
export * from "./guest-responses";
export * from "./guests";
export * from "./photo-uploads";

export const schema = {
  accommodations,
  chatMessages,
  chatSessions,
  guestGroupResponses,
  guestGroups,
  guestGroupsRelations,
  guestResponses,
  guests,
  guestsRelations,
  photoUploads
} as const;

export type Schema = typeof schema;
export type Database = DrizzleD1Database<typeof schema>;

export const createDb = (db: D1Database) => drizzle(db, { schema });
