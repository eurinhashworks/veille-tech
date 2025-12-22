import { CONFIG } from '../config';


// Re-defining the type here to avoid importing from non-existent folders
export interface TrendReport {
    technology: string;
    currentMentions: number;
    predictedMentions: number;
    impactScore: number;
    trend: 'rising' | 'falling' | 'stable';
}

const API_BASE = CONFIG.API_URL;

export const trendService = {
    getRisingTrends: async (limit: number = 3): Promise<TrendReport[]> => {
        try {
            const response = await fetch(`${API_BASE}/trends?trend=rising&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch trends:', error);
            return [];
        }
    }
};
