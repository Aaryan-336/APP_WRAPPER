# Architecture

## Core Principle
The frontend must be a **presentation and interaction engine**. It should know how to render firms, departments, and applications, but it must not hardcode which ones exist.

```text
Configuration
      ↓
Firms
      ↓
Departments
      ↓
Applications
      ↓
Frontend renders configured experience
```

## Recommended Entity Hierarchy

```text
Firm Group
├── Subfirm A
│   ├── Department A
│   │   ├── Application 1
│   │   └── Application 2
│   └── Department B
├── Subfirm B
└── Subfirm C
```

## Frontend Responsibilities
- Render the three subfirm landing experiences.
- Animate shared elements between firm selection and firm workspace.
- Render department masonry layouts from controlled configuration.
- Execute department brand-color transitions.
- Render applications and launch behavior.
- Handle responsive layouts.
- Cache core shell/configuration for PWA use.
- Respect `prefers-reduced-motion`.

## Minimal Backend Responsibilities
The backend can be very small:
- Return configuration.
- Authenticate admin users if required.
- Allow CRUD for firms, departments, sections, and applications.
- Store user favorites/recent applications only if personalization is required.
- Optionally store usage analytics.

## Suggested API Shape
```text
GET  /api/firms
GET  /api/firms/:slug
GET  /api/departments/:slug
GET  /api/applications
POST /api/admin/firms
POST /api/admin/departments
POST /api/admin/applications
PATCH /api/admin/...
DELETE /api/admin/...
```

For an MVP, all public display data can initially come from one versioned JSON configuration document. The UI should be designed so replacing that source with an API later requires no component redesign.

## Important Design Constraint
Do not allow admin users to freely create arbitrary layouts. Admin configuration should select from controlled design tokens and card templates. This protects the premium visual identity.
