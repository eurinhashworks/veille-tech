# Rule: Project Structure and Conventions

Maintain a clean and consistent project structure.

## File Naming
- **Components**: PascalCase (e.g., `ReviewCard.tsx`).
- **Hooks/Services/Utils**: camelCase (e.g., `useAuth.ts`, `geminiService.ts`).
- **Files/Directories**: kebab-case for non-component files (e.g., `db-update.md`).

## Coding Standards
- **TypeScript**: Mandatory for all new code. Use strict typing.
- **React**: Use functional components and hooks. Prefer React 19 features where applicable.
- **Styles**: Use Tailwind CSS classes. Avoid inline styles.
- **Prisma**: Use the prisma client for all database operations. Avoid raw SQL.

## Organization
- Pages go in `pages/`.
- Reusable components go in `components/`.
- Business logic goes in `services/`.
- Database schemas go in `prisma/`.

## Modularity & Quality Rules
- **Single Responsibility**: Each file should have one primary responsibility (e.g., one component, one service).
- **Maximum File Length**: Aim for < 300 lines for components and < 500 lines for services. If longer, refactor.
- **Explicit Exports**: Prefer named exports over default exports for better traceability and refactoring support.
- **Documentation**: All complex logic in services must have concise JSDoc comments explaining parameters and return values.

## Research & API Rules
- **Evidence-Based Integration**: No new API or tool should be added without a prior research report documenting its benefits and security status.
- **Privacy First**: Ensure any third-party API chosen complies with basic data privacy rules. Never send un-sanitized user data to unknown APIs.
- **Modular Integration**: New APIs must always have a dedicated service in `services/` and appropriate type definitions in `types/`.
