import { useRef, useState } from "react";
import { Link2, Trash2, TriangleAlert, Upload } from "lucide-react";
import { fileToLogoDataUrl, ImageProcessingError } from "@/lib/image";
import { cn } from "@/lib/utils";

interface LogoUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  fallback: React.ReactNode;
  shape?: "circle" | "square";
  maxDimension?: number;
}

/** Logo editor used for firms and applications: upload an
 * image from disk (resized + re-encoded client-side) or paste a hosted
 * image URL. Falls back to the caller's icon/monogram preview when unset. */
export function LogoUpload({ value, onChange, fallback, shape = "circle", maxDimension = 320 }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState(value && !value.startsWith("data:") ? value : "");
  const [showUrlField, setShowUrlField] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await fileToLogoDataUrl(file, maxDimension);
      onChange(dataUrl);
      setUrlDraft("");
    } catch (err) {
      setError(err instanceof ImageProcessingError ? err.message : "Couldn't process that image.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-start gap-3.5">
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-overlay/10 bg-navy-800",
          shape === "circle" ? "rounded-full" : "rounded-xl",
        )}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          fallback
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="focus-ring flex items-center gap-1.5 rounded-lg border border-overlay/10 px-3 py-1.5 text-xs font-medium text-silver-300 transition-all duration-150 hover:border-overlay/20 hover:text-silver-100 active:scale-[0.96] disabled:opacity-50"
          >
            <Upload size={13} /> {busy ? "Processing…" : "Upload image"}
          </button>
          <button
            type="button"
            onClick={() => setShowUrlField((v) => !v)}
            className="focus-ring flex items-center gap-1.5 rounded-lg border border-overlay/10 px-3 py-1.5 text-xs font-medium text-silver-400 transition-all duration-150 hover:border-overlay/20 hover:text-silver-200 active:scale-[0.96]"
          >
            <Link2 size={13} /> Use URL
          </button>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setUrlDraft("");
                setError(null);
              }}
              className="focus-ring flex items-center gap-1.5 rounded-lg border border-overlay/10 px-3 py-1.5 text-xs font-medium text-state-danger transition-all duration-150 hover:border-state-danger/40 active:scale-[0.96]"
            >
              <Trash2 size={13} /> Remove
            </button>
          )}
        </div>

        {showUrlField && (
          <input
            value={urlDraft}
            onChange={(e) => {
              setUrlDraft(e.target.value);
              onChange(e.target.value.trim() || undefined);
            }}
            placeholder="https://example.com/logo.png"
            className="admin-input font-mono text-xs"
          />
        )}

        {error && (
          <span className="flex items-center gap-1.5 text-[11px] text-state-danger">
            <TriangleAlert size={12} /> {error}
          </span>
        )}
        <p className="text-[11px] text-silver-500">PNG, JPEG, or WEBP · resized automatically · or paste a URL.</p>
      </div>
    </div>
  );
}
