import { NextResponse } from 'next/server';
import { headers } from 'next/headers'; // Import headers
import { prisma } from '@/lib/server/prisma';
import { auth } from '@/auth';
import { validateRequest, createCommentSchema } from '@/lib/schemas/validation'; // Import validateRequest and createCommentSchema
import { z } from 'zod'; // Import z from zod

export async function GET(req: Request) {
    // Authentication is implicitly handled by the middleware, but we need the session for queries 
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const querySchema = z.object({
            reviewId: z.string().min(1)
        });
        const { reviewId } = validateRequest(querySchema, { reviewId: searchParams.get('reviewId') });

        const comments = await prisma.comment.findMany({
            where: { reviewId },
            include: { user: { select: { username: true } } },
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(comments);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'ID de revue invalide', details: error.errors }, { status: 400 });
        }
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/comments
export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedBody = validateRequest(createCommentSchema, body);
        
        const comment = await prisma.comment.create({
            data: {
                content: validatedBody.content,
                reviewId: validatedBody.reviewId,
                userId
            },
            include: { user: { select: { username: true } } }
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Données de commentaire invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/comments?id=...
export async function DELETE(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const querySchema = z.object({
            id: z.string().min(1)
        });
        const { id } = validateRequest(querySchema, { id: searchParams.get('id') });

        // Ensure ownership
        const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment) {
            return NextResponse.json({ error: 'Non trouvé' }, { status: 404 });
        }
        if (comment.userId !== userId) {
            return NextResponse.json({ error: 'Interdit' }, { status: 403 });
        }

        await prisma.comment.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'ID de commentaire invalide', details: error.errors }, { status: 400 });
        }
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
