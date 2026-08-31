import { cn } from "@/lib/utils";

interface OneAskLogoProps {
  variant?: "full" | "wordmark" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
}

const wordmarkSize = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-7xl",
};

const iconSize = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

/** The ONE ASK brand mark: icon badge + custom wordmark, rendered in CSS/text
 * (not a raster crop) so it stays crisp at every size used across the app. */
export function OneAskLogo({ variant = "full", size = "md", showTagline = false, className }: OneAskLogoProps) {
  const showIcon = variant === "full" || variant === "icon";
  const showWord = variant === "full" || variant === "wordmark";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {showIcon && (
        <img
          src="/brand/icon-512.png"
          alt="ONE ASK"
          className={cn(iconSize[size], "rounded-[26%] shadow-[0_6px_24px_-6px_rgba(212,175,106,0.35)]")}
          draggable={false}
        />
      )}
      {showWord && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-display font-semibold tracking-tight", wordmarkSize[size])}>
            <span className="text-gradient-gold">ONE</span>{" "}
            <span className="text-silver-100">ASK</span>
          </span>
          {showTagline && (
            <span className="mt-2 text-[0.68em] font-medium uppercase tracking-[0.32em] text-silver-400">
              One stop solution <span className="text-gold-400">for all your tools</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
