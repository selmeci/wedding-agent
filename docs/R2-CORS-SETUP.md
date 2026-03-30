# R2 CORS Configuration

## Overview

The `wedding-photos` R2 bucket requires CORS (Cross-Origin Resource Sharing) rules to allow browser-based uploads via presigned URLs. Without proper CORS configuration, browsers—especially Safari—will block PUT requests from the web application to the R2 bucket, causing upload failures.

This is a **manual prerequisite** that must be configured before photo/video uploads will function.

## Prerequisites

- Access to Cloudflare Dashboard with R2 Object Storage permissions
- The `wedding-photos` R2 bucket already created

## Configuration Steps

### 1. Navigate to R2 Settings

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **R2 Object Storage** from the left sidebar
3. Click on the `wedding-photos` bucket

### 2. Open CORS Configuration

1. Click the **Settings** tab at the top of the bucket page
2. Scroll down to the **CORS Policy** section

### 3. Add CORS Policy

1. Click **Add CORS policy**
2. Paste the following JSON configuration:

```json
[
  {
    "AllowedOrigins": [
      "https://ivonka-roman-forever.love",
      "http://localhost:5173",
      "http://localhost:*"
    ],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Content-Length"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 86400
  }
]
```

### 4. Save Configuration

Click **Save** to apply the CORS policy to your bucket.

## Why Each Field Matters

### AllowedOrigins
Specifies which domains are permitted to make cross-origin requests to the bucket. The configuration includes:
- `https://ivonka-roman-forever.love` - Production domain
- `http://localhost:5173` - Local development (Vite default port)
- `http://localhost:*` - Local development on any port (for flexibility)

Presigned PUT requests originating from these domains will be allowed; requests from other origins will be blocked by the browser.

### AllowedMethods
Defines which HTTP methods the bucket accepts from cross-origin requests:
- `PUT` - Required for uploading files via presigned URLs
- `HEAD` - Required for verification requests (checking if object exists)
- `GET` - Required for retrieving uploaded files

### AllowedHeaders
Specifies which request headers the bucket will accept from cross-origin requests:
- `Content-Type` - Sent with every upload to indicate file type (e.g., `image/jpeg`, `video/mp4`)
- `Content-Length` - Provides file size validation and multipart upload coordination

### ExposeHeaders
Lists which response headers the browser will allow JavaScript to read from cross-origin responses:
- `ETag` - Required for multipart upload completion. The client must read the ETag from the response headers to finalize large uploads.

### MaxAgeSeconds
Specifies how long (in seconds) browsers should cache the preflight response (OPTIONS request):
- `86400` = 24 hours
- Reduces overhead by caching CORS permissions, minimizing preflight requests for frequent uploads

## Verify Configuration

After saving, verify that CORS is correctly configured using the following command:

```bash
curl -I -X OPTIONS \
  -H "Origin: https://ivonka-roman-forever.love" \
  -H "Access-Control-Request-Method: PUT" \
  "https://<your-r2-endpoint>/wedding-photos/test"
```

Replace `<your-r2-endpoint>` with your R2 bucket's public URL (e.g., `https://wedding-photos.example.r2.dev`).

**Expected response headers:**

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://ivonka-roman-forever.love
Access-Control-Allow-Methods: GET, PUT, HEAD
Access-Control-Allow-Headers: Content-Type, Content-Length
Access-Control-Expose-Headers: ETag
Access-Control-Max-Age: 86400
```

If the `Access-Control-Allow-Origin` header is missing or doesn't match your origin, the CORS policy may not have been saved correctly. Return to step 3 and verify the configuration.

## Troubleshooting

### Uploads fail with CORS errors in browser console

- Verify the CORS policy was saved successfully (check dashboard)
- Ensure your application domain is in `AllowedOrigins`
- Clear browser cache and hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Preflight requests fail (OPTIONS returns 403)

- Confirm the CORS policy syntax is valid JSON
- Check that all required fields are present
- Ensure "AllowedMethods" includes "PUT" and "HEAD"

### Multipart uploads fail despite valid configuration

- Verify `ExposeHeaders` includes `"ETag"`
- Ensure client code reads and sends the ETag in subsequent requests

## Related Documentation

- [R2 API Documentation - CORS](https://developers.cloudflare.com/r2/api/s3/cors/)
- [Media Upload Implementation](../src/utils/media-upload.ts)
- [R2 Presigned URL Generation](../src/utils/r2-presign.ts)
