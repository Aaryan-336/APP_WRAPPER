# Required Component Integration

## Required Project Structure
This project should support:
- shadcn/ui-style structure
- Tailwind CSS
- TypeScript

The expected default component path is:
```text
/components/ui
```

If the existing project does not have `/components/ui`, create it. This matters because the provided component and shadcn-style imports expect a predictable shared UI location. The provided demo imports:
```ts
@/components/ui/glassmorphism-cta
```

Also ensure the `@/*` alias resolves correctly.

## Setup If Needed
For a project that does not already support the required stack:

```bash
npx shadcn@latest init
npm install lucide-react
```

If TypeScript is not configured, initialize/migrate the React project to TypeScript before integrating the component.

For Tailwind, follow the current shadcn/Tailwind setup used by the project. Do not duplicate Tailwind imports if they already exist.

## File
Create:
```text
/components/ui/glassmorphism-cta.tsx
```

Paste this component exactly:

```tsx
import type { AnchorHTMLAttributes, CSSProperties } from "react";
import { WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type GlassmorphismCtaProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  spread?: string;
  shimmerColor?: string;
  speed?: string;
};

export default function GlassmorphismCta({
  label = "Generate My Site",
  avatarSrc = "https://cdn.21st.dev/assets/localized/74b60d947205758ebb300e9b584c6d5a8e41be777b920890a34973cbe08ef163.jpg",
  avatarAlt = "Advisor headshot",
  spread = "90deg",
  shimmerColor = "rgba(255,255,255,0.6)",
  speed = "4s",
  className,
  href = "#",
  onClick,
  ...props
}: GlassmorphismCtaProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        if (href === "#") event.preventDefault();
        onClick?.(event);
      }}
      className={cn(
        "group isolate inline-flex cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(129,140,248,0.35)] rounded-full relative shadow-[0_8px_40px_rgba(129,140,248,0.25)]",
        className,
      )}
      style={
        {
          "--spread": spread,
          "--shimmer-color": shimmerColor,
          "--radius": "9999px",
          "--speed": speed,
          "--cut": "1px",
          "--bg": "rgba(255, 255, 255, 0.05)",
        } as CSSProperties
      }
      {...props}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-[-200%] w-[400%] h-[400%] [animation:rotate-gradient_var(--speed)_linear_infinite]">
          <div className="absolute inset-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      <div className="absolute rounded-full [background:var(--bg)] [inset:var(--cut)] backdrop-blur" />
      <div
        className="z-10 flex gap-3 sm:w-auto overflow-hidden text-base font-medium text-white w-full pt-3 pr-4 pb-3 pl-4 relative items-center"
        style={{ borderRadius: "9999px" }}
      >
        <div
          className="absolute"
          style={{
            width: "200%",
            height: "200%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), rgba(255,255,255,0.2), rgba(255,255,255,0.2), rgba(255,255,255,0.2), transparent)",
            animation: "borderBeamRotation 4s infinite linear",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute"
          style={{
            inset: "1px",
            background: "rgba(10, 11, 20, 0.8)",
            borderRadius: "9999px",
            backdropFilter: "blur(8px)",
          }}
        />
        <img
          src={avatarSrc}
          alt={avatarAlt}
          className="ring-2 ring-white/10 z-10 w-8 h-8 object-cover rounded-full relative"
        />
        <span className="whitespace-nowrap relative z-10 font-sans">
          {label}
        </span>
        <span className="inline-flex items-center justify-center z-10 bg-white/10 w-7 h-7 rounded-full ml-1 relative">
          <WandSparkles
            className="w-[24px] h-[16px] text-white"
            strokeWidth={1.5}
          />
        </span>
      </div>
    </a>
  );
}
```

## Demo
```tsx
import GlassmorphismCta from "@/components/ui/glassmorphism-cta";

export default function Default() {
  return (
    <div className="grid min-h-screen w-full place-items-center bg-[#0a0b14]">
      <GlassmorphismCta label="Generate My Site" />
    </div>
  );
}
```

## Tailwind 4 CSS
Extend the existing main stylesheet (often `app/globals.css`, `src/index.css`, or the project's configured global stylesheet) with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@keyframes rotate-gradient {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes borderBeamRotation {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
```

If the project uses Tailwind 3, place equivalent keyframes in the Tailwind configuration or existing global CSS according to the project setup.

## Best Use in This Product
Do not use the supplied CTA as a generic button everywhere. Use it sparingly for high-value actions, such as:
- Enter selected subfirm
- Explore featured department
- Open a featured application
- Admin preview/demo action

The visual style is intentionally premium and should remain a signature accent.

## Integration Checklist
- Confirm `@/lib/utils` exports `cn`.
- Confirm `@/*` alias works.
- Install `lucide-react`.
- Ensure global keyframes exist.
- Replace stock avatar only where the product requires a real contextual image.
- Prefer approved logos and brand assets for production.
