# PWA and Application Launch Behavior

## PWA Requirements
- Web app manifest.
- Installable desktop and mobile experience.
- App icons and theme colors.
- Offline fallback.
- Cache app shell and configuration where appropriate.
- Fast repeat startup.
- Responsive viewport handling.

## Important Reality: External Links
A web PWA cannot guarantee that every external website remains visually embedded inside the PWA.

Use configurable launch modes:

### 1. Embedded
Attempt to render the destination inside an internal app shell.

Best for:
- Internal applications designed to allow embedding.

May fail because of:
- `X-Frame-Options`
- `Content-Security-Policy`
- authentication/cookie restrictions

### 2. Same Window
Navigate the current app window to the destination.

Use when:
- You want to avoid a new browser tab.
- The platform/browser PWA behavior supports retaining the current window context.

Test this on the target desktop browsers and mobile operating systems.

### 3. External
Open normally when the destination cannot work internally.

## Recommended App Shell
When embedded:
```text
Back | Firm Hub / Department / App Name | Fullscreen
----------------------------------------------------
Destination application content
```

The admin chooses launch mode per application, with a fallback mode.

## Security
Do not proxy arbitrary third-party applications through your server merely to bypass embedding restrictions. Respect destination security policies.
