import { prisma } from '../lib/prisma';
import { updateNotificationSchema, validateRequest } from '../../schemas/validation';
import { AuthenticatedRequest } from '../../types/request';
import { Response } from 'express';

export default async function handler(req: AuthenticatedRequest, res: Response) {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
        try {
            const notifications = await prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 50
            });
            return res.status(200).json(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PATCH') {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing Notif ID' });

        try {
            const body = validateRequest(updateNotificationSchema, req.body);
            const updated = await prisma.notification.updateMany({
                where: { id: id, userId },
                data: { read: body.read }
            });
            return res.status(200).json({ success: true, count: updated.count });
        } catch (error: any) {
            throw error;
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}