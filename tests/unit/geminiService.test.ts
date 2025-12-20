import { describe, it, expect, vi, beforeEach } from 'vitest';

// Set environment variable BEFORE anything else
process.env.API_KEY = 'test-api-key';

// Fix the mock to be a constructor using a class
vi.mock('@google/genai', () => {
  class GoogleGenAI {
    public models = {
      generateContent: vi.fn().mockResolvedValue({
        text: "---METADATA---\n{\"flashSummary\":\"Summary\", \"dominantCategory\":\"IA\", \"tags\":[\"test\"], \"newsCount\":5, \"aiAnalysis\":\"Analysis\"}\n---END METADATA---\n---CONTENT---\n# Title\nContent\n---END CONTENT---",
        candidates: [{
          groundingMetadata: {
            groundingChunks: [
              { web: { title: 'Source 1', uri: 'https://example.com/1' } }
            ]
          }
        }]
      })
    };
    constructor(config: any) { }
  }
  return { GoogleGenAI };
});

import { generateTechReview } from '../../services/geminiService';

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a review correctly', async () => {
    const date = '2025-12-20';
    const preferences = {
      style: 'analytical' as const,
      tone: 'formal' as const,
      depth: 'detailed' as const
    };

    const review = await generateTechReview(date, 'testuser', true, preferences);

    expect(review).toBeDefined();
    expect(review.content).toContain('Title');
    expect(review.metadata.dominantCategory).toBe('IA');
    expect(review.sources.length).toBeGreaterThan(0);
  });
});
