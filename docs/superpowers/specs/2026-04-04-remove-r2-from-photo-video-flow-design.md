# Remove R2 from Photo/Video Upload Flow

## Goal

Simplify photo/video uploads by removing the R2 storage step. Files go directly to CF Images (photos) or CF Stream (videos). R2 remains in use only for audio recordings. No existing data is deleted.

## Background

The upload flow currently has 4 steps:

1. `POST /api/media/upload-url` — get one-time CF upload URL
2. Upload file to CF Images or CF Stream directly
3. `POST /api/media/confirm` — create DB record
4. `PUT /api/media/upload-original` — store original in R2 (non-fatal, often fails silently)

Step 4 was added to ensure originals were available for download, but the download endpoint now falls back to CF Images blob API and CF Stream downloads (PR #7). Step 4 is no longer needed and causes silent failures when it doesn't complete.

## Scope

### Remove

| What | Where | Why |
|------|-------|-----|
| R2 upload step in frontend | `src/utils/media-upload.ts:281-296` | Step 4 no longer needed |
| `PUT /api/media/upload-original/:mediaId` endpoint | `src/server.ts` | No longer called by frontend |
| R2 write in reupload endpoint | `src/server.ts` (`POST /api/gallery/reupload/:id`) | Reupload goes to CF only |
| R2 delete in reupload endpoint | `src/server.ts` (`POST /api/gallery/reupload/:id`) | Don't delete old R2 data |
| R2 delete in photo delete endpoint | `src/server.ts` (`DELETE /api/photos/:id`) | Don't delete old R2 data |
| `GET /api/admin/migrate-raw/:id` endpoint | `src/server.ts` | Migration is complete |
| `POST /api/admin/migrate-media` endpoint | `src/server.ts` | Migration is complete |

### Keep unchanged

| What | Why |
|------|-----|
| DB schema (`photo_uploads.r2Key`, `thumbnailR2Key`) | No migration — columns are nullable, harmless |
| R2 bucket binding in `wrangler.jsonc` | Audio recordings need it |
| Audio endpoints (`POST /api/audio`, `GET /api/audio/:id/stream`, `DELETE /api/audio/:id`) | Audio is R2-only |
| Download endpoint (`GET /api/photos/:id/file`) | Tiered fallback R2 → CF Images → CF Stream stays — old R2 files remain accessible |
| Existing R2 objects | Nothing is deleted from the bucket |
| `POST /api/admin/enable-stream-downloads` | Still needed for enabling CF Stream downloads |

## Result

Upload flow becomes 3 steps:

1. `POST /api/media/upload-url` — get one-time CF upload URL
2. Upload file to CF Images or CF Stream directly
3. `POST /api/media/confirm` — create DB record

No silent failures. No duplicate storage for new uploads. Simpler frontend code.
