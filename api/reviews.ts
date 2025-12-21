import express from 'express';
import { prisma } from '../lib/prisma';

const GLOBAL_USER_ID = 'global_user';

export default async function handler(req: express.Request, res: express.Response) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
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
        const { date, startDate, endDate, isPublic } = req.query;

        try {
            // Get by specific date
            if (date) {
                const review = await prisma.review.findUnique({
                    where: { date: String(date) },
                    include: {
                        ReviewToTag: {
                            include: {
                                tags: true
                            }
                        },
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
                        }
                    },
                    include: {
                        ReviewToTag: {
                            include: {
                                tags: true
                            }
                        },
                        sources: true,
                    },
                    orderBy: {
                        date: 'desc',
                    },
                });
                return res.status(200).json(reviews);
            }

            // Get all reviews (with optional filters)
            const where: { isPublic?: boolean } = {};
            if (isPublic !== undefined) where.isPublic = isPublic === 'true';

            const reviews = await prisma.review.findMany({
                where,
                include: {
                    ReviewToTag: {
                        include: {
                            tags: true
                        }
                    },
                    sources: true,
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
        const { review } = req.body;

        if (!review) {
            return res.status(400).json({ error: 'Review data is required' });
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
                    userId: GLOBAL_USER_ID,
                    ReviewToTag: {
                        create: tags.map((tag: { id: string }) => ({ tags: { connect: { id: tag.id } } })),
                    },
                    sources: {
                        create: review.sources.map((source: { title: string; uri: string }) => ({
                            title: source.title,
                            uri: source.uri,
                        })),
                    },
                },
                include: {
                    ReviewToTag: {
                        include: {
                            tags: true
                        }
                    },
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
