# Motion System

## Motion Philosophy
Motion must communicate navigation and hierarchy. It should never exist merely for decoration.

The app should feel like one continuous physical environment.

## Signature Transition: Department Color Fill

### Entry Sequence
1. User taps/clicks a department card.
2. Card gives immediate scale/press feedback.
3. Circular department logo becomes the transition origin.
4. Department accent expands radially from the logo.
5. Layered gradient/wash covers the application.
6. Department identity appears.
7. Application content reveals in sequence.

Recommended target duration: **600–850ms total**.

Suggested choreography:
```text
0ms   press feedback
80ms  logo activation
150ms radial color expansion
350ms screen mostly covered
500ms destination shell begins reveal
700ms content settles
```

Do not use a cheap hard cut to a solid color. Use the department's primary and secondary brand tones to create depth.

## Reverse Transition
Back navigation should preserve spatial continuity:
- Department content exits first.
- Brand wash contracts.
- Transition resolves toward the original department mark/card.
- Original masonry context is restored.

## Subfirm Expansion
Clicking one of the three subfirms should:
1. Preserve the selected logo as a shared element.
2. Allow the selected card/logo to expand into the firm workspace.
3. Fade or reposition the other two firms.
4. Reveal the firm workspace and department cards.

## Application Reveal
Application cards may use a restrained stagger:
- 30–60ms offset per item
- Maximum visual sequence should remain quick
- Avoid long cascading waits

## Desktop Hover
Allowed:
- 1.01–1.03 scale
- subtle elevation
- accent intensity increase
- arrow movement
- extremely subtle cursor-reactive translation

Avoid:
- excessive 3D rotations
- bouncy animation
- long easing
- repeated ambient motion that distracts

## Performance Rules
Prefer animating:
- `transform`
- `opacity`

Use `clip-path`, masks, or radial techniques carefully and test lower-end devices.

Preload destination data before the transition completes.

Always support:
```css
@media (prefers-reduced-motion: reduce)
```
Reduced-motion mode should use short fades with no large radial expansion.
