import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Maximize2, Minimize2, RotateCcw, TriangleAlert } from "lucide-react";
import { useConfig } from "@/state/ConfigStore";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { accentOf } from "@/lib/accent";
import { openFallback } from "@/lib/launch";

const BLOCKED_TIMEOUT_MS = 4500;

export function LaunchPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { config } = useConfig();
  const app = config.applications.find((a) => a.id === appId);
  const firm = app ? config.firms.find((f) => f.id === app.firmId) : undefined;

  const [status, setStatus] = useState<"loading" | "loaded" | "blocked">("loading");
  const [fullscreen, setFullscreen] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setStatus("loading");
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setStatus((s) => (s === "loading" ? "blocked" : s));
    }, BLOCKED_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [attempt, appId]);

  if (!app || !firm) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-silver-300">This application could not be found.</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Go back
        </Button>
      </div>
    );
  }

  const accent = accentOf(app);

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-[70] flex flex-col bg-navy-950"
          : "flex h-[calc(100dvh-64px)] flex-col md:h-[calc(100dvh-72px)]"
      }
    >
      <div
        className="flex items-center justify-between gap-3 border-b border-overlay/[0.06] bg-navy-900/70 px-3 py-2.5 backdrop-blur-xl md:px-5"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft size={18} />
          </Button>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg"
            style={{ background: accent.soft, color: accent.primary }}
          >
            <AppIcon icon={app.icon} logoUrl={app.logoUrl} name={app.name} size={16} />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-silver-100">{app.name}</p>
            <p className="truncate text-[11px] text-silver-500">{firm.shortName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={() => setAttempt((n) => n + 1)} aria-label="Reload">
            <RotateCcw size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open(app.url, "_blank", "noopener,noreferrer")}
            aria-label="Open in new tab"
          >
            <ExternalLink size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setFullscreen((f) => !f)} aria-label="Toggle fullscreen">
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>

      <div className="relative flex-1 bg-navy-900/40">
        {status !== "blocked" && (
          <iframe
            key={attempt}
            src={app.url}
            title={app.name}
            className="h-full w-full border-0"
            onLoad={() => setStatus("loaded")}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}

        {status === "loading" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-10 w-10 rounded-full border-2 border-overlay/15"
              style={{ borderTopColor: accent.primary }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {status === "blocked" && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: accent.soft, color: accent.primary }}
            >
              <TriangleAlert size={26} />
            </div>
            <div className="max-w-sm space-y-1.5">
              <p className="font-display text-lg font-medium text-silver-100">{app.name} can't be embedded here</p>
              <p className="text-sm text-silver-400">
                This destination doesn't allow itself to be displayed inside another app. Continue in a new tab or
                this window instead.
              </p>
            </div>
            <div className="flex gap-2.5 pt-1">
              <Button variant="secondary" onClick={() => openFallback(app)}>
                {app.fallbackLaunchMode === "same-window" ? "Continue here" : "Open in new tab"}
              </Button>
              <Button variant="outline" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
