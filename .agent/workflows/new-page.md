---
description: Workflow for creating a new page or feature in TechPulse AI
---

# Workflow: New Page / Feature Creation

Follow these steps to ensure a high-quality, "premium" implementation for a new page or feature.

1. **Analysis and Planning**:
   - Check `docs/04-architecture.md` and `docs/06-composants.md` for existing structure.
   - Define the new page route in `App.tsx` (using React Router).
   - List required components and check if any can be reused from `components/`.

2. **Component Breakdown**:
   - Create a directory for the page in `pages/` (if it's a full page).
   - Create sub-components in `components/` if they are reusable.
   - Use PascalCase for component filenames and directory names.

3. **Styling (Premium Aesthetics)**:
   - Use Tailwind CSS for rapid styling.
   - Apply "glassmorphism" effects where appropriate (subtle transparency, blur).
   - Use smooth transitions with `framer-motion`.
   - Ensure dark mode compatibility.

4. **Integration**:
   - Connect the page to existing services (e.g., `geminiService.ts`, `api/`).
   - Use `prisma` for any new data requirements (refer to `db-update.md` if needed).

5. **Polish and SEO**:
   - Add proper meta tags and titles.
   - Use `PageHeader` or similar components for consistency.
   - Verify responsiveness on mobile/tablet.
