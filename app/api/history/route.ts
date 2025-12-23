import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { validateRequest, saveSearchHistorySchema } from '@/lib/schemas/validation';

// GET /api/history?limit=...
export async function GET(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 10;

        if (isNaN(limit)) {
            return NextResponse.json({ error: 'Paramètre "limit" invalide' }, { status: 400 });
        }

        const history = await prisma.searchHistory.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
        return NextResponse.json(history);
    } catch (error: any) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/history
export async function POST(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await req.json();
        // We don't need userId in the schema anymore as it comes from the session
        const validatedBody = validateRequest(saveSearchHistorySchema, body);

        const history = await prisma.searchHistory.create({
            data: {
                userId,
                query: validatedBody.query,
                filters: validatedBody.filters || {},
                results: validatedBody.results,
            },
        });
        return NextResponse.json(history, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Données d\'historique invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error saving history:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/history
export async function DELETE(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        await prisma.searchHistory.deleteMany({
            where: { userId },
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error clearing history:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
