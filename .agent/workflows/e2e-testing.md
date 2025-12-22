---
description: Workflow for running and writing E2E tests using Playwright
---

# Workflow: E2E Testing (Playwright)

Use this workflow to ensure core user flows are functional and regression-free.

1. **Test Environment**:
   - Ensure the development server is running: `pnpm run dev`.
   - Verify Playwright is installed: `pnpm exec playwright --version`.

2. **Core Flows to Test**:
   - **Authentication**: Login/Logout (if applicable).
   - **Review Generation**: Trigger Gemini, wait for response, verify metadata display.
   - **Navigation**: Switching between Timeline, Analytics, and Search.

3. **Running Tests**:
   - Run all tests: `pnpm exec playwright test`.
   - Run specific test: `pnpm exec playwright test <test_file>`.
   - Use UI mode for debugging: `pnpm exec playwright test --ui`.

4. **Maintenance**:
   - Update tests when UI selectors change.
   - Ensure tests are resilient by using `data-testid` attributes where possible.
