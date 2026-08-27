import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  checkPassword,
  createSessionToken,
  buildSessionCookie,
  isLockedOut,
  recordLoginFailure,
  clearLoginFailures,
} from "../_lib/auth.js";

function clientIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  const ip = Array.isArray(fwd) ? fwd[0] : fwd;
  return ip?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = (req.body ?? {}) as { password?: string };
  if (typeof password !== "string" || !password) {
    return res.status(400).json({ error: "Password required" });
  }

  const ip = clientIp(req);
  if (isLockedOut(ip)) {
    return res.status(429).json({ error: "Too many attempts. Try again later." });
  }

  let ok: boolean;
  try {
    ok = checkPassword(password);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Server misconfigured" });
  }

  if (!ok) {
    recordLoginFailure(ip);
    return res.status(401).json({ error: "Incorrect password" });
  }

  clearLoginFailures(ip);
  res.setHeader("Set-Cookie", buildSessionCookie(createSessionToken()));
  return res.status(200).json({ ok: true });
}
