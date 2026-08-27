import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, MonitorSmartphone, SquareArrowOutUpRight, Star } from "lucide-react";
import type { Application } from "@/types";
import type { AccentPalette } from "@/lib/accent";
import { AppIcon } from "@/components/ui/app-icon";
import { useLaunchApplication } from "@/lib/launch";

const launchIcon = {
  embedded: MonitorSmartphone,
  "same-window": SquareArrowOutUpRight,
  external: ExternalLink,
};

interface ApplicationCardProps {
  app: Application;
  accent: AccentPalette;
  index: number;
}

export function ApplicationCard({ app, accent, index }: ApplicationCardProps) {
  const launch = useLaunchApplication();
  const LaunchIcon = launchIcon[app.launchMode];

  return (
    <motion.button
      onClick={() => launch(app)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.045, 0.5), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, scale: 1.012 }}
      whileTap={{ scale: 0.975 }}
      className="focus-ring group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-overlay/[0.06] bg-overlay/[0.025] p-5 text-left transition-colors duration-300 hover:border-overlay/[0.14] hover:bg-overlay/[0.045]"
    >
      {app.isFeatured && (
        <span className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-medium text-gold-300">
          <Star size={10} fill="currentColor" /> Featured
        </span>
      )}
      <div className="flex items-center gap-3.5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl"
          style={{ background: accent.soft, color: accent.primary }}
        >
          <AppIcon icon={app.icon} logoUrl={app.logoUrl} name={app.name} size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-silver-100">{app.name}</h3>
          <p className="flex items-center gap-1 text-[11px] text-silver-500">
            <LaunchIcon size={11} />
            {app.launchMode === "embedded" ? "Opens inside ASK ONE" : app.launchMode === "same-window" ? "Opens in this window" : "Opens in new tab"}
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-[13px] leading-relaxed text-silver-400">{app.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {app.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-md bg-overlay/[0.04] px-2 py-0.5 text-[10.5px] text-silver-500">
              {tag}
            </span>
          ))}
        </div>
        <ArrowUpRight
          size={15}
          className="shrink-0 text-silver-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-silver-200"
        />
      </div>
    </motion.button>
  );
}
