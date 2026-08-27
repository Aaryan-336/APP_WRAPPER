import { useMemo, useState } from "react";
import type { CardTemplate, FallbackLaunchMode, LaunchMode } from "@/types";
import { useAdminDraft } from "@/state/AdminDraftContext";
import { ActiveToggle } from "@/components/admin/ActiveToggle";
import { OrderButtons } from "@/components/admin/OrderButtons";
import { AccentPicker } from "@/components/admin/AccentPicker";
import { accentOf } from "@/lib/accent";
import { DynamicIcon } from "@/components/ui/icon";
import { AppIcon } from "@/components/ui/app-icon";
import { LogoUpload } from "@/components/admin/LogoUpload";
import { Plus, Star, Trash2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const LAUNCH_MODES: LaunchMode[] = ["embedded", "same-window", "external"];
const FALLBACK_MODES: FallbackLaunchMode[] = ["same-window", "external"];
const TEMPLATES: CardTemplate[] = ["hero", "wide", "tall", "standard", "rich"];

function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function AdminApplications() {
  const { draft, updateApplication, addApplication, deleteApplication, reorderApplications } = useAdminDraft();
  const [firmId, setFirmId] = useState<string | undefined>(draft.firms[0]?.id);

  const apps = useMemo(
    () =>
      draft.applications
        .filter((a) => a.firmId === firmId)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [draft.applications, firmId],
  );

  const move = (id: string, dir: -1 | 1) => {
    const ids = apps.map((a) => a.id);
    const idx = ids.indexOf(id);
    const swap = idx + dir;
    if (swap < 0 || swap >= ids.length) return;
    [ids[idx], ids[swap]] = [ids[swap], ids[idx]];
    if (firmId) reorderApplications(firmId, ids);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {draft.firms.map((f) => (
            <button
              key={f.id}
              onClick={() => setFirmId(f.id)}
              className={`focus-ring rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-[0.96] ${
                f.id === firmId
                  ? "border-gold-400/40 bg-gold-400/10 text-gold-300"
                  : "border-overlay/[0.08] text-silver-400 hover:border-overlay/[0.16]"
              }`}
            >
              {f.shortName}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={!firmId}
          onClick={() => firmId && addApplication(firmId)}
          className="focus-ring flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1.5 text-xs font-medium text-gold-300 transition-all duration-150 hover:border-gold-400/50 hover:bg-gold-400/15 active:scale-[0.96] disabled:opacity-40"
        >
          <Plus size={13} /> Add application
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {apps.map((app, idx) => {
          const urlValid = isValidUrl(app.url);
          const accent = accentOf(app);
          return (
            <div
              key={app.id}
              className={cn(
                "rounded-2xl border p-5 transition-all duration-300 sm:p-6",
                app.isActive
                  ? "border-overlay/[0.07] bg-overlay/[0.02]"
                  : "border-overlay/[0.05] bg-overlay/[0.01] opacity-60 saturate-[0.4]",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <OrderButtons
                    onUp={() => move(app.id, -1)}
                    onDown={() => move(app.id, 1)}
                    disableUp={idx === 0}
                    disableDown={idx === apps.length - 1}
                  />
                  <div
                    className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl"
                    style={{ background: accent.soft, color: accent.primary }}
                  >
                    <AppIcon icon={app.icon} logoUrl={app.logoUrl} name={app.name} size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-silver-100">{app.name}</p>
                    <p className="text-xs text-silver-500">/{app.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => updateApplication(app.id, { isFeatured: !app.isFeatured })}
                    className={`focus-ring flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      app.isFeatured
                        ? "border-gold-400/40 bg-gold-400/10 text-gold-300"
                        : "border-overlay/[0.08] text-silver-500"
                    }`}
                  >
                    <Star size={11} fill={app.isFeatured ? "currentColor" : "none"} /> Featured
                  </button>
                  <ActiveToggle active={app.isActive} onChange={(v) => updateApplication(app.id, { isActive: v })} />
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${app.name}"? This can't be undone.`)) deleteApplication(app.id);
                    }}
                    aria-label={`Delete ${app.name}`}
                    className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-silver-500 transition-all duration-150 hover:bg-state-danger/10 hover:text-state-danger active:scale-90"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    value={app.name}
                    onChange={(e) => updateApplication(app.id, { name: e.target.value })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Icon (lucide name)">
                  <input
                    value={app.icon}
                    onChange={(e) => updateApplication(app.id, { icon: e.target.value })}
                    className="admin-input"
                    placeholder="Used when no logo is set"
                  />
                </Field>
                <Field label="Logo" full>
                  <LogoUpload
                    value={app.logoUrl}
                    onChange={(logoUrl) => updateApplication(app.id, { logoUrl })}
                    shape="square"
                    maxDimension={192}
                    fallback={<DynamicIcon name={app.icon} size={20} className="text-silver-300" />}
                  />
                </Field>
                <Field label="Description" full>
                  <input
                    value={app.description}
                    onChange={(e) => updateApplication(app.id, { description: e.target.value })}
                    className="admin-input"
                  />
                </Field>
                <Field label="URL" full>
                  <input
                    value={app.url}
                    onChange={(e) => updateApplication(app.id, { url: e.target.value })}
                    className="admin-input"
                  />
                  {!urlValid && (
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] text-state-danger">
                      <TriangleAlert size={12} /> Enter a valid http(s) URL.
                    </span>
                  )}
                </Field>
                <Field label="Card template" full>
                  <div className="flex flex-wrap gap-2">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => updateApplication(app.id, { cardTemplate: t })}
                        className={`focus-ring rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all active:scale-[0.96] ${
                          app.cardTemplate === t
                            ? "border-gold-400/40 bg-gold-400/10 text-gold-300"
                            : "border-overlay/[0.08] text-silver-400 hover:border-overlay/[0.16]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Accent" full>
                  <AccentPicker
                    primary={app.primaryColor}
                    secondary={app.secondaryColor}
                    onChange={(next) => updateApplication(app.id, next)}
                  />
                </Field>
                <Field label="Tags (comma separated)" full>
                  <input
                    value={app.tags.join(", ")}
                    onChange={(e) =>
                      updateApplication(app.id, {
                        tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="admin-input"
                  />
                </Field>
                <Field label="Aliases (comma separated)" full>
                  <input
                    value={app.aliases.join(", ")}
                    onChange={(e) =>
                      updateApplication(app.id, {
                        aliases: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="admin-input"
                  />
                </Field>
                <Field label="Launch mode">
                  <select
                    value={app.launchMode}
                    onChange={(e) => updateApplication(app.id, { launchMode: e.target.value as LaunchMode })}
                    className="admin-input"
                  >
                    {LAUNCH_MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  {app.launchMode === "embedded" && (
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] text-state-warning">
                      <TriangleAlert size={12} /> Destination may reject iframe embedding — fallback will apply.
                    </span>
                  )}
                </Field>
                <Field label="Fallback launch mode">
                  <select
                    value={app.fallbackLaunchMode}
                    onChange={(e) =>
                      updateApplication(app.id, { fallbackLaunchMode: e.target.value as FallbackLaunchMode })
                    }
                    className="admin-input"
                  >
                    {FALLBACK_MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          );
        })}
        {apps.length === 0 && (
          <p className="py-10 text-center text-sm text-silver-500">No applications for this firm yet.</p>
        )}
      </div>
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
