import { useNavigate } from "react-router-dom";
import type { Application } from "@/types";

/**
 * Resolves how an application should open. We never attempt to guess
 * whether an arbitrary third-party site allows framing — `embedded` mode
 * always routes through the internal app shell, which itself detects a
 * failed/blocked frame and falls back to `fallbackLaunchMode`.
 */
export function useLaunchApplication() {
  const navigate = useNavigate();

  return (app: Application) => {
    switch (app.launchMode) {
      case "embedded":
        navigate(`/launch/${app.id}`);
        return;
      case "same-window":
        window.location.assign(app.url);
        return;
      case "external":
      default:
        window.open(app.url, "_blank", "noopener,noreferrer");
        return;
    }
  };
}

export function openFallback(app: Application) {
  if (app.fallbackLaunchMode === "same-window") {
    window.location.assign(app.url);
  } else {
    window.open(app.url, "_blank", "noopener,noreferrer");
  }
}
