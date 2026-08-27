// ASK ONE — Configuration-driven data model
// Everything the UI renders (firms, applications, branding, ordering,
// launch behavior) flows from these types. No product data is ever
// hardcoded into rendering logic.

export type AccentToken =
  | "slate"
  | "teal"
  | "gold"
  | "azure"
  | "violet"
  | "emerald"
  | "rose";

export type CardTemplate = "hero" | "wide" | "tall" | "standard" | "rich";

export type LaunchMode = "embedded" | "same-window" | "external";
export type FallbackLaunchMode = "same-window" | "external";

export interface Firm {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  logoUrl?: string;
  monogram: string;
  tagline: string;
  description: string;
  accent: AccentToken;
  primaryColor: string;
  secondaryColor: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Application {
  id: string;
  firmId: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  icon: string; // lucide icon name — used only when logoUrl is not set
  logoUrl?: string; // uploaded app logo image; takes priority over icon
  accent: AccentToken;
  primaryColor: string;
  secondaryColor: string;
  cardTemplate: CardTemplate;
  tags: string[];
  aliases: string[];
  launchMode: LaunchMode;
  fallbackLaunchMode: FallbackLaunchMode;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface AskOneConfig {
  firms: Firm[];
  applications: Application[];
}
