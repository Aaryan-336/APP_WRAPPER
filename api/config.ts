import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis } from "./_lib/redis";
import { isValidSession, readSessionToken } from "./_lib/auth";

const CONFIG_KEY = "ask-one:config";

// Minimal shape validation — enough to keep obviously-malformed payloads out
// of the shared store without re-implementing the full Zod-style schema
// here. The admin UI is the real gatekeeper for well-formed data.
function isPlausibleConfig(value: unknown): value is { firms: unknown[]; applications: unknown[] } {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.firms) && Array.isArray(v.applications);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const redis = getRedis();

  if (req.method === "GET") {
    const stored = await redis.get(CONFIG_KEY);
    return res.status(200).json({ config: stored ?? null });
  }

  const authed = await isValidSession(readSessionToken(req));
  if (!authed) return res.status(401).json({ error: "Not authenticated" });

  if (req.method === "PUT" || req.method === "POST") {
    const body = req.body;
    if (!isPlausibleConfig(body)) {
      return res.status(400).json({ error: "Payload must include firms[] and applications[] arrays" });
    }
    await redis.set(CONFIG_KEY, body);
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    await redis.del(CONFIG_KEY);
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, PUT, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
