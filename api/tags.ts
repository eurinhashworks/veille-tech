import express from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { validateRequest } from '../schemas/validation';

export default async function handler(req: express.Request, res: express.Response) {
    if (req.method === 'GET') {
        try {
            const querySchema = z.object({
                limit: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional()
            });
            const { limit } = validateRequest(querySchema, req.query);

            const tags = await prisma.tag.findMany({
                include: {
                    ReviewToTag: {
                        include: {
                            reviews: true
                        }
                    },
                    _count: {
                        select: {
                            ReviewToTag: true,
                        },
                    },
                },
                orderBy: {
                    ReviewToTag: {
                        _count: 'desc',
                    },
                },
                ...(limit ? { take: limit } : {}),
            });

            return res.status(200).json(tags);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Paramètre limit invalide', details: error.errors });
            }
            console.error('Error fetching tags:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
