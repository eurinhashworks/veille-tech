---
description: Workflow for a deep code quality audit
---

# Workflow: Code Quality Analysis

Follow these steps to audit and improve the quality of a file or module.

1. **Static Analysis**:
   - Check for linting errors using any available tools (ESLint, Prettier).
   - Run Type Checking: `pnpm exec tsc --noEmit` to ensure no TypeScript errors.

2. **Code Style & Structure**:
   - Check if the file follows kebab-case naming (for files) and PascalCase (for components).
   - Ensure imports are organized and no unused variables exist.
   - Verify that the file is not excessively long (ideally under 300 lines).

3. **Validation**:
   - Run unit tests for the specific module: `pnpm vitest run <file_pattern>`.
   - Verify that all exported functions have clear TypeScript signatures.

4. **Security & Performance**:
   - Look for unsafe `dangerouslySetInnerHTML` or hardcoded secrets.
   - Check for unnecessary re-renders in React components.
