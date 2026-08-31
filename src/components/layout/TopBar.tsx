import { Link } from "react-router-dom";
import { Command, Search, Settings } from "lucide-react";
import { OneAskLogo } from "@/components/brand/OneAskLogo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface TopBarProps {
  onOpenSearch: () => void;
}

export function TopBar({ onOpenSearch }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-overlay/[0.06] bg-navy-950/70 backdrop-blur-xl transition-colors duration-300"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:h-[72px] md:px-8">
        <Link to="/" className="focus-ring rounded-lg transition-transform duration-200 hover:scale-[1.02]" aria-label="ONE ASK home">
          <OneAskLogo size="sm" />
        </Link>

        <div className="flex items-center gap-1.5 md:gap-2.5">
          <button
            onClick={onOpenSearch}
            className="focus-ring hidden items-center gap-3 rounded-full border border-overlay/10 bg-overlay/[0.03] px-4 py-2 text-sm text-silver-400 transition-all duration-200 hover:border-overlay/20 hover:bg-overlay/[0.06] hover:text-silver-200 active:scale-[0.98] md:flex"
          >
            <Search size={15} />
            <span>Search applications…</span>
            <span className="ml-6 flex items-center gap-0.5 rounded-md border border-overlay/10 bg-overlay/[0.04] px-1.5 py-0.5 text-[11px] text-silver-500">
              <Command size={11} />K
            </span>
          </button>

          <Button variant="ghost" size="icon" onClick={onOpenSearch} className="md:hidden" aria-label="Search">
            <Search size={18} />
          </Button>

          <ThemeToggle />

          <Link
            to="/admin"
            aria-label="Admin settings"
            className="focus-ring hidden h-10 w-10 items-center justify-center rounded-xl text-silver-300 transition-all duration-200 hover:bg-overlay/5 hover:text-silver-100 active:scale-90 md:flex"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
