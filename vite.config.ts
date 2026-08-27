import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

// `/api/*` are Vercel serverless functions — real routing only happens
// under `vercel dev` (npm run dev:full) or in a real deployment. Plain
// `vite dev` doesn't know that, and by default would serve the handler's
// transpiled *source* as a 200 response to any request — including a POST
// to /api/admin/login, which would then look like a successful login for
// any password, since the handler never actually ran. Fail loudly instead.
function blockApiInPlainViteDev(): Plugin {
  return {
    name: "block-api-in-plain-vite-dev",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/api/")) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: "This endpoint only runs under `vercel dev` (npm run dev:full) or a real deployment.",
            }),
          );
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), blockApiInPlainViteDev()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
});
