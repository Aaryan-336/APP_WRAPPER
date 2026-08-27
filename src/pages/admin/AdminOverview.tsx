import { useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, LayoutGrid, ArrowUpRight, KeyRound, Check, TriangleAlert } from "lucide-react";
import { useAdminDraft } from "@/state/AdminDraftContext";
import { useAdminAuth } from "@/state/AdminAuthContext";
import { Button } from "@/components/ui/button";

export function AdminOverview() {
  const { draft } = useAdminDraft();
  const activeFirms = draft.firms.filter((f) => f.isActive).length;
  const activeApps = draft.applications.filter((a) => a.isActive).length;

  const stats = [
    { label: "Subfirms", value: `${activeFirms}/${draft.firms.length}`, icon: Boxes, to: "/admin/firms" },
    { label: "Applications", value: `${activeApps}/${draft.applications.length}`, icon: LayoutGrid, to: "/admin/applications" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="focus-ring group flex flex-col justify-between rounded-2xl border border-overlay/[0.07] bg-overlay/[0.02] p-5 transition-colors hover:border-overlay/[0.14] hover:bg-overlay/[0.04]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
                <s.icon size={18} />
              </div>
              <ArrowUpRight size={16} className="text-silver-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <div className="mt-5">
              <p className="font-display text-2xl font-semibold text-silver-100">{s.value}</p>
              <p className="text-xs text-silver-500">{s.label} active</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-overlay/[0.07] bg-overlay/[0.02] p-6">
        <h2 className="font-display text-base font-medium text-silver-100">How this works</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-silver-400">
          <li>• Edits are staged as a draft — click Save changes to publish them across the app.</li>
          <li>• Each firm shows its applications directly — there's no department layer in between.</li>
          <li>• Card templates are restricted to approved options — accent colors accept any hex code.</li>
          <li>• Toggle items inactive to hide them from the public app without deleting their configuration.</li>
          <li>• Admin access is checked server-side and shared for every visitor — saved changes go live for everyone.</li>
        </ul>
      </div>

      <ChangePasswordCard />
    </div>
  );
}

function ChangePasswordCard() {
  const { changePassword } = useAdminAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmNext, setConfirmNext] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error" | "mismatch">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirmNext) {
      setStatus("mismatch");
      return;
    }
    const ok = await changePassword(current, next);
    setStatus(ok ? "success" : "error");
    if (ok) {
      setCurrent("");
      setNext("");
      setConfirmNext("");
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-overlay/[0.07] bg-overlay/[0.02] p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
          <KeyRound size={16} />
        </div>
        <h2 className="font-display text-base font-medium text-silver-100">Admin password</h2>
      </div>
      <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          type="password"
          value={current}
          onChange={(e) => {
            setCurrent(e.target.value);
            setStatus("idle");
          }}
          placeholder="Current password"
          className="admin-input"
        />
        <input
          type="password"
          value={next}
          onChange={(e) => {
            setNext(e.target.value);
            setStatus("idle");
          }}
          placeholder="New password"
          className="admin-input"
        />
        <input
          type="password"
          value={confirmNext}
          onChange={(e) => {
            setConfirmNext(e.target.value);
            setStatus("idle");
          }}
          placeholder="Confirm new password"
          className="admin-input"
        />
        <div className="sm:col-span-3 flex items-center gap-3">
          <Button type="submit" variant="secondary" size="sm">
            Update password
          </Button>
          {status === "success" && (
            <span className="flex items-center gap-1.5 text-[11px] text-state-success">
              <Check size={12} /> Password updated.
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1.5 text-[11px] text-state-danger">
              <TriangleAlert size={12} /> Current password is incorrect.
            </span>
          )}
          {status === "mismatch" && (
            <span className="flex items-center gap-1.5 text-[11px] text-state-danger">
              <TriangleAlert size={12} /> New passwords don't match.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
