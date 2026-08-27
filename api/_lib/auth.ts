import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { parseCookie, stringifySetCookie } from "cookie";
import type { VercelRequest } from "@vercel/node";
import { getRedis } from "./redis";

// ---------------------------------------------------------------------------
// Server-side admin auth. Unlike the earlier client-only gate, the password
// hash and session tokens live in Redis and are checked on the server for
// every write — a browser dev-tools user can no longer just flip a flag to
// get in. Sessions are opaque random tokens looked up in Redis (no JWT
// signing needed since we can afford the Redis round trip).
// ---------------------------------------------------------------------------

const PASSWORD_KEY = "admin:password_hash";
const SESSION_PREFIX = "admin:session:";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const SESSION_COOKIE_NAME = "ask_admin_session";

function hashPassword(password: string, salt = randomBytes(16).toString("hex")): string {
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

async function getOrSeedPasswordHash(): Promise<string> {
  const redis = getRedis();
  const existing = await redis.get<string>(PASSWORD_KEY);
  if (existing) return existing;
  const seeded = hashPassword(process.env.ADMIN_PASSWORD_DEFAULT || "askone2026");
  await redis.set(PASSWORD_KEY, seeded);
  return seeded;
}

export async function checkPassword(password: string): Promise<boolean> {
  const hash = await getOrSeedPasswordHash();
  return verifyPassword(password, hash);
}

export async function changePassword(current: string, next: string): Promise<boolean> {
  const ok = await checkPassword(current);
  if (!ok || !next.trim()) return false;
  await getRedis().set(PASSWORD_KEY, hashPassword(next));
  return true;
}

export async function createSession(): Promise<string> {
  const token = randomUUID();
  await getRedis().set(`${SESSION_PREFIX}${token}`, "1", { ex: SESSION_TTL_SECONDS });
  return token;
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const value = await getRedis().get(`${SESSION_PREFIX}${token}`);
  return value != null;
}

export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return;
  await getRedis().del(`${SESSION_PREFIX}${token}`);
}

export function readSessionToken(req: VercelRequest): string | undefined {
  const parsed = parseCookie(req.headers.cookie || "");
  return parsed[SESSION_COOKIE_NAME];
}

export function buildSessionCookie(token: string): string {
  return stringifySetCookie({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.VERCEL_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function buildClearCookie(): string {
  return stringifySetCookie({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.VERCEL_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
