---
description: Workflow for automated research on vulnerabilities, best practices, and new tools
---

# Workflow: Automated Veille & Research

Use this workflow to perform deep research and generate technical reports on the state of the project's ecosystem.

1. **Vulnerability Research**:
   - Run `pnpm audit` to identify known issues in the current dependency tree.
   - Use the web search tool to find recent security advisories (last 6 months) for key packages: `@prisma/client`, `@google/genai`, `express`, `react`.

2. **Best Practices Audit**:
   - Search for "Modern React 19 best practices" and "Vite 6 production optimization".
   - Compare current implementation in `server/index.ts` and `App.tsx` with identified patterns.

3. **Tool Selection (Veille)**:
   - Search for new monitoring or tech aggregation tools that could complement the current system.
   - Evaluate tools based on: Stability, Community support, API accessibility, and TechPulse AI compatibility.

4. **Reporting**:
   - Compile all findings into a structured report (`RESEARCH_REPORT_YYYY-MM-DD.md`).
   - Include sections: [Security], [Optimization], [New Tool Recommendations].
   - Provide a "Proposé d'intégration" (proposed integration plan) for the best tool identified.
