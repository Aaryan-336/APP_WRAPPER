import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveToggleProps {
  active: boolean;
  onChange: (active: boolean) => void;
  label?: string;
}

export function ActiveToggle({ active, onChange, label = "Active" }: ActiveToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onChange(!active)}
      className="focus-ring group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-0.5 transition-colors hover:bg-overlay/5"
    >
      <span
        className={cn(
          "relative flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200",
          active ? "border-state-success bg-state-success/70" : "border-overlay/20 bg-overlay/[0.1]",
        )}
      >
        <motion.span
          className="absolute left-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white shadow-md"
          animate={{ x: active ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        >
          {active ? (
            <Check size={11} strokeWidth={3} className="text-emerald-700" />
          ) : (
            <X size={11} strokeWidth={3} className="text-silver-500" />
          )}
        </motion.span>
      </span>
      <span
        className={cn(
          "min-w-[52px] text-left text-xs font-medium transition-colors",
          active ? "text-state-success" : "text-silver-500",
        )}
      >
        {active ? label : "Inactive"}
      </span>
    </button>
  );
}
