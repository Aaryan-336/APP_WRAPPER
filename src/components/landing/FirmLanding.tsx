import { motion } from "motion/react";
import type { Firm } from "@/types";
import { FirmCard } from "@/components/landing/FirmCard";

interface FirmLandingProps {
  firms: Firm[];
  onSelect: (firm: Firm) => void;
}

export function FirmLanding({ firms, onSelect }: FirmLandingProps) {
  return (
    <motion.div
      className="mx-auto max-w-[1400px] px-4 pb-16 pt-10 sm:pt-16 md:px-8 md:pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18, ease: "easeIn" } }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
      >
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.34em] text-gold-400">
          ASK Asset and Wealth Management
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-silver-100 sm:text-5xl">
          Choose your group
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-silver-400 sm:text-base">
          Every tool and application your firm relies on — organized in one premium workspace.
        </p>
      </motion.div>

      <div className="flex flex-col gap-5 sm:gap-6 md:flex-row">
        {firms.map((firm, i) => (
          <FirmCard key={firm.id} firm={firm} index={i} onSelect={() => onSelect(firm)} />
        ))}
      </div>
    </motion.div>
  );
}
