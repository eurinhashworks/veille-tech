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
        const { q, category, tags, dateFrom, dateTo, userId } = req.query;

        if (!q && !category && !tags && !dateFrom && !dateTo) {
            return res.status(400).json({ error: 'Search criteria required' });
        }

        try {
            const tagList = tags ? String(tags).split(',') : [];

            const results = await prisma.review.findMany({
                where: {
                    AND: [
                        // Text search
                        q
                            ? {
                                OR: [
                                    { content: { contains: String(q), mode: 'insensitive' } },
                                    { flashSummary: { contains: String(q), mode: 'insensitive' } },
                                    { aiAnalysis: { contains: String(q), mode: 'insensitive' } },
                                ],
                            }
                            : {},
                        // Filters
                        category && category !== 'all'
                            ? { dominantCategory: String(category) }
                            : {},
                        tagList.length > 0
                            ? {
                                ReviewToTag: {
                                    some: {
                                        tags: {
                                            name: {
                                                in: tagList,
                                            },
                                        },
                                    },
                                },
                            }
                            : {},
                        dateFrom ? { date: { gte: String(dateFrom) } } : {},
                        dateTo ? { date: { lte: String(dateTo) } } : {},
                        userId ? { userId: String(userId) } : {},
                    ],
                },
                include: {
                    ReviewToTag: {
                        include: {
                            tags: true
                        }
                    },
                    sources: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
                orderBy: {
                    date: 'desc',
                },
            });

            return res.status(200).json(results);
        } catch (error) {
            console.error('Error searching reviews:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
