import type { Application, AskOneConfig, Firm } from "@/types";

// ---------------------------------------------------------------------------
// Blank-slate configuration. This stands in for a future `GET /api/config`
// response. Every component reads from this shape only — nothing about any
// specific firm or application is hardcoded into rendering logic.
//
// The three firm slots below are placeholders: the app's landing experience
// always shows three firm cards, so these exist to be renamed rather than
// created. Configure everything (names, branding, applications) from
// /admin — no mock data ships with this build.
// ---------------------------------------------------------------------------

export const FIRMS: Firm[] = [
  {
    id: "firm-1",
    name: "Firm One",
    shortName: "Firm 1",
    slug: "firm-1",
    monogram: "F1",
    tagline: "Configure this firm in Admin",
    description: "Set a name, description, logo, and accent color for this firm from the admin panel.",
    accent: "slate",
    primaryColor: "#9fadb6",
    secondaryColor: "#4a5a66",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "firm-2",
    name: "Firm Two",
    shortName: "Firm 2",
    slug: "firm-2",
    monogram: "F2",
    tagline: "Configure this firm in Admin",
    description: "Set a name, description, logo, and accent color for this firm from the admin panel.",
    accent: "slate",
    primaryColor: "#9fadb6",
    secondaryColor: "#4a5a66",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "firm-3",
    name: "Firm Three",
    shortName: "Firm 3",
    slug: "firm-3",
    monogram: "F3",
    tagline: "Configure this firm in Admin",
    description: "Set a name, description, logo, and accent color for this firm from the admin panel.",
    accent: "slate",
    primaryColor: "#9fadb6",
    secondaryColor: "#4a5a66",
    displayOrder: 3,
    isActive: true,
  },
];

export const APPLICATIONS: Application[] = [];

export const ASK_ONE_CONFIG: AskOneConfig = {
  firms: FIRMS,
  applications: APPLICATIONS,
};

export function activeFirms(): Firm[] {
  return [...FIRMS].filter((f) => f.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function applicationsForFirm(firmId: string): Application[] {
  return APPLICATIONS.filter((a) => a.firmId === firmId && a.isActive).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
}

export function findFirmBySlug(slug: string): Firm | undefined {
  return FIRMS.find((f) => f.slug === slug);
}

export function appCountForFirm(firmId: string): number {
  return APPLICATIONS.filter((a) => a.firmId === firmId && a.isActive).length;
}
