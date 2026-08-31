import type { Application, OneAskConfig } from "@/types";

export interface SearchResult {
  app: Application;
  firmName: string;
  score: number;
}

function norm(s: string) {
  return s.toLowerCase().trim();
}

export function searchApplications(config: OneAskConfig, rawQuery: string): SearchResult[] {
  const query = norm(rawQuery);
  const firmsById = Object.fromEntries(config.firms.map((f) => [f.id, f]));

  const active = config.applications.filter((a) => a.isActive);

  if (!query) {
    return active
      .filter((a) => a.isFeatured)
      .map((app) => ({
        app,
        firmName: firmsById[app.firmId]?.shortName ?? "",
        score: 1,
      }))
      .slice(0, 8);
  }

  const results: SearchResult[] = [];

  for (const app of active) {
    const firm = firmsById[app.firmId];
    let score = 0;

    if (norm(app.name) === query) score += 100;
    else if (norm(app.name).startsWith(query)) score += 60;
    else if (norm(app.name).includes(query)) score += 35;

    if (app.aliases.some((a) => norm(a) === query)) score += 90;
    else if (app.aliases.some((a) => norm(a).includes(query))) score += 30;

    if (app.tags.some((t) => norm(t).includes(query))) score += 20;
    if (firm && norm(firm.name).includes(query)) score += 12;
    if (norm(app.description).includes(query)) score += 8;

    if (score > 0) {
      results.push({
        app,
        firmName: firm?.shortName ?? "",
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.app.displayOrder - b.app.displayOrder).slice(0, 20);
}
