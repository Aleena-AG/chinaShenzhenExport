# Getting the 360° / 3D model to show

If the 360° tab shows **"Failed to load 3D model"** or **"Open in new tab"**, the app is working but the **model URL** from your API is not returning a valid `.glb` file in a way the app can use. Here’s what you can do.

---

## Option 1: Use “Open in new tab” (no backend change)

- Users can click **“Open 3D model in new tab”** in the 360° tab.
- The browser will open the `video_url` (e.g. your Cloudinary link).
- They can download the file or view it in a tool that supports `.glb` (e.g. Windows 3D Viewer, online viewers).

No backend or Cloudinary changes needed.

---

## Option 2: Fix the URL so the embed works (backend / Cloudinary)

For the **in-page 3D viewer** to load the model, the `video_url` must:

1. **Return the real .glb file**  
   - When you open the URL in a browser, it should **download** the file or show binary data.  
   - If you see an **HTML page** (login, error, or dashboard), the URL is not serving the file.

2. **Be publicly readable**  
   - No login or token required to GET the URL.  
   - If the link is signed, it must be valid and not expired when the user opens the product page.

3. **Prefer “raw” or “unauthenticated” on Cloudinary**  
   - Upload the `.glb` as **Resource type: Raw** (or equivalent), not as an image.  
   - Use a **public** URL that serves the file directly (e.g. `https://res.cloudinary.com/.../raw/upload/.../file.glb`).  
   - Avoid URLs that go through “image” upload and transformation if they return HTML or a different format.

4. **Backend / API**  
   - Ensure `video_url` in the product API is exactly the URL that returns the `.glb` file (the same URL you’d use to download the model in a browser).

After the URL returns the actual `.glb` file when opened in a browser, the 360° tab should load it automatically (the app already uses a proxy to avoid CORS).

---

## Option 3: Host the .glb on your own server

If you control a server or static hosting:

- Put the `.glb` file on your server (e.g. `/public/models/product.glb` or a static bucket).
- Set `video_url` to that URL (e.g. `https://yoursite.com/models/product.glb`).
- Ensure the server responds with **Content-Type**: `model/gltf-binary` or `application/octet-stream` and allows GET requests.

Then the in-page viewer should work without Cloudinary.

---

## Quick checklist

- [ ] Open `video_url` in a new browser tab. Does it download a file or show binary? (If you see HTML, fix the URL first.)
- [ ] In Cloudinary: is the resource type **Raw** (or similar) and the URL public?
- [ ] Does your API return exactly that public, direct-to-file URL in `video_url`?

If all are yes and the 360° tab still fails, check the browser **Network** tab for the request to `/api/proxy-model?url=...` and note the status code and response type (binary vs JSON/HTML).
