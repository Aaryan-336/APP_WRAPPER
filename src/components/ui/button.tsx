import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-invert-surface text-invert-ink hover:brightness-110 hover:-translate-y-px shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_8px_24px_-8px_rgba(0,0,0,0.5)]",
  secondary:
    "bg-navy-800/80 text-silver-100 border border-overlay/10 hover:bg-navy-700/80 hover:border-overlay/20",
  ghost: "bg-transparent text-silver-300 hover:bg-overlay/5 hover:text-silver-100",
  outline: "bg-transparent border border-overlay/15 text-silver-200 hover:border-overlay/30 hover:bg-overlay/5",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
  icon: "h-10 w-10 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "focus-ring inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
