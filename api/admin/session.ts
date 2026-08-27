import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isValidSession, readSessionToken } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const unlocked = await isValidSession(readSessionToken(req));
  return res.status(200).json({ unlocked });
}
