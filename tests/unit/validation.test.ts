import { describe, it, expect } from 'vitest';
import { getUserSchema, createReviewSchema } from '../../schemas/validation';

describe('Validation Schemas', () => {
    describe('getUserSchema', () => {
        it('should validate a correct user object', () => {
            const validUser = {
                id: 'user-123',
                username: 'testuser'
            };

            const result = getUserSchema.safeParse(validUser);
            expect(result.success).toBe(true);
        });

        it('should pass with only id', () => {
            const validUser = {
                id: 'user-123'
            };

            const result = getUserSchema.safeParse(validUser);
            expect(result.success).toBe(true);
        });
    });

    describe('createReviewSchema', () => {
        it('should validate a correct review object', () => {
            const validReview = {
                date: '2025-12-20',
                formattedDate: '20 déc. 2025',
                content: 'This is a test content that needs to be at least one hundred characters long to pass the validation check correctly and efficiently.',
                flashSummary: 'Test summary that is long enough',
                aiAnalysis: 'Excellent',
                dominantCategory: 'IA',
                newsCount: 5,
                generationTime: 12.5,
                isPublic: true,
                userId: 'user-123',
                tags: ['AI', 'Tech'],
                sources: [{ title: 'Source 1', uri: 'https://example.com' }]
            };

            const result = createReviewSchema.safeParse(validReview);
            expect(result.success).toBe(true);
        });

        it('should fail if content is too short', () => {
            const invalidReview = {
                date: '2025-12-20',
                formattedDate: '20 déc. 2025',
                content: 'Too short',
                flashSummary: 'Summary',
                aiAnalysis: 'Excellent',
                dominantCategory: 'IA',
                newsCount: 5,
                generationTime: 12.5,
                isPublic: true,
                userId: 'user-123'
            };

            const result = createReviewSchema.safeParse(invalidReview);
            expect(result.success).toBe(false);
        });
    });
});
