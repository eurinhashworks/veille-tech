---
description: Workflow for extracting and filtering relevant APIs from external GitHub lists
---

# Workflow: API Discovery & Extraction

Use this workflow to ingest external API lists and identify integration opportunities.

1. **Source Parsing**:
   - Access target GitHub list (e.g., `API-mega-list`).
   - Identify relevant categories for TechPulse AI: [News], [AI], [Automation], [Developer Tools].

2. **Filtering & Extraction**:
   - Extract up to 10 APIs that offer:
     - Free or generous free tier.
     - Webhook support (preferred).
     - Reliable documentation/SDKs.
   - Target APIs that fill current gaps (e.g., non-English news, specialized AI models).

3. **Compatibility Analysis**:
   - For each selected API, check if it can be integrated using current `services/` logic.
   - Verify if new environment variables or Prisma models are required.

4. **Integration Proposal**:
   - Create a summary of "Top 3 Gems" for immediate integration.
   - Draft a service scaffold (e.g., `services/newService.ts`) for the best-matching API.
