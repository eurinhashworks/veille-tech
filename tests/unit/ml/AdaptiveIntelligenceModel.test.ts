import { describe, it, expect } from 'vitest';
import { AdaptiveIntelligenceModel, LearningPattern, AdaptationRule } from '../../../services/ml/models/AdaptiveIntelligenceModel';
import { UserProfile } from '../../../services/ml/models/UserProfileModel';

describe('ML: AdaptiveIntelligenceModel', () => {
    const model = new AdaptiveIntelligenceModel();

    // Mock Data
    const mockProfile: UserProfile = {
        userId: 'user-123',
        techStack: ['React'],
        interests: ['Web'],
        interactionHistory: [],
        skillLevel: 0.5
    };

    const mockPatterns: LearningPattern[] = [
        {
            userId: 'user-123',
            behaviorType: 'reading',
            contentCategory: 'Web',
            timeSpent: 600, // 10 mins (Deep reading)
            engagementScore: 0.9,
            timestamp: Date.now()
        },
        {
            userId: 'user-123',
            behaviorType: 'reading',
            contentCategory: 'IA',
            timeSpent: 30, // Short
            engagementScore: 0.2,
            timestamp: Date.now()
        }
    ];

    const mockRules: AdaptationRule[] = [
        {
            id: 'rule-1',
            condition: 'High Engagement',
            action: 'Increase frequency',
            priority: 5,
            active: true
        }
    ];

    it('should adapt content depth based on behavior', () => {
        const adaptation = model.adaptUserPreferences(mockProfile, mockPatterns, mockRules);

        // Avg time spent is (600+30)/2 = 315s -> > 300s -> readingDepth high -> contentDepth 'deep' or 'medium'
        // Logic: max(avgTime/300, 1). 315/300 > 1. ReadingDepth = 1.
        // If readingDepth > 0.7 -> deep.

        expect(adaptation.preferences.contentDepth).toBe('deep');
    });

    it('should calculate effectiveness', () => {
        const result = model['calculateEffectiveness'](mockPatterns); // Access private for testing or test via public API
        // Total eng = 0.9 + 0.2 = 1.1. Avg = 0.55.
        expect(result).toBeCloseTo(0.55);
    });

    it('should generate new rules based on category', () => {
        const rules = model.generateAdaptationRules(mockProfile, mockPatterns);
        // Top category is Web or IA? Web (0.9 eng * 600s vs IA 0.2 * 30s). Wait, getTopCategory counts Frequency.
        // Web: 1, IA: 1. It might pick first.
        // Actually logiv: categoryCounts++. Both 1. 
        expect(rules.length).toBeGreaterThan(0);
        // Should suggest increasing frequency for top category
    });
});
