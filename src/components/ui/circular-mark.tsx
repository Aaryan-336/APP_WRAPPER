import { cn } from "@/lib/utils";
import { DynamicIcon } from "@/components/ui/icon";
import type { AccentPalette } from "@/lib/accent";

interface CircularMarkProps {
  icon?: string;
  logoUrl?: string;
  label: string;
  accent: AccentPalette;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  ringed?: boolean;
}

const sizeMap = {
  sm: { box: "h-9 w-9", icon: 16 },
  md: { box: "h-12 w-12", icon: 20 },
  lg: { box: "h-16 w-16", icon: 26 },
  xl: { box: "h-24 w-24", icon: 38 },
};

/** The circular application mark used across masonry cards, search results,
 * and the embedded app shell. Renders an uploaded logo image when present,
 * else falls back to the lucide icon, else a two-letter monogram. */
export function CircularMark({ icon, logoUrl, label, accent, size = "md", className, ringed = true }: CircularMarkProps) {
  const s = sizeMap[size];

  if (logoUrl) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-800",
          s.box,
          ringed && "ring-1 ring-inset",
          className,
        )}
        style={{
          boxShadow: `0 4px 18px -4px ${accent.glow}`,
          ...(ringed ? ({ "--tw-ring-color": accent.ring } as React.CSSProperties) : {}),
        }}
        role="img"
        aria-label={label}
      >
        <img src={logoUrl} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        s.box,
        ringed && "ring-1 ring-inset",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, ${accent.primary} 55%, white 8%), ${accent.secondary} 78%)`,
        boxShadow: `0 4px 18px -4px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
        ...(ringed ? ({ "--tw-ring-color": accent.ring } as React.CSSProperties) : {}),
      }}
      role="img"
      aria-label={label}
    >
      {icon ? (
        <DynamicIcon name={icon} size={s.icon} strokeWidth={1.75} className="text-ink-on-accent/85" />
      ) : (
        <span className="font-display text-sm font-semibold text-ink-on-accent/85">{label.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}
