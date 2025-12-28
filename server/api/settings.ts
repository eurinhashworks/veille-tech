import { prisma } from '../lib/prisma'; // Use the correct prisma instance

export default async function handler(req: any, res: any) {
    // CORS are handled by server/index.ts now, but we keep methods allow just in case
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { userId } = req.query;

    // Default settings to return if user is not found or anonymous
    const defaultSettings = {
        theme: 'dark',
        defaultVisibility: 'public',
        notifications: false,
        autoGenerate: false,
        aiPreferences: { style: 'analytical', tone: 'formal', depth: 'detailed' }
    };

    if (req.method === 'GET') {
        if (!userId || userId === 'anonymous' || userId === 'undefined') {
            // Return default settings for anonymous users without checking DB
            return res.status(200).json(defaultSettings);
        }

        try {
            let settings = await prisma.userSettings.findUnique({
                where: { userId: String(userId) },
            });

            if (!settings) {
                // Check if user exists before creating settings
                const userExists = await prisma.user.findUnique({
                    where: { id: String(userId) }
                });

                if (userExists) {
                    settings = await prisma.userSettings.create({
                        data: {
                            userId: String(userId),
                            ...defaultSettings
                        },
                    });
                } else {
                    // User doesn't exist (maybe auth sync issue), return defaults
                    return res.status(200).json(defaultSettings);
                }
            }

            return res.status(200).json(settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Fallback to defaults on error
            return res.status(200).json(defaultSettings);
        }
    }

    if (req.method === 'POST') {
        const { userId, settings } = req.body;

        if (!userId || userId === 'anonymous') {
            return res.status(200).json({ message: 'Settings not saved for anonymous user' });
        }

        try {
             // Check if user exists first
             const userExists = await prisma.user.findUnique({
                where: { id: String(userId) }
            });

            if (!userExists) {
                return res.status(404).json({ error: 'User not found' });
            }

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