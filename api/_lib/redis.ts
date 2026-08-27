import { Redis } from "@upstash/redis";

// A single shared Upstash Redis client, reused across warm serverless
// invocations. Provision this from the Vercel dashboard: Project → Storage
// tab → Create Database → Upstash Redis. That connects an Upstash Redis
// database without a separate Upstash account/signup, and auto-injects its
// REST credentials into the project's environment variables — no manual
// copy-pasting needed. (Connecting via Upstash directly instead works
// identically; same underlying service, same env var names.)
//
// Vercel's own integration has used two different env var naming
// conventions over time (its earlier native "Vercel KV" product used
// KV_REST_API_*; the current Upstash integration uses UPSTASH_REDIS_REST_*)
// — check both so this doesn't silently break if that changes again.
let client: Redis | null = null;

export function getRedis(): Redis {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Missing Redis credentials. In Vercel: Project → Storage → Create Database → Upstash Redis (auto-injects UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).",
    );
  }
  client = new Redis({ url, token });
  return client;
}
