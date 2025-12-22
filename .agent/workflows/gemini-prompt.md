---
description: Workflow for modifying Gemini prompts and service logic
---

# Workflow: Gemini Prompt/Service Update

Follow these steps to ensure reliable Gemini integration and ground-truth responses.

1. **Analyze Current Prompt**:
   - Locate the prompt in `services/geminiService.ts`.
   - Identify the `---METADATA---` and `---CONTENT---` sections.

2. **Grounding Configuration**:
   - Ensure `googleSearchGrounding` is enabled if the prompt requires up-to-date information.
   - Verify that the model specified is `gemini-1.5-flash` or `gemini-2.0-flash` as per documentation.

3. **Prompt Modification**:
   - Keep instructions in French if the output is for end-users.
   - Ensure the prompt explicitly asks for the `---METADATA---` JSON block and the `---CONTENT---` Markdown block.
   - Do not remove the delimiters as they are critical for parsing.

4. **Parsing Update**:
   - If you change the JSON structure in `---METADATA---`, update the `Review` type and the parsing logic in `geminiService.ts`.

5. **Testing**:
   - Run a test generation to verify that the output is correctly formatted and parsed without errors.
   - Check the `GROUNDING` metadata in the response to ensure sources are correctly extracted.
