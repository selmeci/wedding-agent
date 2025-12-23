CREATE TABLE `accommodations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`address` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`website` text,
	`price_range` text NOT NULL,
	`distance_km` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `chat_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text,
	`group_id` text,
	`session_token` text NOT NULL,
	`conversation_state` text DEFAULT 'identified' NOT NULL,
	`identification_attempts` integer DEFAULT 0 NOT NULL,
	`identification_failed` integer DEFAULT false NOT NULL,
	`identified_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_activity_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`group_id`) REFERENCES `guest_groups`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chat_sessions_session_token_unique` ON `chat_sessions` (`session_token`);--> statement-breakpoint
CREATE TABLE `guest_group_responses` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`responded_by` text NOT NULL,
	`will_attend` integer,
	`attend_ceremony` integer,
	`dietary_restrictions` text,
	`needs_accommodation` integer,
	`needs_directions` integer,
	`is_complete` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `guest_groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`responded_by`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guest_group_responses_group_id_unique` ON `guest_group_responses` (`group_id`);--> statement-breakpoint
CREATE TABLE `guest_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`qr_token` text NOT NULL,
	`is_from_modra` integer DEFAULT false,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guest_groups_qr_token_unique` ON `guest_groups` (`qr_token`);--> statement-breakpoint
CREATE TABLE `guest_responses` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`will_attend` integer,
	`attend_ceremony` integer,
	`dietary_restrictions` text,
	`needs_directions` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`about` text,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`relationship` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `guest_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `photo_uploads` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`r2_key` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`uploaded_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `photo_uploads_r2_key_unique` ON `photo_uploads` (`r2_key`);