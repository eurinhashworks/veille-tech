import { trackEventSchema, validateRequest } from '../schemas/validation';
import { Response } from 'express';

export default async function handler(req: any, res: Response) {
    const userId = req.session?.user?.id; // Optional for analytics, but good to have

    if (req.method === 'POST') {
        try {
            const body = validateRequest(trackEventSchema, req.body);

            console.log(`[ANALYTICS] Event: ${body.event}`, {
                userId: userId || 'anonymous',
                meta: body.metadata,
                timestamp: new Date().toISOString()
            });

            // In a real app, save to ClickHouse, Mixpanel, or PostHog
            return res.status(200).json({ success: true });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Événement analytique invalide', details: error.errors });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
