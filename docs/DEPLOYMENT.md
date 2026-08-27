# Deployment

ASK ONE is a Vite/React SPA with a small serverless backend (`/api`) that
stores the shared configuration (firms, applications, admin password) in
Upstash Redis. Every visitor reads the same config; Admin writes publish it
for everyone.

## 1. Create a Redis database (via Vercel, no separate account)

1. In your Vercel project → **Storage** tab → **Create Database** → **Upstash
   Redis** (marketplace integration). This provisions an Upstash Redis
   database under your Vercel account — no separate Upstash signup — and
   automatically injects its REST credentials
   (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) into your
   project's environment variables.
2. That's it for this step — nothing to copy-paste manually.

   (Creating the database directly at [upstash.com](https://upstash.com)
   instead works identically — same underlying service, same env var names
   — if you'd rather manage it outside Vercel. `api/_lib/redis.ts` also
   accepts the older `KV_REST_API_URL`/`KV_REST_API_TOKEN` names as a
   fallback, in case Vercel's integration naming changes again.)

## 2. Set the remaining environment variable

In Vercel: Project Settings → Environment Variables, add for
Production/Preview/Development as needed:

| Variable                | Value                                          |
| ------------------------ | ----------------------------------------------- |
| `ADMIN_PASSWORD_DEFAULT` | any password — only used the very first time `/api/admin/login` runs against an empty database. Change it from Admin → Overview after logging in once. |

The two `UPSTASH_REDIS_REST_*` variables are already set from step 1. See
`.env.example` for the full list, for local dev.

## 3. Deploy

1. Push this repo to GitHub.
2. Import it into Vercel — it auto-detects the Vite build (`npm run build`,
   output `dist`) and the `/api/*.ts` files as serverless functions.
3. `vercel.json` already routes all non-`/api` paths to `index.html` so
   client-side routing (React Router) works on refresh/direct links.
4. Deploy. First visitor to hit `/admin` and log in seeds the password hash
   in Redis from `ADMIN_PASSWORD_DEFAULT`.

Custom domain: add it in Vercel → Domains, point your DNS at it. HTTPS is
automatic — the service worker and admin session cookie both require it in
production (`Secure` cookie flag is only set when `VERCEL_ENV=production`).

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
  local `.env.local` (copy `.env.example`) with real Upstash credentials.

Use `dev:full` for anything touching Admin, login, or saved configuration.

## Known limitations, on purpose for now

- **Logos are stored inline.** Uploaded firm/app logos are resized to a
  small WEBP and stored as a base64 data URI directly inside the shared
  config JSON blob in Redis. Fine for a handful of small logos; if you end
  up with many large images, consider moving to Vercel Blob (or similar
  object storage) and storing URLs instead of inline data.
- **Login rate limiting is basic.** `/api/admin/login` blocks an IP after 8
  failed attempts for 15 minutes, tracked in Redis. Adequate for an
  internal tool, not hardened against a distributed attack.
- **One shared admin password**, not per-person accounts. Anyone with the
  password has full write access to the shared config. If you need
  per-person accounts/audit trail later, that's a bigger addition (real
  user auth) beyond this password gate.
