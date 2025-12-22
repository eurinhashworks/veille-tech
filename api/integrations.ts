import { prisma } from '../lib/prisma';
import { createIntegrationSchema, validateRequest } from '../schemas/validation';
import { Response } from 'express';
import { z } from 'zod';

export default async function handler(req: any, res: Response) {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non autorisé' });

    if (req.method === 'GET') {
        try {
            const integrations = await (prisma as any).integration.findMany({
                where: { userId }
            });
            return res.status(200).json(integrations);
        } catch (error) {
            console.error('Error fetching integrations:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const body = validateRequest(createIntegrationSchema, req.body);

            const integration = await (prisma as any).integration.create({
                data: {
                    userId,
                    provider: body.provider,
                    config: body.config,
                    isActive: true
                }
            });
            return res.status(201).json(integration);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Données d\'intégration invalides', details: error.errors });
            }
            console.error('Error creating integration:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
