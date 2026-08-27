import type { AccentToken } from "@/types";

// Controlled design-token → color resolution. Admins may only select an
// AccentToken; they never enter raw hex, CSS, or dimensions. This map is
// the single source of truth for what each token renders as.
export interface AccentPalette {
  token: AccentToken;
  label: string;
  primary: string;
  secondary: string;
  soft: string; // low-opacity tint for surfaces
  ring: string; // border/ring color
  glow: string; // radial glow color (drop shadow / wash)
}

export const ACCENT_MAP: Record<AccentToken, AccentPalette> = {
  slate: {
    token: "slate",
    label: "Slate",
    primary: "#9fadb6",
    secondary: "#4a5a66",
    soft: "rgba(159,173,182,0.14)",
    ring: "rgba(159,173,182,0.35)",
    glow: "rgba(159,173,182,0.45)",
  },
  teal: {
    token: "teal",
    label: "Teal",
    primary: "#4fd6ca",
    secondary: "#1c6e73",
    soft: "rgba(79,214,202,0.14)",
    ring: "rgba(79,214,202,0.35)",
    glow: "rgba(79,214,202,0.5)",
  },
  gold: {
    token: "gold",
    label: "Gold",
    primary: "#e7c98a",
    secondary: "#a67c3d",
    soft: "rgba(231,201,138,0.14)",
    ring: "rgba(231,201,138,0.38)",
    glow: "rgba(231,201,138,0.5)",
  },
  azure: {
    token: "azure",
    label: "Azure",
    primary: "#6db3f2",
    secondary: "#2c5c96",
    soft: "rgba(109,179,242,0.14)",
    ring: "rgba(109,179,242,0.35)",
    glow: "rgba(109,179,242,0.48)",
  },
  violet: {
    token: "violet",
    label: "Violet",
    primary: "#b6a4f2",
    secondary: "#5b4696",
    soft: "rgba(182,164,242,0.14)",
    ring: "rgba(182,164,242,0.35)",
    glow: "rgba(182,164,242,0.48)",
  },
  emerald: {
    token: "emerald",
    label: "Emerald",
    primary: "#7fd8ac",
    secondary: "#2c7a54",
    soft: "rgba(127,216,172,0.14)",
    ring: "rgba(127,216,172,0.35)",
    glow: "rgba(127,216,172,0.48)",
  },
  rose: {
    token: "rose",
    label: "Rose",
    primary: "#f0a8b4",
    secondary: "#9a4a5c",
    soft: "rgba(240,168,180,0.14)",
    ring: "rgba(240,168,180,0.35)",
    glow: "rgba(240,168,180,0.48)",
  },
};

export function resolveAccent(token: AccentToken): AccentPalette {
  return ACCENT_MAP[token] ?? ACCENT_MAP.slate;
}

export const ACCENT_TOKENS: AccentToken[] = Object.keys(ACCENT_MAP) as AccentToken[];

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value.trim());
}

/** Builds an AccentPalette from an admin-entered hex pair. Soft/ring/glow
 * tints are derived via `color-mix`, so a single validated hex value is all
 * that's needed to produce every surface this app renders with an accent. */
export function paletteFromHex(primaryHex: string, secondaryHex?: string): AccentPalette {
  const primary = primaryHex.trim();
  const secondary = secondaryHex && isValidHex(secondaryHex) ? secondaryHex.trim() : primary;
  return {
    token: "slate",
    label: "Custom",
    primary,
    secondary,
    soft: `color-mix(in oklab, ${primary} 16%, transparent)`,
    ring: `color-mix(in oklab, ${primary} 38%, transparent)`,
    glow: `color-mix(in oklab, ${primary} 50%, transparent)`,
  };
}

interface HexColorEntity {
  primaryColor?: string;
  secondaryColor?: string;
  accent?: AccentToken;
}

/** Resolves the accent palette to actually render for a firm or application:
 * prefers the entity's own hex colors (as set via the admin hex inputs),
 * falling back to the legacy token map only when no valid hex is present. */
export function accentOf(entity: HexColorEntity): AccentPalette {
  if (entity.primaryColor && isValidHex(entity.primaryColor)) {
    return paletteFromHex(entity.primaryColor, entity.secondaryColor);
  }
  return resolveAccent(entity.accent ?? "slate");
}
