import { motion } from "motion/react";
import { ArrowLeft, LayoutGrid, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import type { Firm } from "@/types";
import { accentOf } from "@/lib/accent";
import { useActiveFirms, useApplicationsForFirm } from "@/state/ConfigStore";
import { ApplicationMasonry } from "@/components/workspace/ApplicationMasonry";
import { MobileApplicationGrid } from "@/components/workspace/MobileApplicationGrid";

interface FirmWorkspaceProps {
  firm: Firm;
  onBack: () => void;
  onSwitchFirm: (firm: Firm) => void;
}

export function FirmWorkspace({ firm, onBack, onSwitchFirm }: FirmWorkspaceProps) {
  const accent = accentOf(firm);
  const applications = useApplicationsForFirm(firm.id);
  const firms = useActiveFirms();
  const otherFirms = firms.filter((f) => f.id !== firm.id);
  const [query, setQuery] = useState("");

  const filteredApps = useMemo(() => {
    if (!query.trim()) return applications;
    const q = query.toLowerCase();
    return applications.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.aliases.some((al) => al.toLowerCase().includes(q)),
    );
  }, [applications, query]);

  const showFilter = applications.length > 8;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mx-auto max-w-[1400px] px-4 pb-20 pt-6 md:px-8 md:pt-10"
    >
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="focus-ring mb-6 flex items-center gap-1.5 rounded-lg text-xs font-medium text-silver-500 transition-colors hover:text-silver-200"
      >
        <ArrowLeft size={14} /> All firms
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-10 overflow-hidden rounded-[28px] border border-overlay/[0.07] p-6 sm:p-8 md:mb-12"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab, ${accent.primary} 12%, var(--color-navy-900)) 0%, var(--color-navy-900) 55%, var(--color-navy-950) 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: accent.primary }}
        />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            {firm.logoUrl ? (
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-navy-800 sm:h-16 sm:w-16">
                <img src={firm.logoUrl} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-display font-semibold sm:h-16 sm:w-16 sm:text-xl"
                style={{
                  background: `radial-gradient(circle at 30% 25%, color-mix(in oklab, ${accent.primary} 60%, white 10%), ${accent.secondary})`,
                  color: "var(--color-ink-on-accent)",
                  boxShadow: `0 10px 32px -8px ${accent.glow}`,
                }}
              >
                {firm.monogram}
              </div>
            )}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.26em]" style={{ color: accent.primary }}>
                {firm.tagline}
              </p>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-silver-100 sm:text-3xl">
                {firm.name}
              </h1>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.35 }}
            className="max-w-sm text-sm leading-relaxed text-silver-400"
          >
            {firm.description}
          </motion.p>
        </div>

        {otherFirms.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.35 }}
            className="relative z-10 mt-6 flex flex-wrap gap-2 border-t border-overlay/[0.06] pt-5"
          >
            <span className="mr-1 self-center text-[11px] font-medium uppercase tracking-wider text-silver-500">
              Switch
            </span>
            {otherFirms.map((f) => {
              const fAccent = accentOf(f);
              return (
                <button
                  key={f.id}
                  onClick={() => onSwitchFirm(f)}
                  className="focus-ring flex items-center gap-2 rounded-full border border-overlay/[0.08] bg-overlay/[0.03] px-3.5 py-1.5 text-xs font-medium text-silver-300 transition-colors hover:border-overlay/[0.16] hover:bg-overlay/[0.06]"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: fAccent.primary }} />
                  {f.shortName}
                </button>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mb-5 flex items-baseline justify-between"
      >
        <h2 className="font-display text-lg font-medium text-silver-200 sm:text-xl">Applications</h2>
        <span className="text-xs text-silver-500">{applications.length} applications</span>
      </motion.div>

      {showFilter && (
        <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-overlay/[0.07] bg-overlay/[0.03] px-4 py-2.5">
          <Search size={15} className="text-silver-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${firm.shortName} applications…`}
            className="flex-1 bg-transparent text-sm text-silver-100 outline-none placeholder:text-silver-500"
          />
        </div>
      )}

      {filteredApps.length === 0 ? (
        applications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-overlay/[0.12] py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-overlay/10 bg-overlay/[0.03] text-silver-500">
              <LayoutGrid size={20} />
            </div>
            <p className="text-sm text-silver-400">No applications configured for {firm.shortName} yet.</p>
            <Link to="/admin/applications" className="focus-ring text-sm text-gold-400 hover:underline">
              Add applications in Admin
            </Link>
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-silver-500">No applications match your filter.</div>
        )
      ) : (
        <>
          <ApplicationMasonry applications={filteredApps} />
          <MobileApplicationGrid applications={filteredApps} />
        </>
      )}
    </motion.div>
  );
}
