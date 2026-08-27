import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Admin auth now checks against a server-side password hash and session
// (see /api/admin/*.ts) instead of a value sitting in localStorage — a
// browser dev-tools user can no longer just flip a flag to get in. The
// session is an HttpOnly cookie the browser sends automatically; this
// context just tracks whether we currently have a valid one.
// ---------------------------------------------------------------------------

interface AdminAuthContextValue {
  unlocked: boolean;
  checking: boolean;
  unlock: (password: string) => Promise<boolean>;
  lock: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : { unlocked: false }))
      .then((body) => setUnlocked(!!body.unlocked))
      .catch(() => setUnlocked(false))
      .finally(() => setChecking(false));
  }, []);

  const unlock = useCallback(async (password: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ password }),
    });
    const ok = res.ok;
    if (ok) setUnlocked(true);
    return ok;
  }, []);

  const lock = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
    setUnlocked(false);
  }, []);

  const changePassword = useCallback(async (current: string, next: string) => {
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ current, next }),
    });
    return res.ok;
  }, []);

  return (
    <AdminAuthContext.Provider value={{ unlocked, checking, unlock, lock, changePassword }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
