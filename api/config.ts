import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, list, del } from "@vercel/blob";
import { isValidSessionToken, readSessionToken } from "./_lib/auth.js";

const BLOB_PATH = "ask-one/config.json";

function isPlausibleConfig(value: unknown): value is { firms: unknown[]; applications: unknown[] } {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.firms) && Array.isArray(v.applications);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow cross-device retrieval of current config
  if (req.method === "GET") {
    try {
      const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        if (response.ok) {
          const data = await response.json();
          return res.status(200).json({ config: data });
        }
      }
      return res.status(200).json({ config: null });
    } catch (err) {
      console.error("Failed to read config from Vercel Blob:", err);
      return res.status(200).json({ config: null });
    }
  }

  // Admin auth check for mutations
  const authed = isValidSessionToken(readSessionToken(req));
  if (!authed) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (req.method === "PUT" || req.method === "POST") {
    const body = req.body;
    if (!isPlausibleConfig(body)) {
      return res.status(400).json({ error: "Payload must include firms[] and applications[] arrays" });
    }
    try {
      // Overwrite existing config blob
      await put(BLOB_PATH, JSON.stringify(body), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Failed to save config to Vercel Blob:", err);
      const msg = err instanceof Error ? err.message : "Failed to persist configuration to Vercel Blob";
      return res.status(500).json({ error: msg });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { blobs } = await list({ prefix: BLOB_PATH });
      if (blobs.length > 0) {
        await del(blobs.map((b) => b.url));
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Failed to delete config from Vercel Blob:", err);
      const msg = err instanceof Error ? err.message : "Failed to reset configuration";
      return res.status(500).json({ error: msg });
    }
  }

  res.setHeader("Allow", "GET, PUT, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
