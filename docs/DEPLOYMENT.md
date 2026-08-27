# Deployment

ASK ONE is a Vite/React SPA with a small serverless backend (`/api`).

- **Auth has no database.** The admin password lives in the `ADMIN_PASSWORD`
  env var and is checked directly on each login; sessions are a stateless
  signed cookie (HMAC, verified with no lookup). Nothing auth-related is
  stored anywhere.
- **Shared config (firms/applications) uses localStorage**, seeded from the
  bundled default in `src/data/config.ts`. Admin edits persist in the
  current browser. To publish a configuration for every visitor, use the
  Admin Export action to download a ready-to-use `src/data/config.ts`,
  commit it, and redeploy.

## 1. Set the auth environment variables

In Vercel: Project Settings → Environment Variables, add for
Production/Preview/Development as needed:

| Variable         | Value                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `ADMIN_PASSWORD`  | whatever you want the admin password to be.                           |
| `SESSION_SECRET`  | any long random string — e.g. `openssl rand -hex 32`. Signs session cookies; changing it invalidates all logged-in sessions. |

To rotate the password later: change `ADMIN_PASSWORD` and redeploy. There's
no in-app "change password" form — there's nowhere for it to persist to
without a database, which is the whole point of keeping auth
database-free.

## 2. Deploy

1. Push this repo to GitHub.
2. Import it into Vercel — it auto-detects the Vite build (`npm run build`,
   output `dist`) and the `/api/*.ts` files as serverless functions.
3. `vercel.json` already routes all non-`/api` paths to `index.html` so
   client-side routing (React Router) works on refresh/direct links.
4. Deploy, then log into `/admin` with `ADMIN_PASSWORD`.

Custom domain: add it in Vercel → Domains, point your DNS at it. HTTPS is
automatic — the admin session cookie's `Secure` flag is only set when
`VERCEL_ENV=production`, so it still works over local `http://localhost`.

## Local development

Two modes, pick based on what you're doing:

- **`npm run dev`** — plain Vite, frontend only. Fast iteration on UI/motion
  work. Requests to `/api/*` return a `404` on purpose (see
  `vite.config.ts`) rather than silently doing nothing — this used to be a
  real footgun (Vite would serve the handler's *source code* as a 200
  response, which made admin login *appear* to succeed with any password
  since the real handler never ran).
- **`npm run dev:full`** — runs `vercel dev`, which serves the frontend
  *and* actually executes the `/api/*` functions locally, matching
  production. Requires the Vercel CLI to be logged in
  (`npx vercel login`) and either `vercel link` + `vercel env pull`, or a
  local `.env.local` (copy `.env.example`) with `ADMIN_PASSWORD` and
  `SESSION_SECRET`.

Use `dev:full` for anything touching Admin or login.

## Known limitations, on purpose for now

- **Login rate limiting is in-memory, not bulletproof.** `/api/admin/login`
  blocks an IP after 8 failed attempts for 15 minutes, tracked in a
  module-scoped `Map`. That resets on a cold start and doesn't coordinate
  across concurrent function instances — a real deterrent against casual
  scripted brute-forcing, not a hard guarantee.
- **One shared admin password**, not per-person accounts. Anyone with the
  password has full write access to the shared config. If you need
  per-person accounts/audit trail later, that's a bigger addition (real
  user auth) beyond this password gate.
- **Logos are stored inline.** Uploaded firm/app logos are resized to a
  small WEBP and stored as a base64 data URI directly inside the config
  JSON blob in localStorage. Fine for a handful of small logos; if you end
  up with many large images, consider moving to Vercel Blob (or similar
  object storage) and storing URLs instead of inline data.
