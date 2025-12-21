import { describe, it, expect, vi } from 'vitest';
import { TrendPredictionModel } from '../../../services/ml/models/TrendPredictionModel';

describe('ML: TrendPredictionModel', () => {

    it('should predict future trends using linear regression', () => {
        const model = new TrendPredictionModel();
        const data = {
            technology: 'React',
            timeline: [
                { date: '2025-01-01', mentions: 10 },
                { date: '2025-01-02', mentions: 20 },
                { date: '2025-01-03', mentions: 30 }
            ]
        };

        // Linear progression: 10, 20, 30 -> Next should be 40
        const prediction = model.predictTrend(data, 1);
        expect(prediction).toBeCloseTo(40, 0);
    });

    it('should handle flat trends', () => {
        const model = new TrendPredictionModel();
        const data = {
            technology: 'Cobol',
            timeline: [
                { date: '2025-01-01', mentions: 5 },
                { date: '2025-01-02', mentions: 5 },
                { date: '2025-01-03', mentions: 5 }
            ]
        };
        const prediction = model.predictTrend(data, 1);
        expect(prediction).toBeCloseTo(5, 0);
    });

    it('should gracefully handle empty or single-point data', () => {
        const model = new TrendPredictionModel();
        const data = {
            technology: 'NewTech',
            timeline: [
                { date: '2025-01-01', mentions: 100 }
            ]
        };
        expect(model.predictTrend(data, 1)).toBe(100); // Fallback to last known value
    });
});
