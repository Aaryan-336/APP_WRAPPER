import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { isValidHex } from "@/lib/accent";
import { cn } from "@/lib/utils";

interface AccentPickerProps {
  primary: string;
  secondary: string;
  onChange: (next: { primaryColor: string; secondaryColor: string }) => void;
}

/** Hex-code accent editor. Admins type the exact color they want — validated
 * against `#rgb`/`#rrggbb` before it's applied — rather than choosing from a
 * fixed swatch set. */
export function AccentPicker({ primary, secondary, onChange }: AccentPickerProps) {
  const [primaryDraft, setPrimaryDraft] = useState(primary);
  const [secondaryDraft, setSecondaryDraft] = useState(secondary);

  useEffect(() => setPrimaryDraft(primary), [primary]);
  useEffect(() => setSecondaryDraft(secondary), [secondary]);

  const primaryValid = isValidHex(primaryDraft);
  const secondaryValid = isValidHex(secondaryDraft);

  const commit = (nextPrimary: string, nextSecondary: string) => {
    if (isValidHex(nextPrimary) && isValidHex(nextSecondary)) {
      onChange({ primaryColor: nextPrimary.trim(), secondaryColor: nextSecondary.trim() });
    }
  };

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div
        className="mt-1 h-10 w-10 shrink-0 rounded-full border border-overlay/15"
        style={{
          background:
            primaryValid && secondaryValid
              ? `linear-gradient(135deg, ${primaryDraft}, ${secondaryDraft})`
              : "var(--color-navy-700)",
        }}
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-wrap gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-silver-500">Primary hex</span>
          <input
            value={primaryDraft}
            onChange={(e) => {
              setPrimaryDraft(e.target.value);
              commit(e.target.value, secondaryDraft);
            }}
            placeholder="#d4af6a"
            spellCheck={false}
            className={cn("admin-input w-32 font-mono lowercase", !primaryValid && "border-state-danger/50")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-silver-500">Secondary hex</span>
          <input
            value={secondaryDraft}
            onChange={(e) => {
              setSecondaryDraft(e.target.value);
              commit(primaryDraft, e.target.value);
            }}
            placeholder="#a67c3d"
            spellCheck={false}
            className={cn("admin-input w-32 font-mono lowercase", !secondaryValid && "border-state-danger/50")}
          />
        </div>
      </div>

      {(!primaryValid || !secondaryValid) && (
        <span className="flex w-full items-center gap-1.5 text-[11px] text-state-danger">
          <TriangleAlert size={12} /> Enter valid hex colors, e.g. #d4af6a or #fff.
        </span>
      )}
    </div>
  );
}
