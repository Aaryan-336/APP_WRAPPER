# Firm Hub PWA — Build Documentation

## Purpose
Firm Hub is a premium, highly animated Progressive Web App that acts as the single entry point to the firm's applications.

The product hierarchy is:

**Firm Group → Subfirm → Department → Application**

There are three major subfirms. On desktop, the experience begins with three large branded logos/cards. Selecting a subfirm triggers a fluid shared-element expansion into that firm's workspace. Inside the firm workspace, departments are displayed in a controlled Pinterest-style masonry layout. Selecting a department triggers a signature full-screen brand-color transition originating from the department's circular logo. The department then reveals its application links.

## Primary Product Goals
1. Make the UI feel like a premium internal product rather than a corporate intranet.
2. Prioritize animation, visual hierarchy, responsiveness, and motion continuity.
3. Keep the backend intentionally lightweight.
4. Make subfirms, departments, applications, ordering, branding, and launch behavior configurable from admin.
5. Support desktop, tablet, and mobile as intentionally designed experiences.
6. Support PWA installation on firm desktops and phones.

## Recommended Stack
- React
- TypeScript
- Tailwind CSS
- shadcn/ui project structure
- lucide-react
- Motion for React / Framer Motion-compatible animation layer
- View Transitions API where appropriate
- Minimal REST/JSON backend or static configuration for MVP
- PWA manifest + service worker

## Suggested Route Structure
```text
/
├── /firm/:firmSlug
├── /firm/:firmSlug/department/:departmentSlug
├── /search
├── /favorites
├── /admin
│   ├── /firms
│   ├── /departments
│   ├── /applications
│   └── /appearance
└── /offline
```

Read the remaining documents in this order:
1. `ARCHITECTURE.md`
2. `UI_UX_SYSTEM.md`
3. `MOTION_SYSTEM.md`
4. `RESPONSIVE_DESIGN.md`
5. `DATA_MODEL.md`
6. `ADMIN_CONFIGURATION.md`
7. `PWA_AND_LAUNCH_BEHAVIOR.md`
8. `COMPONENT_INTEGRATION.md`
9. `BUILD_PROMPT.md`
