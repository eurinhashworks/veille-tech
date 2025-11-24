import { prisma } from '../lib/prisma';

export default async function handler(req: any, res: any) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        const { userId } = req.query;
        const where = userId ? { userId: String(userId) } : {};

        try {
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
                    (acc: any, item: any) => {
                        acc[item.dominantCategory] = item._count.dominantCategory;
                        return acc;
                    },
                    {} as Record<string, number>
                ),
            };

            return res.status(200).json(stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
