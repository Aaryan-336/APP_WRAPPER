import type { VercelRequest, VercelResponse } from "@vercel/node";
import { destroySession, readSessionToken, buildClearCookie } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  await destroySession(readSessionToken(req));
  res.setHeader("Set-Cookie", buildClearCookie());
  return res.status(200).json({ ok: true });
}
