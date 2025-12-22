# Rule: Gemini API Integration

TechPulse AI relies heavily on Gemini for content generation and grounding.

## Core Requirements
- **French Output**: All final user-facing content (revues, analysis) must be in French.
- **Structured Output**: Responses must use the `---METADATA---` and `---CONTENT---` delimiters as defined in `geminiService.ts`.
- **Grounding**: Always try to enable `googleSearchGrounding` for news-related prompts.
- **Error Handling**: Always check for API key presence and handle quota/timeout errors gracefully.

## Prompting Guidelines
- Be specific about the desired tone (e.g., "subjectif et stratégique").
- Include instructions for JSON structure in the metadata section.
- Ask for Markdown formatting in the content section.

## Prohibited
- Do not expose API keys in frontend code.
- Do not remove delimiters in the prompts without updating the service logic.
