CREATE TABLE `audio_recordings` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`duration` integer,
	`r2_key` text NOT NULL,
	`uploaded_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `guest_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audio_recordings_r2_key_unique` ON `audio_recordings` (`r2_key`);