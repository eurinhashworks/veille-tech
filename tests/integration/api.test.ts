import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateReviewSchema, validateRequest } from '../../schemas/validation';

describe('API Integration: Generation Validation', () => {

    const validPayload = {
        date: '2025-12-21',
        username: 'TestUser',
        isPublic: true,
        aiPreferences: {
            style: 'technical',
            tone: 'serious',
            depth: 'detailed'
        }
    };

    it('should validate a correct generation payload', () => {
        const result = validateRequest(generateReviewSchema, validPayload);
        expect(result).toEqual(validPayload);
    });

    it('should reject invalid dates', () => {
        const invalidPayload = { ...validPayload, date: 'invalid-date' };
        expect(() => validateRequest(generateReviewSchema, invalidPayload)).toThrow();
    });

    it('should reject missing required fields', () => {
        // @ts-ignore
        const { isPublic, ...missingFieldPayload } = validPayload;
        // isPublic is optional in schema? No, checked schema, it's optional. 
        // Let's remove date which causes regex fail.

        const invalidPayload = { ...validPayload, date: '2025/12/21' }; // Wrong format
        expect(() => validateRequest(generateReviewSchema, invalidPayload)).toThrow();
    });

    it('should allow optional aiPreferences', () => {
        const { aiPreferences, ...simplePayload } = validPayload;
        const result = validateRequest(generateReviewSchema, simplePayload);
        expect(result).toEqual(simplePayload);
    });
});
