import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { updateSettingsSchema, validateRequest } from '@/lib/schemas/validation';
import { auth } from '@/auth';

// GET /api/settings - Gets settings for the authenticated user
export async function GET(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        let userSettings = await prisma.userSettings.findUnique({
            where: { userId: userId },
        });

        // If settings don't exist, create them with default values
        if (!userSettings) {
            userSettings = await prisma.userSettings.create({
                data: {
                    userId: userId,
                    theme: 'dark',
                    defaultVisibility: 'public',
                    notifications: false,
                    autoGenerate: false,
                },
            });
        }

        return NextResponse.json(userSettings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/settings - Updates settings for the authenticated user
export async function PUT(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedSettings = validateRequest(updateSettingsSchema, body);

        const updatedSettings = await prisma.userSettings.upsert({
            where: { userId },
            update: validatedSettings,
            create: {
                userId,
                ...validatedSettings,
            },
        });

        return NextResponse.json(updatedSettings);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Paramètres de réglages invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
