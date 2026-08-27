import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
import { useConfig } from "@/state/ConfigStore";
import { searchApplications } from "@/lib/search";
import { useLaunchApplication } from "@/lib/launch";
import { AppIcon } from "@/components/ui/app-icon";
import { accentOf } from "@/lib/accent";

export function SearchPage() {
  const navigate = useNavigate();
  const { config } = useConfig();
  const [query, setQuery] = useState("");
  const launch = useLaunchApplication();

  const results = useMemo(() => searchApplications(config, query), [config, query]);

  return (
    <>
    <div className="hidden min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center md:flex">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-overlay/10 bg-overlay/[0.03] text-silver-400">
        <Search size={22} />
      </div>
      <p className="text-silver-300">Press <kbd className="rounded-md border border-overlay/10 px-1.5 py-0.5 text-xs">⌘K</kbd> anywhere to search.</p>
      <button onClick={() => navigate("/")} className="focus-ring text-sm text-gold-400 hover:underline">Back to home</button>
    </div>
    <div className="mx-auto max-w-2xl px-4 pt-4 md:hidden">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-silver-300 hover:bg-overlay/5"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-overlay/10 bg-overlay/[0.04] px-4 py-3">
          <Search size={18} className="text-silver-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, firms, tags…"
            className="flex-1 bg-transparent text-[16px] text-silver-100 outline-none placeholder:text-silver-500"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={16} className="text-silver-500" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 mb-2 px-1 text-[11px] font-medium uppercase tracking-wider text-silver-500">
        {query ? `Results for “${query}”` : "Featured applications"}
      </p>

      {results.length === 0 && (
        <div className="py-16 text-center text-sm text-silver-500">No applications match your search.</div>
      )}

      <div className="flex flex-col gap-1.5 pb-10">
        {results.map((r) => {
          const accent = accentOf(r.app);
          return (
            <button
              key={r.app.id}
              onClick={() => launch(r.app)}
              className="focus-ring flex items-center gap-3.5 rounded-2xl border border-overlay/[0.05] bg-overlay/[0.02] px-3.5 py-3 text-left active:scale-[0.98]"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                style={{ background: accent.soft, color: accent.primary }}
              >
                <AppIcon icon={r.app.icon} logoUrl={r.app.logoUrl} name={r.app.name} size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-silver-100">{r.app.name}</p>
                <p className="truncate text-xs text-silver-500">{r.firmName}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
    </>
  );
}
