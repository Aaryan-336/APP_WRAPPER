# UI/UX Design System

## Visual Direction
**Premium fintech × modern productivity workspace × controlled Pinterest masonry**

Avoid:
- Traditional intranet layouts
- Generic admin dashboards
- Dense tables as primary user UI
- Random rainbow cards
- Uncontrolled Pinterest waterfall behavior

Prefer:
- Neutral premium base
- Generous spacing
- Strong typography
- High-quality logos
- Controlled asymmetric masonry
- Soft gradients
- Subtle glass surfaces
- Low-contrast borders
- Fluid motion

## Information Hierarchy

### Level 1: Subfirm Selection
Desktop starts with three large branded subfirm identities. These are the visual hero.

Each subfirm card contains:
- Large official logo
- Optional short descriptor
- Brand accent
- Minimal affordance to enter

### Level 2: Firm Workspace
After expansion:
- Firm logo remains as shared visual anchor.
- Department grid appears below.
- Global search remains available.
- Firm switcher allows switching among the three subfirms.

### Level 3: Department
Each department has:
- Circular department mark/logo
- Department name
- Optional definition/tagline
- Accent token
- Application count
- Controlled card size/template

### Level 4: Application
Application cards contain:
- App icon/logo
- Name
- Short description
- Department context where needed
- Launch affordance
- Optional quick actions

## Desktop Department Masonry
Use CSS Grid with controlled spans rather than uncontrolled masonry.

Allowed templates:
- `hero`: 2 columns × 2 rows
- `wide`: 2 columns × 1 row
- `tall`: 1 column × 2 rows
- `standard`: 1 column × 1 row
- `rich`: standard/large card showing selected application previews

Admin chooses a template. The layout engine validates balance.

## Mobile Department Masonry
Use:
- Two-column asymmetric layout where screen width permits.
- Single-column layout on very narrow devices.
- Circular department mark at the top-left of each card.
- Reduced text density.
- Large touch targets.

The circular mark is used for visual bifurcation, but never rely only on color. Every department must also have a readable name.

## Application Pages
Department pages should feel immersive:
1. Brand transition fills the viewport.
2. Department logo and name establish the destination.
3. Description appears.
4. Application cards reveal with restrained stagger.
5. Search/filter is available for large departments.

## Search
Make search a major interaction:
- Desktop shortcut: Ctrl/Cmd + K
- Mobile: dedicated search destination
- Search application name, aliases, department, and tags
- Results show department identity
