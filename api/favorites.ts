import express from 'express';
import { prisma } from '../lib/prisma';
import { addFavoriteSchema, removeFavoriteSchema, validateRequest } from '../schemas/validation';

export default async function handler(req: express.Request, res: express.Response) {
    if (req.method === 'GET') {
        const { userId, reviewId, check } = req.query;

        try {
            // Si pas de userId, retourner tous les favoris (modèle global)
            if (!userId) {
                const favorites = await prisma.favorite.findMany({
                    include: {
                        review: {
                            include: {
                                ReviewToTag: {
                                    include: {
                                        tags: true
                                    }
                                },
                                sources: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });
                return res.status(200).json(favorites);
            }

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

            // Get all favorites for user
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
                            sources: true
                        }
                    }
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
        try {
            const { userId, reviewId } = validateRequest(addFavoriteSchema.extend({ userId: z.string().min(1) }), req.body);

            const favorite = await prisma.favorite.create({
                data: {
                    userId,
                    reviewId,
                },
            });
            return res.status(201).json(favorite);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Données invalides', details: error.errors });
            }
            console.error('Error adding favorite:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { userId, reviewId } = validateRequest(removeFavoriteSchema.extend({ userId: z.string().min(1) }), req.query);

            await prisma.favorite.delete({
                where: {
                    userId_reviewId: {
                        userId,
                        reviewId,
                    },
                },
            });
            return res.status(200).json({ success: true });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Données invalides', details: error.errors });
            }
            console.error('Error removing favorite:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

import { z } from 'zod';
