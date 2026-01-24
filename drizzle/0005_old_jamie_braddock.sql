ALTER TABLE `photo_uploads` ADD `duration` integer;--> statement-breakpoint
ALTER TABLE `photo_uploads` ADD `media_type` text DEFAULT 'image' NOT NULL;--> statement-breakpoint
ALTER TABLE `photo_uploads` ADD `thumbnail_r2_key` text;