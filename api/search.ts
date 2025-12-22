import express from 'express';
import { prisma } from '../lib/prisma';
import { searchReviewsSchema, validateRequest } from '../schemas/validation';

export default async function handler(req: express.Request, res: express.Response) {
    if (req.method === 'GET') {
        try {
            const { query: q, category, tags, dateFrom, dateTo, userId } = validateRequest(searchReviewsSchema.extend({ userId: z.string().optional() }), req.query);

            if (!q && !category && !tags && !dateFrom && !dateTo) {
                return res.status(400).json({ error: 'Critères de recherche requis' });
            }

            const tagList = tags || [];

            const results = await prisma.review.findMany({
                where: {
                    AND: [
                        // Text search
                        q
                            ? {
                                OR: [
                                    { content: { contains: q, mode: 'insensitive' } },
                                    { flashSummary: { contains: q, mode: 'insensitive' } },
                                    { aiAnalysis: { contains: q, mode: 'insensitive' } },
                                ],
                            }
                            : {},
                        // Filters
                        category && category !== 'Mix' // 'Mix' is equivalent to 'all' in some contexts, but schema uses specific enum
                            ? { dominantCategory: category }
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
                        dateFrom ? { date: { gte: dateFrom } } : {},
                        dateTo ? { date: { lte: dateTo } } : {},
                        userId ? { userId: userId } : {},
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
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Paramètres de recherche invalides', details: error.errors });
            }
            console.error('Error searching reviews:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

import { z } from 'zod';
