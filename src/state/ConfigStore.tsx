import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Application, AskOneConfig, Firm } from "@/types";
import { ASK_ONE_CONFIG } from "@/data/config";

// ---------------------------------------------------------------------------
// No backend, no database — the config lives in this browser's localStorage,
// seeded from the bundled default in src/data/config.ts. That means Admin
// edits are only visible in the browser that made them; to publish a setup
// for every visitor, use Admin's Export action to download a ready-to-use
// src/data/config.ts, commit it, and redeploy. See docs/DEPLOYMENT.md.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "ask-one:config:v4";

interface ConfigContextValue {
  config: AskOneConfig;
  replaceConfig: (next: AskOneConfig) => void;
  resetToDefaults: () => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

function loadInitial(): AskOneConfig {
  if (typeof window === "undefined") return ASK_ONE_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return ASK_ONE_CONFIG;
    const parsed = JSON.parse(raw) as AskOneConfig;
    if (!parsed.firms || !parsed.applications) return ASK_ONE_CONFIG;
    return parsed;
  } catch {
    return ASK_ONE_CONFIG;
  }
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AskOneConfig>(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // storage unavailable — degrade silently, in-memory state still works
    }
  }, [config]);

  const replaceConfig = useCallback((next: AskOneConfig) => setConfig(next), []);
  const resetToDefaults = useCallback(() => setConfig(ASK_ONE_CONFIG), []);

  const value = useMemo<ConfigContextValue>(
    () => ({ config, replaceConfig, resetToDefaults }),
    [config, replaceConfig, resetToDefaults],
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
