---
description: Workflow for regular security checks (headers, limits, dependencies)
---

# Workflow: Security Audit

Perform regular security checks to protect the application and its users.

1. **Static Security Checks**:
   - **Headers**: Verify `helmet` configuration in `server/index.ts`.
   - **Rate Limiting**: Check `express-rate-limit` settings for API endpoints.
   - **HTTPS**: Ensure no hardcoded `http://` links exist in production-ready files.

2. **Dependency Audit**:
   - Run `pnpm audit` to identify vulnerable packages.
   - Update or patch critical vulnerabilities.

3. **Environment Security**:
   - Verify that `.env` files are properly gitignored (check `.gitignore`).
   - Audit code for accidentally logged API keys or PII (Personally Identifiable Information).

4. **Input Sanitization**:
   - Check all user inputs for Zod validation coverage.
   - Verify that Gemini prompts use sanitized inputs to prevent prompt injection.
