-- Fix: migration 0006 inserted column names as literal strings
-- because the old table didn't have these columns.
-- SQLite treated "column_name" as a string literal, not a column reference.
UPDATE `photo_uploads` SET `cloudflare_image_id` = NULL WHERE `cloudflare_image_id` = 'cloudflare_image_id';--> statement-breakpoint
UPDATE `photo_uploads` SET `stream_video_uid` = NULL WHERE `stream_video_uid` = 'stream_video_uid';--> statement-breakpoint
UPDATE `photo_uploads` SET `stream_ready` = NULL WHERE `stream_ready` = 'stream_ready';--> statement-breakpoint
UPDATE `photo_uploads` SET `cloudflare_image_id` = NULL WHERE `cloudflare_image_id` = 'NULL';--> statement-breakpoint
UPDATE `photo_uploads` SET `stream_video_uid` = NULL WHERE `stream_video_uid` = 'NULL';
