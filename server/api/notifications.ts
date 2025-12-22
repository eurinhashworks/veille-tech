import { prisma } from '../lib/prisma';
import { updateNotificationSchema, validateRequest } from '../schemas/validation';
import { Response } from 'express';
import { z } from 'zod';

export default async function handler(req: any, res: Response) {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non autorisé' });

    if (req.method === 'GET') {
        try {
            // Note: Notification model is referenced but might be missing in schema.prisma
            const notifications = await (prisma as any).notification.findMany({
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

    if (req.method === 'PATCH') { // Mark as read/unread
        try {
            const querySchema = z.object({ id: z.string().min(1) });
            const { id } = validateRequest(querySchema, req.query);
            const body = validateRequest(updateNotificationSchema, req.body);

            const updated = await (prisma as any).notification.updateMany({
                where: { id: id, userId }, // Ensure user owns it
                data: { read: body.read }
            });
            return res.status(200).json({ success: true, count: updated.count });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Données invalides', details: error.errors });
            }
            console.error('Error updating notification:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
