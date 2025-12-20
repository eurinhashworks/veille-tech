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
        const { userId, reviewId, check } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        try {
            // Check if specific review is favorite
            if (check === 'true' && reviewId) {
                const favorite = await prisma.favorite.findUnique({
                    where: {
                        userId_reviewId: {
                            userId: String(userId),
                            reviewId: String(reviewId),
                        },
                    },
                });
                return res.status(200).json({ isFavorite: !!favorite });
            }

            // Get all favorites
            const favorites = await prisma.favorite.findMany({
                where: { userId: String(userId) },
                include: {
                    review: {
                        include: {
                            ReviewToTag: {
                                include: {
                                    tags: true
                                }
                            },
                            sources: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return res.status(200).json(favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        const { userId, reviewId } = req.body;

        if (!userId || !reviewId) {
            return res.status(400).json({ error: 'UserId and ReviewId are required' });
        }

        try {
            const favorite = await prisma.favorite.create({
                data: {
                    userId,
                    reviewId,
                },
            });
            return res.status(201).json(favorite);
        } catch (error) {
            console.error('Error adding favorite:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        const { userId, reviewId } = req.query;

        if (!userId || !reviewId) {
            return res.status(400).json({ error: 'UserId and ReviewId are required' });
        }

        try {
            await prisma.favorite.delete({
                where: {
                    userId_reviewId: {
                        userId: String(userId),
                        reviewId: String(reviewId),
                    },
                },
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error removing favorite:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
