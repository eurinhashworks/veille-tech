import express from 'express';
import { prisma } from '../lib/prisma';
import { getUserSchema, validateRequest } from '../schemas/validation';
import cacheService from '../lib/cacheService';
import logger from '../lib/logger';

export default async function handler(req: express.Request, res: express.Response) {
    if (req.method === 'GET') {
        try {
            const { id: userId } = validateRequest(getUserSchema, req.query);

            // Cache key based on userId (or 'global' if none)
            const cacheKey = cacheService.generateKey({ type: 'stats', userId: userId || 'global' });
            const cachedStats = cacheService.get(cacheKey);

            if (cachedStats) {
                logger.info(`⚡ Cache Hit for stats: ${userId || 'global'}`);
                return res.status(200).json(cachedStats);
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

            return res.status(200).json(stats);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Paramètres invalides', details: error.errors });
            }
            logger.error('Error fetching stats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
