import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CommandPalette } from "@/components/search/CommandPalette";

export function AppShell() {
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative min-h-dvh bg-navy-950">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 40% at 15% 0%, rgba(28,68,80,0.28) 0%, transparent 60%), radial-gradient(50% 35% at 100% 10%, rgba(212,175,106,0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      <TopBar onOpenSearch={() => setPaletteOpen(true)} />

      <main className="mx-auto w-full pb-24 md:pb-10">
        <Outlet />
      </main>

      <MobileNav onOpenSearch={() => navigate("/search")} />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
