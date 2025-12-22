import express from 'express';
import { prisma } from '../lib/prisma';
import { getUserSchema, validateRequest } from '../schemas/validation';

export default async function handler(req: express.Request, res: express.Response) {
    if (req.method === 'GET') {
        try {
            const { id: userId } = validateRequest(getUserSchema, req.query);
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

            return res.status(200).json(stats);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Paramètres invalides', details: error.errors });
            }
            console.error('Error fetching stats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
