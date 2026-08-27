import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, CornerDownLeft, Command } from "lucide-react";
import { useConfig } from "@/state/ConfigStore";
import { searchApplications } from "@/lib/search";
import { useLaunchApplication } from "@/lib/launch";
import { AppIcon } from "@/components/ui/app-icon";
import { accentOf } from "@/lib/accent";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { config } = useConfig();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const launch = useLaunchApplication();

  const results = useMemo(() => searchApplications(config, query), [config, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const select = (idx: number) => {
    const r = results[idx];
    if (!r) return;
    onClose();
    launch(r.app);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(activeIndex);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search applications"
            className="glass-panel relative w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl shadow-black/50"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-overlay/[0.06] px-4 py-3.5">
              <Search size={17} className="text-silver-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search apps, firms, tags…"
                className="flex-1 bg-transparent text-[15px] text-silver-100 outline-none placeholder:text-silver-500"
              />
              <kbd className="hidden items-center gap-1 rounded-md border border-overlay/10 px-1.5 py-0.5 text-[10px] text-silver-500 sm:flex">
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!query && (
                <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-silver-500">Featured</p>
              )}
              {results.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-silver-500">No applications match “{query}”.</div>
              )}
              {results.map((r, idx) => {
                const accent = accentOf(r.app);
                return (
                  <button
                    key={r.app.id}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => select(idx)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      idx === activeIndex ? "bg-overlay/[0.07]" : "hover:bg-overlay/[0.04]"
                    }`}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                      style={{ background: accent.soft, color: accent.primary }}
                    >
                      <AppIcon icon={r.app.icon} logoUrl={r.app.logoUrl} name={r.app.name} size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-silver-100">{r.app.name}</p>
                      <p className="truncate text-xs text-silver-500">{r.firmName}</p>
                    </div>
                    {idx === activeIndex && <CornerDownLeft size={14} className="shrink-0 text-silver-500" />}
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center justify-between border-t border-overlay/[0.06] px-4 py-2.5 text-[11px] text-silver-500 sm:flex">
              <span className="flex items-center gap-1.5">
                <Command size={11} />K to toggle
              </span>
              <span>↑↓ navigate · ↵ open</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
