import { prisma } from '../lib/prisma';
import { updateSettingsSchema, validateRequest } from '../schemas/validation';
import { z } from 'zod';

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        const { userId } = req.query;

        // Pour le modèle sans auth, on utilise un settings global
        const GLOBAL_SETTINGS_ID = 'global_settings';

        try {
            let settings = await prisma.userSettings.findUnique({
                where: { id: GLOBAL_SETTINGS_ID },
            });

            // Si pas de settings global, on le crée
            if (!settings && userId) {
                settings = await prisma.userSettings.create({
                    data: {
                        id: GLOBAL_SETTINGS_ID,
                        userId: String(userId),
                    },
                });
            }

            return res.status(200).json(settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const bodySchema = z.object({
                userId: z.string().min(1),
                settings: updateSettingsSchema
            });
            const { userId, settings } = validateRequest(bodySchema, req.body);

            const updatedSettings = await prisma.userSettings.upsert({
                where: { userId },
                update: settings,
                create: {
                    userId,
                    ...settings,
                },
            });
            return res.status(200).json(updatedSettings);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Paramètres de réglages invalides', details: error.errors });
            }
            console.error('Error updating settings:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
