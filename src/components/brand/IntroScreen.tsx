import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OneAskLogo } from "@/components/brand/OneAskLogo";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SESSION_KEY = "one-ask:intro-seen";
const AUTO_DISMISS_MS = 3100;
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
            scale: reduceMotion ? 1 : 1.08,
            filter: "blur(8px)",
            transition: { duration: reduceMotion ? 0.25 : 0.6, ease: [0.6, 0, 0.2, 1] },
          }}
        >
          {/* Light-burst hand-off, fires only on exit */}
          {!reduceMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  "radial-gradient(38% 32% at 50% 46%, rgba(246,248,249,0.9) 0%, rgba(212,175,106,0.4) 38%, transparent 72%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            />
          )}

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
                  background: "radial-gradient(45% 40% at 50% 45%, rgba(212,175,106,0.16), transparent 70%)",
                }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {!reduceMotion && (
              <motion.div
                className="absolute left-1/2 top-1/2 h-[900px] w-[900px] opacity-40"
                style={{
                  marginLeft: -450,
                  marginTop: -450,
                  borderRadius: "50%",
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(212,175,106,0.16) 12%, transparent 24%, transparent 50%, rgba(79,214,202,0.12) 62%, transparent 74%, transparent 100%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
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

          {/* Logo + wordmark */}
          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative mb-7 flex items-center justify-center">
              {/* one-shot sonar rings from the icon */}
              {!reduceMotion &&
                [0, 1].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute rounded-[26%] border border-gold-400/40"
                    style={{ width: 96, height: 96 }}
                    initial={{ opacity: 0.55, scale: 1 }}
                    animate={{ opacity: 0, scale: 2.1 }}
                    transition={{ duration: 1.3, delay: 0.15 + i * 0.22, ease: "easeOut" }}
                  />
                ))}
              <motion.div
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.55, filter: "blur(10px)" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: [
                    "blur(0px) drop-shadow(0 0 0px rgba(212,175,106,0))",
                    "blur(0px) drop-shadow(0 0 34px rgba(212,175,106,0.4))",
                  ],
                }}
                transition={{
                  duration: reduceMotion ? 0.3 : 0.75,
                  ease: [0.16, 1, 0.3, 1],
                  filter: { duration: 1.4, delay: 0.15 },
                }}
              >
                <OneAskLogo variant="icon" size="xl" />
              </motion.div>
            </div>

            <div className="flex flex-col items-center overflow-hidden">
              <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                <motion.span
                  className="text-gradient-gold relative inline-block"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 28, filter: reduceMotion ? "blur(0px)" : "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: reduceMotion ? 0.25 : 0.6, delay: reduceMotion ? 0.05 : 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  ONE
                  {!reduceMotion && (
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 skew-x-[-18deg]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
                        mixBlendMode: "overlay",
                      }}
                      initial={{ x: "-140%", opacity: 0 }}
                      animate={{ x: "340%", opacity: [0, 1, 0] }}
                      transition={{ duration: 1.1, delay: 1.15, ease: "easeInOut" }}
                    />
                  )}
                </motion.span>{" "}
                <motion.span
                  className="inline-block text-silver-100"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 28, filter: reduceMotion ? "blur(0px)" : "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: reduceMotion ? 0.25 : 0.6, delay: reduceMotion ? 0.1 : 0.72, ease: [0.16, 1, 0.3, 1] }}
                >
                  ASK
                </motion.span>
              </h1>

              <motion.span
                className="mt-3 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent"
                style={{ width: "72%" }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.8 }}
                transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0.15 : 1.15, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduceMotion ? 0.2 : 1.35, ease: "easeOut" }}
              className="mt-5 text-xs font-medium uppercase tracking-[0.38em] text-silver-400 sm:text-sm"
            >
              One stop solution <span className="text-gold-400">for all your tools</span>
            </motion.p>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0.3 : 1.7 }}
            className="absolute bottom-9 text-[11px] tracking-[0.2em] text-silver-500"
          >
            TAP TO CONTINUE
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
