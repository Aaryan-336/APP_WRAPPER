# Responsive Design

## Principle
Do not shrink the desktop UI into mobile. Preserve the same hierarchy while intentionally changing composition.

## Desktop
Primary experience:
- Three large subfirm identities on landing.
- Spacious search.
- Controlled masonry.
- Large typography.
- Hover interactions.
- Keyboard shortcuts.

## Tablet
- Two or three-column adaptive layout.
- Touch-first interactions.
- Reduced decorative density.
- Search remains prominent.

## Mobile
- Compact header.
- Firm cards stack or use controlled large cards.
- Department cards can use a two-column asymmetric masonry layout.
- Circular department logo sits top-left for fast visual recognition.
- Use a bottom navigation if the product has enough destinations:
  - Home
  - Departments
  - Search
  - Favorites
  - Profile

## Breakpoint Strategy
Do not tie design to exact device names. Use content-driven breakpoints. A reasonable initial approach:
```text
small      < 640px
medium     640–1023px
large      1024–1439px
xlarge     >= 1440px
```

## Touch Rules
- Minimum practical touch target: 44×44px.
- No hover-only functionality.
- Tap state should give immediate feedback.
- Animations must remain smooth during scrolling.
- Avoid fixed elements that consume too much vertical mobile space.

## Mobile Card Content
Prefer:
- circular mark
- department name
- app count
- arrow

Optional descriptions can be omitted or shortened on smaller cards.
