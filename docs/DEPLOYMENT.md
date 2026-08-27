# Deployment

ASK ONE is a Vite/React SPA with a small serverless backend (`/api`).

- **Auth has no database.** The admin password lives in the `ADMIN_PASSWORD`
  env var and is checked directly on each login; sessions are a stateless
  signed cookie (HMAC, verified with no lookup). Nothing auth-related is
  stored anywhere.
- **Shared config (firms/applications) persists across all devices via Vercel Blob.**
  When an admin saves changes, the configuration is synced to Vercel Blob storage,
  ensuring all visitors and devices see the exact same tools and firms in real time.
  Devices also cache it in `localStorage` for offline support.

## 1. Set the auth environment variables

In Vercel: Project Settings → Environment Variables, add for
Production/Preview/Development:

| Variable         | Value                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `ADMIN_PASSWORD`  | whatever you want the admin password to be.                           |
| `SESSION_SECRET`  | any long random string — e.g. `openssl rand -hex 32`. Signs session cookies. |

## 2. Enable Vercel Blob (for shared multi-device config)

1. In your Vercel Dashboard, go to your project → **Storage** tab.
2. Click **Create Database** (or **Add Storage**) → choose **Blob**.
3. Click **Continue** / **Create**. This automatically creates the Blob store and connects the `BLOB_READ_WRITE_TOKEN` environment variable to your project.
4. Redeploy (or trigger a new deploy) so the environment variable takes effect.

## 3. Deploy

1. Push this repo to GitHub.
2. Import it into Vercel — it auto-detects the Vite build (`npm run build`,
   output `dist`) and the `/api/*.ts` files as serverless functions.
3. `vercel.json` already routes all non-`/api` paths to `index.html` so
   client-side routing (React Router) works on refresh/direct links.
4. Deploy, then log into `/admin` with `ADMIN_PASSWORD`.

## Local development

- **`npm run dev`** — runs Vite with full local admin and config API support.
  Local edits and login work out-of-the-box using the `.env` settings.
