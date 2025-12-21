import { prisma } from '../lib/prisma';
import { createShareLinkSchema, validateRequest } from '../schemas/validation';
import { AuthenticatedRequest } from '../types/request';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: AuthenticatedRequest, res: Response) {
    const userId = req.session?.user?.id;

    // Create Link (Protected)
    if (req.method === 'POST') {
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const body = validateRequest(createShareLinkSchema, req.body);

        const token = uuidv4();
        const shareLink = await prisma.shareLink.create({
            data: {
                userId,
                resourceId: body.resourceId,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days validity
            }
        });

        // Return full shareable URL in prod, here just token/struct
        return res.status(201).json(shareLink);
    }

    // Access Link (Public)
    if (req.method === 'GET') {
        const { token } = req.query;
        if (!token || typeof token !== 'string') return res.status(400).json({ error: 'Missing token' });

        const link = await prisma.shareLink.findUnique({
            where: { token }
        });

        if (!link || (link.expiresAt && link.expiresAt < new Date())) {
            return res.status(404).json({ error: 'Link invalid or expired' });
        }

        // Increment views
        await prisma.shareLink.update({
            where: { id: link.id },
            data: { views: { increment: 1 } }
        });

        // Redirect to actual resource or return resource data?
        // Let's return the resource ID and type so client can fetch it
        return res.status(200).json({
            valid: true,
            resourceId: link.resourceId,
            resourceType: 'review' // Hardcoded for now, model could be upgraded
        });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
