# Copy-Paste Build Prompt

You are building a production-quality React + TypeScript PWA called **Firm Hub**.

## Stack and Structure
Use:
- React
- TypeScript
- Tailwind CSS
- shadcn/ui project conventions
- `/components/ui` for reusable UI primitives and custom shared components
- lucide-react for icons
- the existing `cn` utility from `@/lib/utils`
- a high-quality animation library compatible with React for complex shared-element and layout transitions
- native View Transitions API where beneficial, with graceful fallback
- PWA manifest and service-worker support

Before changing code, inspect the existing project structure and determine:
1. The global stylesheet path.
2. The existing components path.
3. Whether `/components/ui` exists.
4. Whether the `@/*` alias resolves.
5. Whether Tailwind is version 4 or version 3.
6. Whether TypeScript and shadcn-style conventions are already configured.

If `/components/ui` does not exist, create it because shared shadcn-style components must have a predictable reusable location.

## Product Hierarchy
The application hierarchy is:

Firm Group → 3 Subfirms → Departments → Applications

Everything displayed must be configuration-driven. Do not hardcode the actual firms, departments, or application links into rendering logic.

## Primary UI Goal
The UI is more important than backend complexity.

Create a premium internal product that feels like:
- premium fintech
- modern productivity workspace
- controlled Pinterest-style masonry
- high-end native application

Do NOT make it look like:
- SharePoint
- a generic corporate intranet
- a generic dashboard template
- a plain list of links

## Desktop Landing
Show exactly three large subfirm identities as the primary visual hero.

Each should have:
- prominent official logo
- controlled brand accent
- minimal supporting copy
- premium spacing
- subtle depth
- fluid hover state

When a subfirm is clicked, do not use an abrupt page change. Use a shared-element expansion:
1. Selected logo/card responds immediately.
2. Selected firm expands into the workspace.
3. Other firms fade or move away.
4. The selected firm identity becomes the new page header.
5. Departments animate into view.

## Firm Workspace
Render departments in a controlled Pinterest/masonry-inspired CSS grid.

Do not implement an uncontrolled waterfall layout. Use controlled card templates:
- hero
- wide
- tall
- standard
- rich

The admin can select a template, but cannot specify arbitrary pixel sizes or arbitrary CSS.

Desktop department cards should show:
- department identity
- name
- proper definition of what the department contains
- app count
- controlled accent
- optional preview content for rich cards

## Mobile
Create a separate intentional composition.

On mobile department cards:
- circular department logo/mark appears in the top-left
- department name remains clearly visible
- app count can be shown
- descriptions are reduced based on available card size
- use a two-column asymmetric layout where practical
- fall back to one column on very narrow screens

Do not rely only on color for department identification.

## Signature Department Transition
When a department is clicked, create a super-fluid transition.

The circular department logo must act as the visual origin.

Sequence:
1. Immediate press feedback.
2. Department mark activates.
3. Department primary/secondary logo colors expand radially from the mark.
4. A layered gradient/brand wash fills the entire application.
5. The destination department identity appears.
6. The department page content reveals smoothly.

The transition should feel like entering a physical space.

Target duration: approximately 600–850ms.

Do not flash a cheap solid-color screen.
Do not use long, slow animation.
Do not animate layout properties unnecessarily.

Prefer performant animation of transforms and opacity.

Back navigation should reverse the spatial story where technically practical.

Respect `prefers-reduced-motion` and provide short fade-based fallbacks.

## Department Page
After transition, show:
- department mark
- department name
- definition/description
- application sections where configured
- premium application cards
- search/filter for large departments
- smooth restrained card reveal

## Application Links
Every application has configurable launch behavior:
- embedded
- same-window
- external

Do not claim that every external site can be embedded. If an iframe is blocked by `X-Frame-Options`, `Content-Security-Policy`, authentication restrictions, or similar controls, use the configured fallback.

For embedded applications, provide an internal app shell with:
- back control
- breadcrumb/context
- app name
- optional fullscreen action

## Admin
Create admin configuration for:
- subfirms
- department definitions
- circular logos/icons
- approved accent tokens
- card templates
- ordering
- applications
- URLs
- app icons
- tags and aliases
- launch mode
- fallback launch mode
- active/maintenance status

Use drag-and-drop ordering where appropriate.

Do not give admins unrestricted design freedom. They should control content and approved options, not arbitrary fonts, colors, dimensions, or CSS.

## Search
Create a premium command-palette style search:
- desktop shortcut Ctrl/Cmd + K
- mobile dedicated search experience
- search name, aliases, department, description, and tags
- show department context in results

## Component Integration
Create `/components/ui/glassmorphism-cta.tsx` using the provided Glassmorphism CTA component exactly as specified in the integration documentation.

Install:
```bash
npm install lucide-react
```

Ensure `cn` is available from:
```ts
@/lib/utils
```

Extend the global Tailwind stylesheet with the required `rotate-gradient` and `borderBeamRotation` keyframes.

Use this CTA sparingly for premium, high-value actions. Do not replace every button with it.

## Responsive Quality Bar
The experience must be excellent at:
- large desktop
- laptop
- tablet
- mobile

Do not simply shrink desktop cards. Recompose the layout.

## Data
Start with mock configuration data and clean TypeScript types. Keep all UI components independent of the data source so the mock configuration can later be replaced with an API.

## Implementation Quality
- Strong TypeScript types
- Reusable components
- Clean component boundaries
- Accessible labels and keyboard support
- Semantic buttons and links
- No unnecessary dependencies
- Smooth 60fps-oriented animations
- Graceful reduced-motion mode
- No broken external link assumptions
- Production-quality loading and empty states

## Deliverables
Build the app in logical phases:
1. project inspection and setup
2. design tokens and app shell
3. three-subfirm landing experience
4. shared-element firm expansion
5. department masonry system
6. signature department color-fill transition
7. department application pages
8. responsive mobile experience
9. search
10. admin-configurable mock data layer
11. PWA setup
12. launch modes and fallback handling
13. accessibility and reduced-motion polish

Prioritize visual quality and motion polish over backend complexity.
