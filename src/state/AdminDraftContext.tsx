import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Application, OneAskConfig, CardTemplate, Firm } from "@/types";
import { useConfig } from "@/state/ConfigStore";

// ---------------------------------------------------------------------------
// Admin edits are staged here, not written to the live ConfigStore directly.
// The admin pages read/write this draft; a floating save bar (rendered by
// AdminLayout) commits the whole draft in one shot via ConfigStore, which
// persists it to localStorage and syncs it to Vercel Blob so every device
// picks up the change — or discards the draft back to whatever is live.
// This matches "persist automatically, or with an explicit save action"
// from the original admin spec, choosing the explicit-save path.
// ---------------------------------------------------------------------------

interface AdminDraftContextValue {
  draft: OneAskConfig;
  dirty: boolean;
  updateFirm: (id: string, patch: Partial<Firm>) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  addApplication: (firmId: string) => void;
  deleteApplication: (id: string) => void;
  reorderFirms: (orderedIds: string[]) => void;
  reorderApplications: (firmId: string, orderedIds: string[]) => void;
  /** Commits the draft to this browser's localStorage. */
  save: () => Promise<void>;
  discard: () => void;
  /** Reverts this browser to the bundled blank-slate default. */
  resetToDefaults: () => Promise<void>;
}

const AdminDraftContext = createContext<AdminDraftContextValue | null>(null);

function makeBlankApplication(firmId: string, displayOrder: number): Application {
  return {
    id: `app-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    firmId,
    name: "New application",
    slug: `new-application-${Date.now().toString(36)}`,
    description: "Describe what this application does.",
    url: "https://",
    icon: "AppWindow",
    accent: "slate",
    primaryColor: "#9fadb6",
    secondaryColor: "#4a5a66",
    cardTemplate: "standard" as CardTemplate,
    tags: [],
    aliases: [],
    launchMode: "external",
    fallbackLaunchMode: "external",
    displayOrder,
    isFeatured: false,
    isActive: true,
  };
}

export function AdminDraftProvider({ children }: { children: ReactNode }) {
  const { config: liveConfig, replaceConfig, resetToDefaults: resetLiveToDefaults } = useConfig();
  const [draft, setDraft] = useState<OneAskConfig>(liveConfig);
  const lastSyncedLive = useRef(liveConfig);

  // Re-sync the draft whenever the live config changes for a reason other
  // than our own save() (e.g. a fresh load, or a reset) — never clobber
  // in-progress edits with a stale live snapshot otherwise.
  useEffect(() => {
    if (liveConfig !== lastSyncedLive.current) {
      lastSyncedLive.current = liveConfig;
      setDraft(liveConfig);
    }
  }, [liveConfig]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(liveConfig), [draft, liveConfig]);

  // Warn on tab close/refresh with unsaved edits. In-app navigation away
  // from /admin isn't guarded — the floating save bar stays visible as the
  // reminder while you're on any admin screen.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const updateFirm = useCallback((id: string, patch: Partial<Firm>) => {
    setDraft((prev) => ({ ...prev, firms: prev.firms.map((f) => (f.id === id ? { ...f, ...patch } : f)) }));
  }, []);

  const updateApplication = useCallback((id: string, patch: Partial<Application>) => {
    setDraft((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }, []);

  const addApplication = useCallback((firmId: string) => {
    setDraft((prev) => {
      const firmApps = prev.applications.filter((a) => a.firmId === firmId);
      const maxOrder = firmApps.reduce((m, a) => Math.max(m, a.displayOrder), 0);
      return { ...prev, applications: [...prev.applications, makeBlankApplication(firmId, maxOrder + 1)] };
    });
  }, []);

  const deleteApplication = useCallback((id: string) => {
    setDraft((prev) => ({ ...prev, applications: prev.applications.filter((a) => a.id !== id) }));
  }, []);

  const reorderFirms = useCallback((orderedIds: string[]) => {
    setDraft((prev) => ({
      ...prev,
      firms: prev.firms.map((f) => {
        const idx = orderedIds.indexOf(f.id);
        return idx === -1 ? f : { ...f, displayOrder: idx + 1 };
      }),
    }));
  }, []);

  const reorderApplications = useCallback((_firmId: string, orderedIds: string[]) => {
    setDraft((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => {
        const idx = orderedIds.indexOf(a.id);
        return idx === -1 ? a : { ...a, displayOrder: idx + 1 };
      }),
    }));
  }, []);

  const save = useCallback(async () => {
    await replaceConfig(draft);
    lastSyncedLive.current = draft;
  }, [draft, replaceConfig]);

  const discard = useCallback(() => {
    setDraft(liveConfig);
  }, [liveConfig]);

  const resetToDefaults = useCallback(async () => {
    await resetLiveToDefaults();
    // liveConfig will update on next render; the effect above re-syncs draft.
  }, [resetLiveToDefaults]);

  const value: AdminDraftContextValue = {
    draft,
    dirty,
    updateFirm,
    updateApplication,
    addApplication,
    deleteApplication,
    reorderFirms,
    reorderApplications,
    save,
    discard,
    resetToDefaults,
  };

  return <AdminDraftContext.Provider value={value}>{children}</AdminDraftContext.Provider>;
}

export function useAdminDraft(): AdminDraftContextValue {
  const ctx = useContext(AdminDraftContext);
  if (!ctx) throw new Error("useAdminDraft must be used within AdminDraftProvider");
  return ctx;
}
