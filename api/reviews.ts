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
        const { date, startDate, endDate, userId, isPublic } = req.query;

        try {
            // Get by specific date
            if (date) {
                const review = await prisma.review.findUnique({
                    where: { date: String(date) },
                    include: {
                        tags: true,
                        sources: true,
                        user: true,
                    },
                });
                return res.status(200).json(review || null);
            }

            // Get by date range
            if (startDate && endDate) {
                const reviews = await prisma.review.findMany({
                    where: {
                        date: {
                            gte: String(startDate),
                            lte: String(endDate),
                        },
                        ...(userId ? { userId: String(userId) } : {}),
                    },
                    include: {
                        tags: true,
                        sources: true,
                    },
                    orderBy: {
                        date: 'desc',
                    },
                });
                return res.status(200).json(reviews);
            }

            // Get all reviews (with optional filters)
            const where: any = {};
            if (userId) where.userId = String(userId);
            if (isPublic !== undefined) where.isPublic = isPublic === 'true';

            const reviews = await prisma.review.findMany({
                where,
                include: {
                    tags: true,
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

            return res.status(200).json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        const { review, userId } = req.body;

        if (!review || !userId) {
            return res.status(400).json({ error: 'Review data and userId are required' });
        }

        try {
            // Create or get tags
            const tagOperations = review.metadata.tags.map(async (tagName: string) => {
                return await prisma.tag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: { name: tagName },
                });
            });

            const tags = await Promise.all(tagOperations);

            // Create review
            const newReview = await prisma.review.create({
                data: {
                    id: review.metadata.id,
                    date: review.metadata.date,
                    formattedDate: review.metadata.formattedDate,
                    content: review.content,
                    flashSummary: review.metadata.flashSummary,
                    aiAnalysis: review.metadata.aiAnalysis,
                    dominantCategory: review.metadata.dominantCategory,
                    newsCount: review.metadata.newsCount,
                    generationTime: review.metadata.generationTime,
                    isPublic: review.metadata.isPublic,
                    userId,
                    tags: {
                        connect: tags.map((tag: any) => ({ id: tag.id })),
                    },
                    sources: {
                        create: review.sources.map((source: any) => ({
                            title: source.title,
                            uri: source.uri,
                        })),
                    },
                },
                include: {
                    tags: true,
                    sources: true,
                },
            });

            return res.status(201).json(newReview);
        } catch (error) {
            console.error('Error creating review:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
