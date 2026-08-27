import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis } from "../_lib/redis";
import { checkPassword, createSession, buildSessionCookie } from "../_lib/auth";

const MAX_ATTEMPTS = 8;
const LOCKOUT_SECONDS = 15 * 60;

function clientIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  const ip = Array.isArray(fwd) ? fwd[0] : fwd;
  return (ip?.split(",")[0].trim()) || req.socket.remoteAddress || "unknown";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = (req.body ?? {}) as { password?: string };
  if (typeof password !== "string" || !password) {
    return res.status(400).json({ error: "Password required" });
  }

  const redis = getRedis();
  const attemptsKey = `admin:login_fail:${clientIp(req)}`;
  const attempts = (await redis.get<number>(attemptsKey)) ?? 0;
  if (attempts >= MAX_ATTEMPTS) {
    return res.status(429).json({ error: "Too many attempts. Try again later." });
  }

  const ok = await checkPassword(password);
  if (!ok) {
    await redis.set(attemptsKey, attempts + 1, { ex: LOCKOUT_SECONDS });
    return res.status(401).json({ error: "Incorrect password" });
  }

  await redis.del(attemptsKey);
  const token = await createSession();
  res.setHeader("Set-Cookie", buildSessionCookie(token));
  return res.status(200).json({ ok: true });
}
