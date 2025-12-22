---
description: Workflow for verifying Gemini's output accuracy and grounding
---

# Workflow: AI Accuracy & Grounding Verification

Ensure that Gemini's output is factually correct and properly grounded in search results.

1. **Metadata Verification**:
   - Check if the `---METADATA---` block contains valid JSON.
   - Verify that `groundingMetadata` is present in the API response.

2. **Grounding & Sources**:
   - Manually check 2-3 sources returned by `googleSearchGrounding`.
   - Ensure that the generated content actually reflects the information from the sources.
   - Flag any hallucinations (e.g., tech news that doesn't exist or incorrect dates).

3. **Output Quality**:
   - Verify that the tone matches the instructions (e.g., "subjectif et stratégique").
   - Check that the output is in high-quality French without grammatical errors.

4. **Continuous Improvement**:
   - Adjust system instructions in `geminiService.ts` if inaccuracy patterns emerge.
   - Log failed parses to improve the delimiter-based parsing logic.
