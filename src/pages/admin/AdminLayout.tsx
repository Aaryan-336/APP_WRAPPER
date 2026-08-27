import { NavLink, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { LayoutGrid, Boxes, LockKeyholeOpen, RotateCcw, Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/state/AdminAuthContext";
import { AdminDraftProvider, useAdminDraft } from "@/state/AdminDraftContext";
import { AdminLockScreen } from "@/components/admin/AdminLockScreen";
import { Button } from "@/components/ui/button";

const tabs = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/admin/firms", label: "Subfirms", icon: Boxes, end: false },
  { to: "/admin/applications", label: "Applications", icon: LayoutGrid, end: false },
];

export function AdminLayout() {
  const { unlocked } = useAdminAuth();

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 pb-20 pt-6 md:px-8 md:pt-10">
        <AdminLockScreen />
      </div>
    );
  }

  return (
    <AdminDraftProvider>
      <AdminLayoutContent />
    </AdminDraftProvider>
  );
}

function AdminLayoutContent() {
  const { lock } = useAdminAuth();
  const { resetToDefaults } = useAdminDraft();
  const [resetError, setResetError] = useState<string | null>(null);

  const handleReset = async () => {
    if (!confirm("Reset all admin changes back to the default configuration? This publishes immediately.")) return;
    setResetError(null);
    try {
      await resetToDefaults();
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Reset failed");
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-32 pt-6 md:px-8 md:pt-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-overlay/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-gold-400">Admin</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-silver-100 sm:text-3xl">
            Configuration
          </h1>
          <p className="mt-1.5 max-w-lg text-sm text-silver-400">
            Edits are staged as a draft and publish to every visitor on save. Card templates stay fixed — accent
            colors accept any hex code you choose.
          </p>
          {resetError && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-state-danger">
              <TriangleAlert size={12} /> {resetError}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 self-start">
          <button
            onClick={handleReset}
            className="focus-ring flex items-center gap-2 rounded-xl border border-overlay/10 px-3.5 py-2 text-xs font-medium text-silver-400 transition-all duration-200 hover:border-overlay/20 hover:text-silver-200 active:scale-[0.96]"
          >
            <RotateCcw size={13} /> Reset to defaults
          </button>
          <button
            onClick={lock}
            className="focus-ring flex items-center gap-2 rounded-xl border border-overlay/10 px-3.5 py-2 text-xs font-medium text-silver-400 transition-all duration-200 hover:border-overlay/20 hover:text-silver-200 active:scale-[0.96]"
          >
            <LockKeyholeOpen size={13} /> Lock
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "focus-ring flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.96]",
                isActive
                  ? "border-gold-400/40 bg-gold-400/10 text-gold-300"
                  : "border-overlay/[0.08] text-silver-400 hover:border-overlay/[0.16] hover:text-silver-200",
              )
            }
          >
            <tab.icon size={15} />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
      <SaveBar />
    </div>
  );
}

function SaveBar() {
  const { dirty, save, discard } = useAdminDraft();
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await save();
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 1800);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {(dirty || justSaved || saveError) && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+84px)] z-50 flex justify-center px-4 md:bottom-6"
        >
          <div className="flex flex-col items-center gap-2">
            {saveError && (
              <span className="flex items-center gap-1.5 rounded-full border border-state-danger/30 bg-navy-900/95 px-3.5 py-1.5 text-xs font-medium text-state-danger shadow-xl backdrop-blur-2xl">
                <TriangleAlert size={12} /> {saveError}
              </span>
            )}
            <div className="flex items-center gap-3 rounded-full border border-overlay/10 bg-navy-900/95 py-2 pl-4 pr-2 shadow-2xl shadow-black/50 backdrop-blur-2xl">
              {justSaved && !dirty ? (
                <span className="flex items-center gap-1.5 pr-2 text-sm font-medium text-state-success">
                  <Check size={15} /> Saved for everyone
                </span>
              ) : (
                <>
                  <span className="text-sm font-medium text-silver-200">Unsaved changes</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={discard}
                      disabled={saving}
                      className="focus-ring rounded-full px-3 py-1.5 text-xs font-medium text-silver-400 transition-colors hover:bg-overlay/8 hover:text-silver-200 disabled:opacity-40"
                    >
                      Discard
                    </button>
                    <Button size="sm" onClick={handleSave} disabled={saving} className="rounded-full">
                      {saving ? <LoaderCircle size={13} className="animate-spin" /> : <Check size={13} />}
                      Save changes
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
