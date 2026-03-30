PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_photo_uploads` (
	`cloudflare_image_id` text,
	`duration` integer,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`guest_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`media_type` text DEFAULT 'image' NOT NULL,
	`mime_type` text NOT NULL,
	`r2_key` text,
	`stream_ready` integer DEFAULT false,
	`stream_video_uid` text,
	`thumbnail_r2_key` text,
	`uploaded_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_photo_uploads`("cloudflare_image_id", "duration", "file_name", "file_size", "guest_id", "id", "media_type", "mime_type", "r2_key", "stream_ready", "stream_video_uid", "thumbnail_r2_key", "uploaded_at") SELECT "cloudflare_image_id", "duration", "file_name", "file_size", "guest_id", "id", "media_type", "mime_type", "r2_key", "stream_ready", "stream_video_uid", "thumbnail_r2_key", "uploaded_at" FROM `photo_uploads`;--> statement-breakpoint
DROP TABLE `photo_uploads`;--> statement-breakpoint
ALTER TABLE `__new_photo_uploads` RENAME TO `photo_uploads`;--> statement-breakpoint
PRAGMA foreign_keys=ON;