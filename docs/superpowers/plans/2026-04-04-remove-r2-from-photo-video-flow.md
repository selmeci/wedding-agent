# Remove R2 from Photo/Video Upload Flow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove R2 storage from the photo/video upload pipeline, leaving CF Images and CF Stream as the sole storage. R2 stays for audio only.

**Architecture:** Remove the frontend R2 upload step, delete the `upload-original` backend endpoint, strip R2 writes/deletes from reupload and delete endpoints, and remove completed migration admin endpoints. The download endpoint's tiered fallback (R2 → CF) stays unchanged so old R2 files remain accessible. DB schema untouched.

**Tech Stack:** Cloudflare Workers, Hono, TypeScript, CF Images API, CF Stream API

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/utils/media-upload.ts` | Modify | Remove Step 4 (R2 upload) from frontend upload flow |
| `src/server.ts` | Modify | Remove `upload-original` endpoint, strip R2 from reupload/delete, remove migration endpoints |

---

### Task 1: Remove R2 upload step from frontend

**Files:**
- Modify: `src/utils/media-upload.ts:281-296`

- [ ] **Step 1: Remove the Step 4 R2 upload block**

In `src/utils/media-upload.ts`, replace lines 280-296:

```typescript
	// Step 4: Stream original file to R2 (background — non-blocking for UX)
	try {
		await fetch(`/api/media/upload-original/${uploadUrlData.mediaId}`, {
			method: "PUT",
			headers: {
				"x-qr-token": qrToken,
				"x-file-name": file.name,
				"Content-Type": mimeType,
			},
			body: file,
		});
		console.log(`[CF Upload] Original stored in R2 for ${file.name}`);
	} catch (err) {
		// Non-fatal — CF still has the file for serving
		console.warn(`[CF Upload] Failed to store original in R2:`, err);
	}

	onProgress?.({ phase: "done", percent: 100 });
```

With:

```typescript
	onProgress?.({ phase: "done", percent: 100 });
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Format**

Run: `pnpm exec biome format --write src/utils/media-upload.ts`

- [ ] **Step 4: Commit**

```bash
git add src/utils/media-upload.ts
git commit -m "refactor: remove R2 upload step from frontend media upload

Upload flow simplified from 4 steps to 3. Files go directly to
CF Images/Stream without R2 copy."
```

---

### Task 2: Remove `upload-original` endpoint from backend

**Files:**
- Modify: `src/server.ts:898-955`

- [ ] **Step 1: Delete the `PUT /api/media/upload-original/:mediaId` endpoint**

In `src/server.ts`, delete the entire endpoint block from line 898 (`// PUT /api/media/upload-original/:mediaId`) through line 955 (`});`) inclusive, including the blank line before it.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/server.ts
git commit -m "refactor: remove upload-original R2 endpoint

No longer called by frontend after Step 4 removal."
```

---

### Task 3: Strip R2 from reupload endpoint

**Files:**
- Modify: `src/server.ts` (reupload endpoint `POST /api/gallery/reupload/:id`)

The reupload endpoint currently: stores new file in R2, uploads to CF, updates DB with `r2Key`, deletes old R2 objects. We remove all R2 operations.

- [ ] **Step 1: Remove R2 key generation and R2 put**

In the reupload endpoint, replace this block:

```typescript
	const isVideo = file.type.startsWith("video/");

	// Store new original in R2 for downloads
	const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
	const newR2Key = `groups/${photo.guestId}/originals/${photoId}.${ext}`;

	try {
		// Save new original to R2
		await c.env.BUCKET.put(newR2Key, await file.arrayBuffer(), {
			httpMetadata: { contentType: file.type },
		});
```

With:

```typescript
	const isVideo = file.type.startsWith("video/");

	try {
```

- [ ] **Step 2: Remove `r2Key` from video DB update and R2 deletes**

In the video branch of the reupload endpoint, replace:

```typescript
			await db
				.update(photoUploads)
				.set({
					streamVideoUid: cfData.result.uid,
					streamReady: false,
					cloudflareImageId: null,
					r2Key: newR2Key,
					mimeType: file.type,
					fileName: file.name,
					fileSize: file.size,
				})
				.where(eq(photoUploads.id, photoId));

			// Delete old R2 objects (old key, not the new original)
			if (photo.r2Key && photo.r2Key !== newR2Key)
				await c.env.BUCKET.delete(photo.r2Key);
			if (photo.thumbnailR2Key) await c.env.BUCKET.delete(photo.thumbnailR2Key);

			return c.json({ success: true, streamVideoUid: cfData.result.uid });
```

With:

```typescript
			await db
				.update(photoUploads)
				.set({
					streamVideoUid: cfData.result.uid,
					streamReady: false,
					cloudflareImageId: null,
					mimeType: file.type,
					fileName: file.name,
					fileSize: file.size,
				})
				.where(eq(photoUploads.id, photoId));

			return c.json({ success: true, streamVideoUid: cfData.result.uid });
```

- [ ] **Step 3: Remove `r2Key` from image DB update and R2 deletes**

In the image branch of the reupload endpoint, replace:

```typescript
		await db
			.update(photoUploads)
			.set({
				cloudflareImageId: cfData.result.id,
				streamVideoUid: null,
				r2Key: newR2Key,
				mimeType: file.type,
				fileName: file.name,
				fileSize: file.size,
			})
			.where(eq(photoUploads.id, photoId));

		// Delete old R2 objects (old key, not the new original)
		if (photo.r2Key && photo.r2Key !== newR2Key)
			await c.env.BUCKET.delete(photo.r2Key);
		if (photo.thumbnailR2Key) await c.env.BUCKET.delete(photo.thumbnailR2Key);

		return c.json({ success: true, cloudflareImageId: cfData.result.id });
```

With:

```typescript
		await db
			.update(photoUploads)
			.set({
				cloudflareImageId: cfData.result.id,
				streamVideoUid: null,
				mimeType: file.type,
				fileName: file.name,
				fileSize: file.size,
			})
			.where(eq(photoUploads.id, photoId));

		return c.json({ success: true, cloudflareImageId: cfData.result.id });
```

- [ ] **Step 4: Update endpoint comment**

Replace:

```typescript
// POST /api/gallery/reupload/:id - Re-upload a media file via CF Images/Stream (replaces R2 version)
```

With:

```typescript
// POST /api/gallery/reupload/:id - Re-upload a media file via CF Images/Stream
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 6: Format and commit**

```bash
pnpm exec biome format --write src/server.ts
git add src/server.ts
git commit -m "refactor: remove R2 from reupload endpoint

Reupload now goes directly to CF Images/Stream without R2 copy.
Old R2 objects are preserved (not deleted)."
```

---

### Task 4: Strip R2 delete from photo delete endpoint

**Files:**
- Modify: `src/server.ts` (delete endpoint `DELETE /api/photos/:id`)

- [ ] **Step 1: Remove R2 delete calls**

In the delete endpoint, remove this block:

```typescript
		// Delete from R2 (backward compat for partially migrated items)
		if (photo.r2Key) {
			await c.env.BUCKET.delete(photo.r2Key);
		}
		if (photo.thumbnailR2Key) {
			await c.env.BUCKET.delete(photo.thumbnailR2Key);
		}
```

This leaves only the CF Images and CF Stream delete calls, plus the D1 delete.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/server.ts
git commit -m "refactor: stop deleting R2 objects on photo delete

Old R2 objects are preserved. Only CF Images/Stream and DB
records are deleted."
```

---

### Task 5: Remove migration admin endpoints

**Files:**
- Modify: `src/server.ts:1383-1697` (migrate-raw and migrate-media endpoints)

- [ ] **Step 1: Delete `GET /api/admin/migrate-raw/:id` endpoint**

In `src/server.ts`, delete the entire endpoint from the comment `// Internal: serve R2 object raw (used by migration for CF Image Resizing conversion)` through its closing `});`.

- [ ] **Step 2: Delete `POST /api/admin/migrate-media` endpoint**

Delete the entire endpoint from the comment `// POST /api/admin/migrate-media - Migrate existing R2 media to CF Images/Stream` through its closing `});`.

Both are directly adjacent — they span from line ~1383 to ~1697 (before the `enable-stream-downloads` endpoint).

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors. Check that no other code references these endpoints.

- [ ] **Step 4: Remove unused imports if any**

Check if removing the migration endpoints leaves any unused imports (e.g., `isNotNull` from drizzle). If so, remove them.

Run: `npx tsc --noEmit`

- [ ] **Step 5: Format and commit**

```bash
pnpm exec biome format --write src/server.ts
git add src/server.ts
git commit -m "refactor: remove completed migration admin endpoints

migrate-raw and migrate-media are no longer needed — all media
has been migrated to CF Images/Stream."
```

---

### Task 6: Verify and push

- [ ] **Step 1: Run full type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 3: Run format check**

Run: `pnpm exec biome format --write .`
Expected: No issues.

- [ ] **Step 4: Push all commits**

```bash
git push
```
