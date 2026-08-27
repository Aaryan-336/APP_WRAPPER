import { DynamicIcon } from "@/components/ui/icon";
import type { LucideProps } from "lucide-react";

interface AppIconProps extends Omit<LucideProps, "name"> {
  icon: string;
  logoUrl?: string;
  name: string;
}

/** Renders an application's uploaded logo image when present, else its
 * configured lucide icon. When used for the logo, the parent element should
 * be sized with `overflow-hidden` — the image fills it edge to edge. */
export function AppIcon({ icon, logoUrl, name, size, className }: AppIconProps) {
  if (logoUrl) {
    return <img src={logoUrl} alt="" title={name} className="h-full w-full object-cover" />;
  }
  return <DynamicIcon name={icon} size={size} className={className} />;
}
