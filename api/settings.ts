import { prisma } from '../lib/prisma';

export default async function handler(req: any, res: any) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

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
        const { userId, settings } = req.body;

        if (!userId || !settings) {
            return res.status(400).json({ error: 'UserId and settings are required' });
        }

        try {
            const updatedSettings = await prisma.userSettings.upsert({
                where: { userId },
                update: settings,
                create: {
                    userId,
                    ...settings,
                },
            });
            return res.status(200).json(updatedSettings);
        } catch (error) {
            console.error('Error updating settings:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
