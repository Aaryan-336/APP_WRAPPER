import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isValidSession, readSessionToken, changePassword } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const authed = await isValidSession(readSessionToken(req));
  if (!authed) return res.status(401).json({ error: "Not authenticated" });

  const { current, next } = (req.body ?? {}) as { current?: string; next?: string };
  if (typeof current !== "string" || typeof next !== "string" || !next.trim()) {
    return res.status(400).json({ error: "Current and new password required" });
  }

  const ok = await changePassword(current, next);
  if (!ok) return res.status(401).json({ error: "Current password is incorrect" });
  return res.status(200).json({ ok: true });
}
