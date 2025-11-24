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
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { username: String(username) },
                include: {
                    settings: true,
                },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        const { username, email } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        try {
            // Check if user exists first
            let user = await prisma.user.findUnique({
                where: { username },
                include: { settings: true },
            });

            if (user) {
                return res.status(200).json(user);
            }

            // Create user
            user = await prisma.user.create({
                data: {
                    username,
                    email,
                    settings: {
                        create: {
                            theme: 'dark',
                            defaultVisibility: 'public',
                            notifications: false,
                            autoGenerate: false,
                        },
                    },
                },
                include: {
                    settings: true,
                },
            });

            return res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
