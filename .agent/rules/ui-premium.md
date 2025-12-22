# Rule: UI Premium Aesthetics

TechPulse AI aims for a "premium," state-of-the-art visual experience. Follow these guidelines for all UI work.

## Core Principles
- **Modern Palette**: Use deep blues, soft greens, and calibrated dark modes. Avoid basic high-contrast colors.
- micro-interactions**: Use `framer-motion` for subtle hover effects, layout transitions, and entry animations.
- **Glassmorphism**: Use `backdrop-blur` and semi-transparent backgrounds for cards and navigation bars.
- **Typography**: Prefer modern sans-serif fonts (e.g., Inter, Montserrat). Ensure hierarchical sizing (h1, h2, etc.).

## Components
- **Radix UI / Headless UI**: Always prioritize accessible primitives over building from scratch.
- **Consistent Spacing**: Use Tailwind's spacing scale (e.g., `p-4`, `m-8`) strictly. No ad-hoc pixel values unless absolutely necessary.
- **Responsive by Design**: Every component must look perfect on mobile. Test with `sm:`, `md:`, and `lg:` prefixes.

## Prohibited
- No "standard" browser buttons or inputs without styling.
- No jagged transitions or abrupt state changes.
- No overwhelming or cluttered layouts. Use whitespace to let content breathe.
