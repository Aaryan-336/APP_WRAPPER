# Configurable Data Model

## Firm
```ts
type Firm = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description?: string;
  primaryColor: string;
  secondaryColor?: string;
  displayOrder: number;
  isActive: boolean;
};
```

## Department
```ts
type Department = {
  id: string;
  firmId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  icon?: string;
  definition?: string;
  description?: string;
  primaryColor: string;
  secondaryColor?: string;
  cardTemplate: "hero" | "wide" | "tall" | "standard" | "rich";
  displayOrder: number;
  isActive: boolean;
};
```

## Department Section
Optional grouping inside large departments.

```ts
type DepartmentSection = {
  id: string;
  departmentId: string;
  name: string;
  description?: string;
  displayOrder: number;
};
```

## Application
```ts
type Application = {
  id: string;
  firmId: string;
  departmentId: string;
  sectionId?: string;
  name: string;
  slug: string;
  description?: string;
  url: string;
  iconUrl?: string;
  iconName?: string;
  tags: string[];
  aliases: string[];
  launchMode: "embedded" | "same-window" | "external";
  fallbackLaunchMode: "same-window" | "external";
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
};
```

## Appearance Tokens
Do not store arbitrary CSS from admins. Store controlled tokens:
```ts
type AccentToken =
  | "slate"
  | "blue"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";
```

A design-system map resolves these tokens to actual colors, gradients, shadows, and motion values.
