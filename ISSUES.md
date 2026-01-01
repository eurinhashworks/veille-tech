# Audit Findings

## Architectural Issues
- **Logic in API Routes**: `app/api/search/route.ts` contains significant business logic (building complex Prisma queries) that should be in a service layer. This pattern is likely repeated in other API routes.
- **Service Organization**: `lib/server/services/ml` is quite large. General services should be organized in `lib/services`.
- **Security**: `next.config.mjs` allows images from any domain (`**`), which is a security risk.

## Anti-patterns
- **Use of `any`**: Found 44 occurrences of `: any` or `as any` in the codebase, particularly in API routes (`app/api/search/route.ts`, `app/api/trends/route.ts`).
- **Missing `"use client"`**: several components using `useState` or `useEffect` lack the `"use client"` directive:
    - `components/Toast.tsx`
    - `components/NotificationCenter.tsx`
    - `components/CommentsSection.tsx`
    - `components/Stats.tsx`
    - `components/Sidebar.tsx`
- **Use of `<img>` tags**: `next/image` should be used for optimization. Found in:
    - `components/Sidebar.tsx`
    - `components/landing/LandingNav.tsx`
    - `components/landing/LandingFooter.tsx`
    - `components/CommentsSection.tsx`

## Dependencies
- **Next.js Version**: `package.json` specifies `"next": "^16.1.1"`, which seems to be a bleeding-edge or incorrect version (current stable is 15.x).

## Performance
- **Heavy Libraries**: `framer-motion`, `d3`, `recharts`, `visx`, `tensorflow.js` are all included. Need to ensure they are tree-shaken or lazy-loaded where appropriate.
