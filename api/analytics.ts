import { trackEventSchema, validateRequest } from '../schemas/validation';
import { AuthenticatedRequest } from '../types/request';
import { Response } from 'express';

export default async function handler(req: AuthenticatedRequest, res: Response) {
    const userId = req.session?.user?.id; // Optional for analytics, but good to have

    if (req.method === 'POST') {
        const body = validateRequest(trackEventSchema, req.body);

        console.log(`[ANALYTICS] Event: ${body.event}`, {
            userId: userId || 'anonymous',
            meta: body.metadata,
            timestamp: new Date().toISOString()
        });

        // In a real app, save to ClickHouse, Mixpanel, or PostHog
        // user.event.create(...)

        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
