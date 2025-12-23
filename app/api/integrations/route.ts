import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { createIntegrationSchema, validateRequest } from '@/lib/schemas/validation';
import { auth } from '@/auth';

// GET /api/integrations - Get integrations for the authenticated user
export async function GET(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const integrations = await prisma.integration.findMany({ // Assuming prisma.integration exists
            where: { userId }
        });
        return NextResponse.json(integrations);
    } catch (error) {
        console.error('Error fetching integrations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/integrations - Create an integration for the authenticated user
export async function POST(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedBody = validateRequest(createIntegrationSchema, body);

        const integration = await prisma.integration.create({ // Assuming prisma.integration exists
            data: {
                userId,
                provider: validatedBody.provider,
                config: validatedBody.config,
                isActive: true
            }
        });
        return NextResponse.json(integration, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Données d\'intégration invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error creating integration:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
