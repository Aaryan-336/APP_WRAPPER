import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Firm } from "@/types";
import { accentOf } from "@/lib/accent";
import GlassmorphismCta from "@/components/ui/glassmorphism-cta";

interface FirmCardProps {
  firm: Firm;
  onSelect: () => void;
  index: number;
}

export function FirmCard({ firm, onSelect, index }: FirmCardProps) {
  const accent = accentOf(firm);

  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.06 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.015, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="focus-ring group relative flex min-h-[340px] flex-1 flex-col justify-between overflow-hidden rounded-[28px] border border-overlay/[0.07] p-8 text-left shadow-[0_20px_60px_-24px_rgba(0,0,0,0.6)] transition-shadow duration-300 hover:shadow-[0_28px_80px_-20px_rgba(0,0,0,0.7)] sm:min-h-[420px] sm:p-10"
      style={{
        background: `linear-gradient(155deg, color-mix(in oklab, ${accent.primary} 10%, var(--color-navy-900)) 0%, var(--color-navy-900) 45%, var(--color-navy-950) 100%)`,
      }}
    >
      {/* ambient brand glow */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: accent.primary }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 ring-1 ring-inset transition-opacity duration-300 group-hover:opacity-100"
        style={{ "--tw-ring-color": accent.ring } as React.CSSProperties}
      />

      <div className="relative z-10 flex items-center justify-between">
        {firm.logoUrl ? (
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-navy-800 shadow-[0_10px_32px_-8px_rgba(0,0,0,0.4)] sm:h-20 sm:w-20">
            <img src={firm.logoUrl} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-display font-semibold sm:h-20 sm:w-20 sm:text-2xl"
            style={{
              background: `radial-gradient(circle at 30% 25%, color-mix(in oklab, ${accent.primary} 60%, white 10%), ${accent.secondary})`,
              color: "var(--color-ink-on-accent)",
              boxShadow: `0 10px 32px -8px ${accent.glow}`,
            }}
          >
            {firm.monogram}
          </div>
        )}
        <ArrowUpRight
          size={22}
          className="text-silver-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-silver-200"
        />
      </div>

      <div className="relative z-10 mt-10">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: accent.primary }}>
          {firm.tagline}
        </p>
        <h3 className="font-display text-3xl font-semibold tracking-tight text-silver-100 sm:text-4xl">
          {firm.name}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-silver-400 sm:text-[15px]">{firm.description}</p>

        <div className="mt-7" onClick={(e) => e.stopPropagation()}>
          <GlassmorphismCta
            label={`Enter ${firm.shortName}`}
            avatarSrc="/brand/icon-192.png"
            avatarAlt="ONE ASK"
            onClick={(e) => {
              e.preventDefault();
              onSelect();
            }}
          />
        </div>
      </div>
    </motion.button>
  );
}
