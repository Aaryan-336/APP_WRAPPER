import { AnimatePresence, motion } from "motion/react";
import { Download, X, CheckCircle2 } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Floating PWA install banner. Slides up from the bottom when the browser
// signals the app is installable (via `beforeinstallprompt`). Stays out of
// the way of the main UI and auto-dismisses after a successful install.
//
// • Won't appear if the app is already running in standalone mode.
// • Respects a 7-day dismiss cooldown (persisted in localStorage).
// • Shows a brief "Installed!" confirmation before auto-hiding.
// ---------------------------------------------------------------------------

export function PwaInstallPrompt() {
  const { canInstall, installed, prompt, dismiss } = usePwaInstall();

  return (
    <AnimatePresence>
      {(canInstall || installed) && (
        <motion.div
          initial={{ opacity: 0, y: 72, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-4 right-4 z-[60] mx-auto max-w-md sm:left-auto sm:right-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-overlay/[0.08] bg-navy-900/95 shadow-2xl shadow-black/50 backdrop-blur-2xl">
            {/* Decorative top gradient bar */}
            <div
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-gold-400), var(--color-teal-400))",
              }}
            />

            {installed ? (
              /* ── Success state ─────────────────────────────── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-5 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-400/10 text-teal-400">
                  <CheckCircle2 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-silver-100">
                    ASK ONE installed!
                  </p>
                  <p className="text-xs text-silver-400">
                    Find it on your home screen.
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ── Install prompt state ──────────────────────── */
              <div className="flex items-start gap-3.5 px-5 py-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
                  <Download size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-silver-100">
                    Install ASK ONE
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-silver-400">
                    Add to your home screen for instant access &amp; offline
                    support.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" onClick={prompt} className="rounded-full">
                      <Download size={13} />
                      Install
                    </Button>
                    <button
                      onClick={dismiss}
                      className="focus-ring rounded-full px-3 py-1.5 text-xs font-medium text-silver-400 transition-colors hover:bg-overlay/8 hover:text-silver-200"
                    >
                      Not now
                    </button>
                  </div>
                </div>
                <button
                  onClick={dismiss}
                  aria-label="Dismiss install prompt"
                  className="focus-ring -mr-1 -mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-silver-500 transition-colors hover:bg-overlay/8 hover:text-silver-300"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
