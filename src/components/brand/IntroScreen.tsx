import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AskOneLogo } from "@/components/brand/AskOneLogo";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SESSION_KEY = "ask-one:intro-seen";
const AUTO_DISMISS_MS = 2600;
const AUTO_DISMISS_REDUCED_MS = 900;

interface IntroScreenProps {
  onDone: () => void;
}

export function IntroScreen({ onDone }: IntroScreenProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const already = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY);
    if (already) {
      setVisible(false);
      onDone();
      return;
    }
    const dismissAfter = reduceMotion ? AUTO_DISMISS_REDUCED_MS : AUTO_DISMISS_MS;
    const t = window.setTimeout(() => setExiting(true), dismissAfter);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExitComplete = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
    onDone();
  };

  const skip = () => setExiting(true);

  if (!visible) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-navy-950"
          role="button"
          tabIndex={0}
          aria-label="Skip intro"
          onClick={skip}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && skip()}
          exit={{
            opacity: 0,
            scale: reduceMotion ? 1 : 1.06,
            filter: "blur(6px)",
            transition: { duration: reduceMotion ? 0.25 : 0.55, ease: [0.6, 0, 0.2, 1] },
          }}
        >
          {/* Ambient background */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(80% 60% at 50% 38%, rgba(28,68,80,0.55) 0%, transparent 60%), radial-gradient(60% 50% at 78% 78%, rgba(212,175,106,0.14) 0%, transparent 65%), radial-gradient(50% 45% at 15% 80%, rgba(79,214,202,0.10) 0%, transparent 65%)",
              }}
            />
            {!reduceMotion && (
              <motion.div
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(45% 40% at 50% 45%, rgba(212,175,106,0.16), transparent 70%)",
                }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {/* concentric rings echoing the brand mark */}
            {[420, 320, 220].map((d, i) => (
              <motion.div
                key={d}
                className="absolute left-1/2 top-1/2 rounded-full border border-overlay/[0.06]"
                style={{ width: d * 2.4, height: d * 2.4, marginLeft: -(d * 1.2), marginTop: -(d * 1.2) }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, delay: reduceMotion ? 0 : 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
          </div>

          {/* Logo + tagline */}
          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0.3 : 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ filter: "drop-shadow(0 0 0px rgba(212,175,106,0))" }}
              animate={{ filter: "drop-shadow(0 0 34px rgba(212,175,106,0.35))" }}
              transition={{ duration: 1.4, delay: 0.2 }}
            >
              <AskOneLogo variant="icon" size="xl" className="mb-7" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduceMotion ? 0.05 : 0.35, ease: "easeOut" }}
            >
              <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                <span className="text-silver-100">ASK</span>{" "}
                <span className="text-gradient-gold">ONE</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduceMotion ? 0.1 : 0.55, ease: "easeOut" }}
              className="mt-5 text-xs font-medium uppercase tracking-[0.38em] text-silver-400 sm:text-sm"
            >
              One stop solution <span className="text-gold-400">for all your tools</span>
            </motion.p>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="absolute bottom-9 text-[11px] tracking-[0.2em] text-silver-500"
          >
            TAP TO CONTINUE
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
