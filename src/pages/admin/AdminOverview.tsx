import { Link } from "react-router-dom";
import { Boxes, LayoutGrid, ArrowUpRight, KeyRound } from "lucide-react";
import { useAdminDraft } from "@/state/AdminDraftContext";

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

      <div className="mt-4 rounded-2xl border border-overlay/[0.07] bg-overlay/[0.02] p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
            <KeyRound size={16} />
          </div>
          <h2 className="font-display text-base font-medium text-silver-100">Admin password</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-silver-400">
          The password lives in the <code className="rounded bg-overlay/[0.06] px-1.5 py-0.5 text-silver-300">ADMIN_PASSWORD</code> environment
          variable, not in a database — there's no in-app form to change it. To rotate it, update that variable in
          your hosting provider's settings and redeploy.
        </p>
      </div>
    </div>
  );
}
