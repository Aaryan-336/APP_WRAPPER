import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import "@/index.css";
import App from "@/App";
import { ConfigProvider } from "@/state/ConfigStore";
import { ThemeProvider } from "@/state/ThemeContext";
import { AdminAuthProvider } from "@/state/AdminAuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* reducedMotion="user" makes every framer-motion animation in the app
          — not just the manually-gated intro sequence — automatically fall
          back to simple opacity crossfades when the OS-level
          prefers-reduced-motion setting is on. */}
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <ConfigProvider>
            <AdminAuthProvider>
              <App />
            </AdminAuthProvider>
          </ConfigProvider>
        </ThemeProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // registration failure should never block the app
    });
  });
}
