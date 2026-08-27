import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Admin auth checks a password held in a server env var (ADMIN_PASSWORD)
// and issues a stateless signed session cookie — no database involved (see
// /api/admin/*.ts and /api/_lib/auth.ts). A browser dev-tools user can't
// flip a flag to get in; the cookie is HttpOnly and its signature is
// verified server-side on every request. There's no in-app "change
// password" — the password only changes by editing the env var and
// redeploying, since there's nowhere else for it to live.
// ---------------------------------------------------------------------------

interface AdminAuthContextValue {
  unlocked: boolean;
  checking: boolean;
  unlock: (password: string) => Promise<boolean>;
  lock: () => Promise<void>;
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

  return (
    <AdminAuthContext.Provider value={{ unlocked, checking, unlock, lock }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
