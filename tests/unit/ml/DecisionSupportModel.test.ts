import { describe, it, expect } from 'vitest';
import { DecisionSupportModel, DecisionContext } from '@/lib/server/services/ml/models/DecisionSupportModel';

describe('ML: DecisionSupportModel', () => {
    const model = new DecisionSupportModel();

    const mockContext: DecisionContext = {
        currentTrends: [{ technology: 'React', currentMentions: 100, predictedMentions: 150, impactScore: 80, trend: 'rising' }],
        userPreferences: {
            riskTolerance: 'medium',
            investmentCapacity: 'moderate',
            adoptionStrategy: 'early'
        },
        businessConstraints: {
            budget: 50000,
            timeline: 6,
            teamSize: 5,
            skillLevel: 0.8
        }
    };

    it('should recommend adoption/monitoring for good conditions', () => {
        const decision = model.calculateStrategicDecision('Adopt Next.js', 'Analyze migration', mockContext);

        expect(decision.title).toBe('Adopt Next.js');
        expect(decision.factors.length).toBeGreaterThan(0);
        expect(decision.confidence).toBeGreaterThan(0.5);
        expect(['adopt', 'monitor']).toContain(decision.recommendation);
    });

    it('should identify risk tolerance factor', () => {
        const decision = model.calculateStrategicDecision('Test', 'Desc', mockContext);
        const riskFactor = decision.factors.find(f => f.name === 'RiskTolerance');
        expect(riskFactor).toBeDefined();
        if (riskFactor) expect(riskFactor.value).toBe(0.5); // Medium = 0.5
    });
});
