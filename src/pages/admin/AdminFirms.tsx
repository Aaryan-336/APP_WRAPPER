import { useAdminDraft } from "@/state/AdminDraftContext";
import { AccentPicker } from "@/components/admin/AccentPicker";
import { ActiveToggle } from "@/components/admin/ActiveToggle";
import { OrderButtons } from "@/components/admin/OrderButtons";
import { accentOf } from "@/lib/accent";
import { LogoUpload } from "@/components/admin/LogoUpload";
import { cn } from "@/lib/utils";

export function AdminFirms() {
  const { draft, updateFirm, reorderFirms } = useAdminDraft();
  const firms = [...draft.firms].sort((a, b) => a.displayOrder - b.displayOrder);

  const move = (id: string, dir: -1 | 1) => {
    const ids = firms.map((f) => f.id);
    const idx = ids.indexOf(id);
    const swap = idx + dir;
    if (swap < 0 || swap >= ids.length) return;
    [ids[idx], ids[swap]] = [ids[swap], ids[idx]];
    reorderFirms(ids);
  };

  return (
    <div className="flex flex-col gap-4">
      {firms.map((firm, idx) => {
        const accent = accentOf(firm);
        return (
          <div
            key={firm.id}
            className={cn(
              "rounded-2xl border p-5 transition-all duration-300 sm:p-6",
              firm.isActive
                ? "border-overlay/[0.07] bg-overlay/[0.02]"
                : "border-overlay/[0.05] bg-overlay/[0.01] opacity-60 saturate-[0.4]",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <OrderButtons
                  onUp={() => move(firm.id, -1)}
                  onDown={() => move(firm.id, 1)}
                  disableUp={idx === 0}
                  disableDown={idx === firms.length - 1}
                />
                {firm.logoUrl ? (
                  <div className="h-11 w-11 overflow-hidden rounded-xl bg-navy-800">
                    <img src={firm.logoUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl font-display text-sm font-semibold text-ink-on-accent"
                    style={{ background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})` }}
                  >
                    {firm.monogram}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-silver-100">{firm.name}</p>
                  <p className="text-xs text-silver-500">/{firm.slug}</p>
                </div>
              </div>
              <ActiveToggle active={firm.isActive} onChange={(v) => updateFirm(firm.id, { isActive: v })} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Display name">
                <input
                  value={firm.name}
                  onChange={(e) => updateFirm(firm.id, { name: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Short name">
                <input
                  value={firm.shortName}
                  onChange={(e) => updateFirm(firm.id, { shortName: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Tagline">
                <input
                  value={firm.tagline}
                  onChange={(e) => updateFirm(firm.id, { tagline: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Monogram">
                <input
                  value={firm.monogram}
                  maxLength={3}
                  placeholder="Used when no logo is set"
                  onChange={(e) => updateFirm(firm.id, { monogram: e.target.value.toUpperCase() })}
                  className="admin-input"
                />
              </Field>
              <Field label="Logo" full>
                <LogoUpload
                  value={firm.logoUrl}
                  onChange={(logoUrl) => updateFirm(firm.id, { logoUrl })}
                  shape="square"
                  fallback={
                    <span className="font-display text-sm font-semibold text-silver-300">{firm.monogram}</span>
                  }
                />
              </Field>
              <Field label="Description" full>
                <textarea
                  value={firm.description}
                  rows={2}
                  onChange={(e) => updateFirm(firm.id, { description: e.target.value })}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label="Accent" full>
                <AccentPicker
                  primary={firm.primaryColor}
                  secondary={firm.secondaryColor}
                  onChange={(next) => updateFirm(firm.id, next)}
                />
              </Field>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] font-medium uppercase tracking-wider text-silver-500">{label}</span>
      {children}
    </label>
  );
}
