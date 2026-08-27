import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/state/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`focus-ring relative flex h-10 w-10 items-center justify-center rounded-xl text-silver-300 transition-colors hover:bg-overlay/5 hover:text-silver-100 active:scale-90 ${className ?? ""}`}
    >
      <motion.span
        key={theme}
        initial={{ opacity: 0, rotate: -50, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center"
      >
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </motion.span>
    </button>
  );
}
