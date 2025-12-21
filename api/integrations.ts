import { prisma } from '../lib/prisma';
import { createIntegrationSchema, validateRequest } from '../schemas/validation';
import { AuthenticatedRequest } from '../types/request';
import { Response } from 'express';

export default async function handler(req: AuthenticatedRequest, res: Response) {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
        const integrations = await prisma.integration.findMany({
            where: { userId }
        });
        return res.status(200).json(integrations);
    }

    if (req.method === 'POST') {
        const body = validateRequest(createIntegrationSchema, req.body);

        // Upsert based on provider to strictly allow one per type? Or allow multiple? 
        // Let's assume one per provider for now.
        const integration = await prisma.integration.create({
            data: {
                userId,
                provider: body.provider,
                config: body.config,
                isActive: true
            }
        });
        return res.status(201).json(integration);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
