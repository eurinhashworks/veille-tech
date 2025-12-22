import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/server/prisma';
import { getUserSchema, validateRequest } from '../../../lib/schemas/validation';
import cacheService from '../../../lib/server/cacheService';
import logger from '../../../lib/server/logger';

// We only handle GET requests for stats
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');
        
        // The validation function might need to be adapted to work with URLSearchParams instead of req.query
        // For now, we manually construct an object for it to validate.
        const queryParams = { id: userId };
        validateRequest(getUserSchema, queryParams);

        // Cache key based on userId (or 'global' if none)
        const cacheKey = cacheService.generateKey({ type: 'stats', userId: userId || 'global' });
        const cachedStats = cacheService.get(cacheKey);

        if (cachedStats) {
            logger.info(`⚡ Cache Hit for stats: ${userId || 'global'}`);
            return NextResponse.json(cachedStats);
        }

        const startTime = Date.now();
        const where = userId ? { userId } : {};

        const [totalReviews, totalNews, avgGenerationTime, categoryDistribution] =
            await Promise.all([
                prisma.review.count({ where }),
                prisma.review.aggregate({
                    where,
                    _sum: {
                        newsCount: true,
                    },
                }),
                prisma.review.aggregate({
                    where,
                    _avg: {
                        generationTime: true,
                    },
                }),
                prisma.review.groupBy({
                    by: ['dominantCategory'],
                    where,
                    _count: {
                        dominantCategory: true,
                    },
                }),
            ]);

        const stats = {
            totalReviews,
            totalNews: totalNews._sum.newsCount || 0,
            avgGenerationTime: avgGenerationTime._avg.generationTime || 0,
            categoryDistribution: categoryDistribution.reduce(
                (acc: Record<string, number>, item: { dominantCategory: string; _count: { dominantCategory: number } }) => {
                    acc[item.dominantCategory] = item._count.dominantCategory;
                    return acc;
                },
                {} as Record<string, number>
            ),
        };

        // Cache for 1 minute (60 seconds)
        cacheService.set(cacheKey, stats, 60);
        const duration = (Date.now() - startTime) / 1000;
        logger.info('✅ Stats calculated and cached', { duration: `${duration}s`, user: userId || 'global' });

        return NextResponse.json(stats);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Paramètres invalides', details: error.errors }, { status: 400 });
        }
        logger.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
