import path from "node:path";
import { createHmac, timingSafeEqual } from "node:crypto";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { parseCookie, stringifySetCookie } from "cookie";

// Local development middleware for Vite (`npm run dev`).
// Handles /api/admin/* endpoints locally so that logging in works out of the box
// during development without requiring `vercel dev`.
function devAdminApiPlugin(): Plugin {
  return {
    name: "dev-admin-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/admin/")) {
          return next();
        }

        const env = loadEnv("development", process.cwd(), "");
        const adminPassword = (env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "oneask2026").trim();
        const sessionSecret = (env.SESSION_SECRET || process.env.SESSION_SECRET || "dev-secret-one-ask-2026-local").trim();

        const sendJson = (status: number, data: unknown, headers?: Record<string, string>) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          if (headers) {
            for (const [k, v] of Object.entries(headers)) {
              res.setHeader(k, v);
            }
          }
          res.end(JSON.stringify(data));
        };

        const cookieName = "ask_admin_session";
        const sign = (payload: string) => createHmac("sha256", sessionSecret).update(payload).digest("hex");

        const verifyToken = (token: string | undefined) => {
          if (!token) return false;
          const [payload, signature] = token.split(".");
          if (!payload || !signature) return false;
          const expectedSig = sign(payload);
          if (Buffer.from(expectedSig).length !== Buffer.from(signature).length) return false;
          if (!timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature))) return false;
          const expiresAt = Number(payload);
          return Number.isFinite(expiresAt) && expiresAt > Date.now();
        };

        if (req.url === "/api/admin/session" && req.method === "GET") {
          const cookies = parseCookie(req.headers.cookie || "");
          const token = cookies[cookieName];
          return sendJson(200, { unlocked: verifyToken(token) });
        }

        if (req.url === "/api/admin/logout" && req.method === "POST") {
          const clearCookie = stringifySetCookie({
            name: cookieName,
            value: "",
            httpOnly: true,
            path: "/",
            maxAge: 0,
          });
          return sendJson(200, { ok: true }, { "Set-Cookie": clearCookie });
        }

        if (req.url === "/api/admin/login" && req.method === "POST") {
          let bodyStr = "";
          req.on("data", (chunk) => {
            bodyStr += chunk;
          });
          req.on("end", () => {
            try {
              const body = JSON.parse(bodyStr || "{}");
              const password = (body.password || "").trim();
              if (!password) {
                return sendJson(400, { error: "Password required" });
              }

              const bufA = Buffer.from(password);
              const bufB = Buffer.from(adminPassword);
              const matches = bufA.length === bufB.length && timingSafeEqual(bufA, bufB);

              if (!matches) {
                return sendJson(401, { error: "Incorrect password" });
              }

              const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;
              const payload = String(expiresAt);
              const token = `${payload}.${sign(payload)}`;
              const cookie = stringifySetCookie({
                name: cookieName,
                value: token,
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
              });

              return sendJson(200, { ok: true }, { "Set-Cookie": cookie });
            } catch {
              return sendJson(400, { error: "Invalid request body" });
            }
          });
          return;
        }

        if (req.url === "/api/config") {
          if (req.method === "GET") {
            return sendJson(200, { config: (globalThis as unknown as { __devConfig?: unknown }).__devConfig ?? null });
          }

          const cookies = parseCookie(req.headers.cookie || "");
          const token = cookies[cookieName];
          if (!verifyToken(token)) {
            return sendJson(401, { error: "Not authenticated" });
          }

          if (req.method === "PUT" || req.method === "POST") {
            let bodyStr = "";
            req.on("data", (chunk) => {
              bodyStr += chunk;
            });
            req.on("end", () => {
              try {
                const body = JSON.parse(bodyStr || "{}");
                (globalThis as unknown as { __devConfig?: unknown }).__devConfig = body;
                return sendJson(200, { ok: true });
              } catch {
                return sendJson(400, { error: "Invalid request body" });
              }
            });
            return;
          }

          if (req.method === "DELETE") {
            (globalThis as unknown as { __devConfig?: unknown }).__devConfig = null;
            return sendJson(200, { ok: true });
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devAdminApiPlugin()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
});
