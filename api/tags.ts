import express from 'express';
import { prisma } from '../lib/prisma';

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
        const { limit } = req.query;

        try {
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
                ...(limit ? { take: Number(limit) } : {}),
            });

            return res.status(200).json(tags);
        } catch (error) {
            console.error('Error fetching tags:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
