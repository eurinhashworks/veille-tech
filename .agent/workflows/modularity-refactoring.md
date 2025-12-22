---
description: Workflow for refactoring code into modular services, components, and hooks
---

# Workflow: Modularity & Refactoring

Use this workflow to break down monolithic files into modular, maintainable pieces.

1. **Identification**:
   - Find files with mixed concerns (e.g., UI + API calls + State logic).
   - Identify reusable logic that can be extracted.

2. **Extraction**:
   - **Services**: Move API/Business logic to `services/*.ts`.
   - **Hooks**: Move React state/effect logic to `hooks/*.ts`.
   - **Sub-components**: Break large components into smaller, focused ones in `components/`.

3. **Interface Definition**:
   - Define clear TypeScript interfaces for the new modules.
   - Use dependency injection or clean prop passing to connect them.

4. **Verification**:
   - Ensure the new structure doesn't break existing functionality.
   - Run tests to confirm that refactored logic still works as expected.
