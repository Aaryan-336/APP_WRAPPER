import { motion } from "motion/react";
import { ExternalLink, MonitorSmartphone, SquareArrowOutUpRight, Star } from "lucide-react";
import type { Application } from "@/types";
import { accentOf } from "@/lib/accent";
import { CircularMark } from "@/components/ui/circular-mark";
import { useLaunchApplication } from "@/lib/launch";
import { cn } from "@/lib/utils";

const launchIcon = {
  embedded: MonitorSmartphone,
  "same-window": SquareArrowOutUpRight,
  external: ExternalLink,
};

interface MobileApplicationGridProps {
  applications: Application[];
}

/** A dedicated mobile composition — not a shrunk desktop grid. Two-column
 * asymmetric layout with large cards for hero/rich apps, collapsing to a
 * single column on very narrow screens. */
export function MobileApplicationGrid({ applications }: MobileApplicationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:hidden">
      {applications.map((app, i) => (
        <MobileApplicationCard key={app.id} app={app} index={i} />
      ))}
    </div>
  );
}

function MobileApplicationCard({ app, index }: { app: Application; index: number }) {
  const accent = accentOf(app);
  const launch = useLaunchApplication();
  const large = app.cardTemplate === "hero" || app.cardTemplate === "rich";
  const LaunchIcon = launchIcon[app.launchMode];

  return (
    <motion.button
      onClick={() => launch(app)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.035 * index, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.965 }}
      className={cn(
        "focus-ring relative flex min-h-[128px] flex-col justify-between overflow-hidden rounded-2xl border border-overlay/[0.06] bg-overlay/[0.025] p-4 text-left active:border-overlay/[0.12]",
        large && "min-[380px]:col-span-2 min-h-[144px]",
      )}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-25 blur-2xl"
        style={{ background: accent.primary }}
      />
      {app.isFeatured && (
        <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gold-400/15 px-1.5 py-0.5 text-[9.5px] font-medium text-gold-300">
          <Star size={9} fill="currentColor" /> Featured
        </span>
      )}
      <div className="relative z-10 flex items-start justify-between">
        <CircularMark icon={app.icon} logoUrl={app.logoUrl} label={app.name} accent={accent} size="md" />
      </div>
      <div className="relative z-10 mt-3">
        <h3 className="text-[15px] font-semibold leading-snug text-silver-100">{app.name}</h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          <LaunchIcon size={11} className="text-silver-500" />
          <span className="text-[12px] font-medium text-silver-500">
            {app.launchMode === "embedded" ? "Embedded" : app.launchMode === "same-window" ? "This window" : "New tab"}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
