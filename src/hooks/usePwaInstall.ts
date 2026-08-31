import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Captures the browser's `beforeinstallprompt` event (fired once per page
// load when the PWA install criteria are met) and exposes it as React state.
// The event is deferred so the app can trigger the native install dialog on
// demand via `prompt()`. The hook also tracks whether the app was installed
// in this session (the user accepted the prompt) and whether the app is
// already running in standalone/installed mode.
// ---------------------------------------------------------------------------

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

interface UsePwaInstallReturn {
  /** True when the browser has a deferred install prompt we can trigger. */
  canInstall: boolean;
  /** True after the user accepted the install prompt this session. */
  installed: boolean;
  /** True when the app is already running as an installed PWA. */
  isStandalone: boolean;
  /** Trigger the native install dialog. */
  prompt: () => Promise<void>;
  /** Dismiss the banner without installing. */
  dismiss: () => void;
}

const DISMISS_KEY = "one-ask:pwa-install-dismissed";
const DISMISS_COOLDOWN_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function usePwaInstall(): UsePwaInstallReturn {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true);

  useEffect(() => {
    // Don't show if already installed as PWA
    if (isStandalone) return;

    // Respect the dismiss cooldown
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_COOLDOWN_MS) return;
    } catch {
      // storage unavailable — proceed
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setCanInstall(false);
      deferredPrompt.current = null;
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [isStandalone]);

  const prompt = useCallback(async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setCanInstall(false);
    deferredPrompt.current = null;
  }, []);

  const dismiss = useCallback(() => {
    setCanInstall(false);
    deferredPrompt.current = null;
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // storage unavailable
    }
  }, []);

  return { canInstall, installed, isStandalone, prompt, dismiss };
}
