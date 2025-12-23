import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { createShareLinkSchema, validateRequest } from '@/lib/schemas/validation';
import { v4 as uuidv4 } from 'uuid'; // v4 as uuidv4 from 'uuid'
import { auth } from '@/auth';
import { z } from 'zod';

// POST /api/sharing - Create Share Link (Protected)
export async function POST(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedBody = validateRequest(createShareLinkSchema, body);

        const token = uuidv4();
        const shareLink = await prisma.shareLink.create({ // Assuming prisma.shareLink exists
            data: {
                userId,
                resourceId: validatedBody.resourceId,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days validity
            }
        });

        return NextResponse.json(shareLink, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Données de partage invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error creating share link:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET /api/sharing?token=... - Access Share Link (Public)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const querySchema = z.object({ token: z.string().uuid() });
        const { token } = validateRequest(querySchema, { token: searchParams.get('token') });

        const link = await prisma.shareLink.findUnique({ // Assuming prisma.shareLink exists
            where: { token }
        });

        if (!link || (link.expiresAt && link.expiresAt < new Date())) {
            return NextResponse.json({ error: 'Lien invalide ou expiré' }, { status: 404 });
        }

        // Increment views
        await prisma.shareLink.update({
            where: { id: link.id },
            data: { views: { increment: 1 } }
        });

        return NextResponse.json({
            valid: true,
            resourceId: link.resourceId,
            resourceType: 'review' // Assuming resourceType is always 'review' or needs to be extracted from link.resourceType
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Token de partage invalide', details: error.errors }, { status: 400 });
        }
        console.error('Error accessing share link:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
