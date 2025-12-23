import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { validateRequest } from '@/lib/schemas/validation';

// GET /api/favorites?reviewId=...&check=true
export async function GET(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('reviewId');
    const check = searchParams.get('check');

    try {
        // If no userId, this is a public/unauthenticated request.
        // The old logic returned all favorites, which seems like a potential data leak.
        // We will restrict this to only authenticated users.
        if (!userId) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        // Check if a specific review is a favorite for the current user
        if (check === 'true' && reviewId) {
            const favorite = await prisma.favorite.findUnique({
                where: {
                    userId_reviewId: {
                        userId: userId,
                        reviewId: reviewId,
                    },
                },
            });
            return NextResponse.json({ isFavorite: !!favorite });
        }

        // Get all favorites for the current user
        const favorites = await prisma.favorite.findMany({
            where: { userId: userId },
            include: {
                review: {
                    include: {
                        ReviewToTag: {
                            include: {
                                tags: true
                            }
                        },
                        sources: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/favorites
export async function POST(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const schema = z.object({ reviewId: z.string().min(1) });
        const { reviewId } = validateRequest(schema, body);

        const favorite = await prisma.favorite.create({
            data: {
                userId,
                reviewId,
            },
        });
        return NextResponse.json(favorite, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error adding favorite:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/favorites?reviewId=...
export async function DELETE(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const schema = z.object({ reviewId: z.string().min(1) });
        const { reviewId } = validateRequest(schema, { reviewId: searchParams.get('reviewId') });

        await prisma.favorite.delete({
            where: {
                userId_reviewId: {
                    userId,
                    reviewId,
                },
            },
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        // If the record doesn't exist, Prisma throws an error. We can treat this as success for idempotency.
        if (error.code === 'P2025') { 
            return NextResponse.json({ success: true, message: 'Favorite not found, considered deleted.' });
        }
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error removing favorite:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
