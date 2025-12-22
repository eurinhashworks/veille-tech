import { prisma } from '../lib/prisma';
import { createShareLinkSchema, validateRequest } from '../schemas/validation';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export default async function handler(req: any, res: Response) {
    const userId = req.session?.user?.id;

    // Create Link (Protected)
    if (req.method === 'POST') {
        if (!userId) return res.status(401).json({ error: 'Non autorisé' });
        try {
            const body = validateRequest(createShareLinkSchema, req.body);

            const token = uuidv4();
            const shareLink = await (prisma as any).shareLink.create({
                data: {
                    userId,
                    resourceId: body.resourceId,
                    token,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days validity
                }
            });

            return res.status(201).json(shareLink);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Données de partage invalides', details: error.errors });
            }
            console.error('Error creating share link:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Access Link (Public)
    if (req.method === 'GET') {
        try {
            const querySchema = z.object({ token: z.string().uuid() });
            const { token } = validateRequest(querySchema, req.query);

            const link = await (prisma as any).shareLink.findUnique({
                where: { token }
            });

            if (!link || (link.expiresAt && link.expiresAt < new Date())) {
                return res.status(404).json({ error: 'Lien invalide ou expiré' });
            }

            // Increment views
            await (prisma as any).shareLink.update({
                where: { id: link.id },
                data: { views: { increment: 1 } }
            });

            return res.status(200).json({
                valid: true,
                resourceId: link.resourceId,
                resourceType: 'review'
            });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Token de partage invalide', details: error.errors });
            }
            console.error('Error accessing share link:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
