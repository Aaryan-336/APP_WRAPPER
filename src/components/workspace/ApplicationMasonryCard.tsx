import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, MonitorSmartphone, SquareArrowOutUpRight, Star } from "lucide-react";
import type { Application, CardTemplate } from "@/types";
import { accentOf } from "@/lib/accent";
import { CircularMark } from "@/components/ui/circular-mark";
import { useLaunchApplication } from "@/lib/launch";
import { cn } from "@/lib/utils";

const spanClasses: Record<CardTemplate, string> = {
  hero: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
  standard: "md:col-span-1 md:row-span-1",
  rich: "md:col-span-2 md:row-span-2",
};

const launchIcon = {
  embedded: MonitorSmartphone,
  "same-window": SquareArrowOutUpRight,
  external: ExternalLink,
};

interface ApplicationMasonryCardProps {
  app: Application;
  index: number;
}

/** Controlled Pinterest-style masonry card — one per application, sized by
 * its admin-selected card template (hero/wide/tall/standard/rich). Clicking
 * launches the app directly per its configured launch mode. */
export function ApplicationMasonryCard({ app, index }: ApplicationMasonryCardProps) {
  const accent = accentOf(app);
  const launch = useLaunchApplication();
  const isRich = app.cardTemplate === "rich";
  const isLarge = app.cardTemplate === "hero" || isRich || app.cardTemplate === "tall";
  const LaunchIcon = launchIcon[app.launchMode];

  return (
    <motion.button
      onClick={() => launch(app)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(0.04 * index, 0.5), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "focus-ring group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-overlay/[0.06] bg-overlay/[0.02] p-6 text-left transition-colors duration-300 hover:border-overlay/[0.12] hover:bg-overlay/[0.035]",
        spanClasses[app.cardTemplate],
        isLarge ? "min-h-[210px]" : "min-h-[168px]",
      )}
      style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset" }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: accent.primary }}
      />

      {app.isFeatured && (
        <span className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-medium text-gold-300">
          <Star size={10} fill="currentColor" /> Featured
        </span>
      )}

      <div className="relative z-10 flex items-start justify-between">
        <CircularMark icon={app.icon} logoUrl={app.logoUrl} label={app.name} accent={accent} size={isLarge ? "lg" : "md"} />
      </div>

      <div className="relative z-10 mt-6">
        <h3 className={cn("font-display font-semibold tracking-tight text-silver-100", isLarge ? "text-xl sm:text-2xl" : "text-lg")}>
          {app.name}
        </h3>
        <p className={cn("mt-2 text-silver-400", isLarge ? "text-[13.5px] leading-relaxed" : "text-[13px] leading-snug line-clamp-2")}>
          {app.description}
        </p>

        {isRich && app.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {app.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-md bg-overlay/[0.05] px-2 py-1 text-[11px] text-silver-400">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-silver-500 transition-colors group-hover:text-silver-300">
          <LaunchIcon size={12} />
          {app.launchMode === "embedded" ? "Opens inside ONE ASK" : app.launchMode === "same-window" ? "Opens in this window" : "Opens in new tab"}
          <ArrowUpRight size={13} className="ml-auto transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.button>
  );
}
