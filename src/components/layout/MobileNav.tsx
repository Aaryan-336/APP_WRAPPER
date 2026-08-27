import { Link, useLocation } from "react-router-dom";
import { House, Search, Settings, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onOpenSearch: () => void;
}

export function MobileNav({ onOpenSearch }: MobileNavProps) {
  const { pathname } = useLocation();
  const firmMatch = pathname.match(/^\/firm\/([^/]+)/);
  const firmSlug = firmMatch?.[1];
  const isHome = pathname === "/";
  const isInFirm = !!firmSlug;
  const isAdmin = pathname.startsWith("/admin");
  const appsHref = firmSlug ? `/firm/${firmSlug}` : undefined;

  return (
    <nav
      className="fixed inset-x-0 z-40 flex justify-center px-4 md:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      aria-label="Primary"
    >
      <div className="flex items-center gap-1 rounded-full border border-overlay/10 bg-navy-900/85 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <NavItem to="/" icon={<House size={19} />} label="Home" active={isHome} />
        {appsHref ? (
          <NavItem to={appsHref} icon={<LayoutGrid size={19} />} label="Apps" active={isInFirm} />
        ) : (
          <span
            aria-disabled="true"
            title="Choose a firm to see its applications"
            className="flex flex-col items-center justify-center gap-0.5 rounded-full px-4 py-2 text-silver-600/40"
          >
            <LayoutGrid size={19} />
            <span className="text-[10px] font-medium tracking-wide">Apps</span>
          </span>
        )}
        <button
          onClick={onOpenSearch}
          className="focus-ring flex flex-col items-center justify-center gap-0.5 rounded-full px-4 py-2 text-silver-500 transition-all duration-150 active:scale-90 active:bg-overlay/8 active:text-silver-200"
        >
          <Search size={19} />
          <span className="text-[10px] font-medium tracking-wide">Search</span>
        </button>
        <NavItem to="/admin" icon={<Settings size={19} />} label="Admin" active={isAdmin} />
      </div>
    </nav>
  );
}

function NavItem({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "focus-ring flex flex-col items-center justify-center gap-0.5 rounded-full px-4 py-2 transition-all duration-150 active:scale-90",
        active ? "bg-gold-400/12 text-gold-300" : "text-silver-500 active:bg-overlay/8 active:text-silver-200",
      )}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </Link>
  );
}
