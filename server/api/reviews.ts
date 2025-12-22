import express from 'express';
import { prisma } from '../lib/prisma';
import { createReviewSchema, validateRequest } from '../schemas/validation';

const GLOBAL_USER_ID = 'global_user';

export default async function handler(req: express.Request, res: express.Response) {
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
        try {
            // Validate request body
            const {
                content,
                sources,
                date,
                formattedDate,
                flashSummary,
                aiAnalysis,
                dominantCategory,
                newsCount,
                generationTime,
                isPublic,
                tags: tagNames
            } = validateRequest(createReviewSchema, req.body.review);

            // Create or get tags
            const tagOperations = (tagNames || []).map(async (tagName: string) => {
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
                    id: req.body.review.metadata?.id || Math.random().toString(36).substring(2, 15),
                    date,
                    formattedDate,
                    content,
                    flashSummary,
                    aiAnalysis,
                    dominantCategory,
                    newsCount,
                    generationTime,
                    isPublic,
                    userId: GLOBAL_USER_ID,
                    ReviewToTag: {
                        create: tags.map((tag: { id: string }) => ({ tags: { connect: { id: tag.id } } })),
                    },
                    sources: {
                        create: (sources || []).map((source: { title: string; uri: string }) => ({
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
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Données invalides', details: error.errors });
            }
            console.error('Error creating review:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
