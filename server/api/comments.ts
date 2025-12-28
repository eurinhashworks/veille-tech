import { prisma } from '../lib/prisma';
import { createCommentSchema, validateRequest } from '../../schemas/validation';
import { AuthenticatedRequest } from '../../types/request';
import { Response } from 'express';

export default async function handler(req: AuthenticatedRequest, res: Response) {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
        const { reviewId } = req.query;
        if (!reviewId || typeof reviewId !== 'string') return res.status(400).json({ error: 'Missing Review ID' });

        const comments = await prisma.comment.findMany({
            where: { reviewId },
            include: { user: { select: { name: true, image: true, username: true } } },
            orderBy: { createdAt: 'asc' }
        });
        return res.status(200).json(comments);
    }

    if (req.method === 'POST') {
        const body = validateRequest(createCommentSchema, req.body);
        const comment = await prisma.comment.create({
            data: {
                content: body.content,
                reviewId: body.reviewId,
                userId
            },
            include: { user: { select: { name: true, image: true } } }
        });

        // TODO: Create Notification for review owner?

        return res.status(201).json(comment);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing ID' });

        // Ensure ownership
        const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment) return res.status(404).json({ error: 'Not found' });
        if (comment.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

        await prisma.comment.delete({ where: { id } });
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
