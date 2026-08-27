import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Application, AskOneConfig, Firm } from "@/types";
import { ASK_ONE_CONFIG } from "@/data/config";

// ---------------------------------------------------------------------------
// The shared configuration now lives server-side (Vercel serverless
// functions + Upstash Redis, see /api/config.ts) so every visitor sees the
// same firms/applications, not just whoever last edited them in their own
// browser. This store fetches it on mount and exposes a `replaceConfig`
// used by the admin draft/save flow to publish a full new snapshot.
//
// Until the first fetch resolves, the bundled blank-slate default is shown
// — the intro screen's ~2.6s cover means this almost never becomes visible
// in practice.
// ---------------------------------------------------------------------------

interface ConfigContextValue {
  config: AskOneConfig;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  /** Publishes a full new config to every visitor. Throws on failure
   * (network error or an expired admin session) — callers should catch. */
  replaceConfig: (next: AskOneConfig) => Promise<void>;
  /** Clears the shared override, reverting every visitor to the bundled
   * blank-slate default. Throws on failure. */
  resetToDefaults: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

async function fetchSharedConfig(): Promise<AskOneConfig> {
  const res = await fetch("/api/config");
  if (!res.ok) throw new Error(`Failed to load configuration (${res.status})`);
  const body = (await res.json()) as { config: AskOneConfig | null };
  return body.config ?? ASK_ONE_CONFIG;
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AskOneConfig>(ASK_ONE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const next = await fetchSharedConfig();
      setConfig(next);
      setError(null);
    } catch (err) {
      // Keep whatever config is currently shown (bundled default on first
      // load) rather than blanking the app on a transient network error.
      setError(err instanceof Error ? err.message : "Failed to load configuration");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const replaceConfig = useCallback(async (next: AskOneConfig) => {
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(next),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Save failed (${res.status})`);
    }
    setConfig(next);
    setError(null);
  }, []);

  const resetToDefaults = useCallback(async () => {
    const res = await fetch("/api/config", { method: "DELETE", credentials: "same-origin" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Reset failed (${res.status})`);
    }
    setConfig(ASK_ONE_CONFIG);
    setError(null);
  }, []);

  const value = useMemo<ConfigContextValue>(
    () => ({ config, loading, error, refetch, replaceConfig, resetToDefaults }),
    [config, loading, error, refetch, replaceConfig, resetToDefaults],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}

export function useActiveFirms(): Firm[] {
  const { config } = useConfig();
  return [...config.firms].filter((f) => f.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function useApplicationsForFirm(firmId: string | undefined): Application[] {
  const { config } = useConfig();
  if (!firmId) return [];
  return config.applications
    .filter((a) => a.firmId === firmId && a.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function useAppCountForFirm(firmId: string): number {
  const { config } = useConfig();
  return config.applications.filter((a) => a.firmId === firmId && a.isActive).length;
}
