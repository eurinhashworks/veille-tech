import { useState, useEffect, useCallback } from 'react';
import { getStatistics, getAllReviews } from '../services/storageService';
import { trendService, TrendReport } from '../services/trendService';
import { Review } from '../types/types';

interface DashboardStats {
    totalReviews: number;
    totalNews: number;
    avgGenerationTime: number;
    categoryDistribution: Record<string, number>;
    topCategory: string;
}

interface UseDashboardDataResult {
    stats: DashboardStats | null;
    lastReview: Review | null;
    topTrends: TrendReport[];
    loading: boolean;
    refresh: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataResult => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [lastReview, setLastReview] = useState<Review | null>(null);
    const [topTrends, setTopTrends] = useState<TrendReport[]>([]);
    const [loading, setLoading] = useState(true);

    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [dbStats, dbReviews] = await Promise.all([
                getStatistics(),
                getAllReviews()
            ]);

            setStats(dbStats);
            if (dbReviews.length > 0) {
                setLastReview(dbReviews[0]);
            }

            const trends = await trendService.getRisingTrends(3);
            setTopTrends(trends);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    return {
        stats,
        lastReview,
        topTrends,
        loading,
        refresh: loadDashboardData
    };
};
