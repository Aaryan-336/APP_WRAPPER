import { createHmac, timingSafeEqual } from "node:crypto";
import { parseCookie, stringifySetCookie } from "cookie";
import type { VercelRequest } from "@vercel/node";

// ---------------------------------------------------------------------------
// Server-side admin auth — no database dependency. The password lives in the
// ADMIN_PASSWORD environment variable (change it in Vercel and redeploy;
// there's no in-app "change password" flow anymore, since there's nowhere
// for it to persist to without a store). Sessions are stateless: a cookie
// carrying an expiry timestamp plus an HMAC signature over that timestamp,
// verified on each request with no lookup. Shared config (firms,
// applications) is stored client-side in localStorage, seeded from the
// bundled default in src/data/config.ts — no database involved anywhere.
// ---------------------------------------------------------------------------

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
export const SESSION_COOKIE_NAME = "ask_admin_session";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "Missing SESSION_SECRET. Set it to any long random string in your environment variables (used to sign admin session cookies).",
    );
  }
  return secret;
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("Missing ADMIN_PASSWORD environment variable.");
  }
  return timingSafeStringEqual(password.trim(), expected.trim());
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!timingSafeStringEqual(sign(payload), signature)) return false;
  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
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
    maxAge: SESSION_TTL_MS / 1000,
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

// ---------------------------------------------------------------------------
// Best-effort login rate limiting. In-memory, module-scoped: it works within
// a single warm serverless instance but resets on cold start and doesn't
// coordinate across concurrent instances — a real deterrent against casual
// scripted brute-forcing, not a hard guarantee. A persistent store (e.g.
// Redis) would be stronger but adds an external dependency this setup
// deliberately avoids.
// ---------------------------------------------------------------------------

const MAX_ATTEMPTS = 8;
const LOCKOUT_MS = 15 * 60 * 1000;
const failuresByIp = new Map<string, { count: number; lockedUntil: number }>();

export function isLockedOut(ip: string): boolean {
  const entry = failuresByIp.get(ip);
  if (!entry) return false;
  if (entry.lockedUntil && entry.lockedUntil < Date.now()) {
    failuresByIp.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordLoginFailure(ip: string): void {
  const entry = failuresByIp.get(ip) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) entry.lockedUntil = Date.now() + LOCKOUT_MS;
  failuresByIp.set(ip, entry);
}

export function clearLoginFailures(ip: string): void {
  failuresByIp.delete(ip);
}
