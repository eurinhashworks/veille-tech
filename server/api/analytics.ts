import { trackEventSchema, validateRequest } from '../../schemas/validation';
import { AuthenticatedRequest } from '../../types/request';
import { Response } from 'express';

export default async function handler(req: AuthenticatedRequest, res: Response) {
    const userId = req.session?.user?.id;

    if (req.method === 'POST') {
        try {
            const body = validateRequest(trackEventSchema, req.body);

            console.log(`[ANALYTICS] Event: ${body.event}`, {
                userId: userId || 'anonymous',
                meta: body.metadata,
                timestamp: new Date().toISOString()
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Analytics error:', error);
            return res.status(400).json({ error: 'Invalid data' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}