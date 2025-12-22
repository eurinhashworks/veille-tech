import { prisma } from '../lib/prisma';
import { createCommentSchema, validateRequest } from '../schemas/validation';
import { Response } from 'express';
import { z } from 'zod';

export default async function handler(req: any, res: Response) {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non autorisé' });

    if (req.method === 'GET') {
        try {
            const querySchema = z.object({
                reviewId: z.string().min(1)
            });
            const { reviewId } = validateRequest(querySchema, req.query);

            const comments = await prisma.comment.findMany({
                where: { reviewId },
                include: { user: { select: { username: true } } },
                orderBy: { createdAt: 'asc' }
            });
            return res.status(200).json(comments);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'ID de revue invalide', details: error.errors });
            }
            console.error('Error fetching comments:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const body = validateRequest(createCommentSchema, req.body);
            const comment = await prisma.comment.create({
                data: {
                    content: body.content,
                    reviewId: body.reviewId,
                    userId
                },
                include: { user: { select: { username: true } } }
            });

            return res.status(201).json(comment);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Données de commentaire invalides', details: error.errors });
            }
            console.error('Error creating comment:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const querySchema = z.object({
                id: z.string().min(1)
            });
            const { id } = validateRequest(querySchema, req.query);

            // Ensure ownership
            const comment = await prisma.comment.findUnique({ where: { id } });
            if (!comment) return res.status(404).json({ error: 'Non trouvé' });
            if (comment.userId !== userId) return res.status(403).json({ error: 'Interdit' });

            await prisma.comment.delete({ where: { id } });
            return res.status(200).json({ success: true });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'ID de commentaire invalide', details: error.errors });
            }
            console.error('Error deleting comment:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
