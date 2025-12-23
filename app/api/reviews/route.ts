import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { createReviewSchema, validateRequest } from '@/lib/schemas/validation';
import { auth } from '@/auth';

// GET /api/reviews?date=...&startDate=...&endDate=...&isPublic=...
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const isPublic = searchParams.get('isPublic');

    try {
        // Get by specific date
        if (date) {
            const review = await prisma.review.findUnique({
                where: { date: String(date) },
                include: { ReviewToTag: { include: { tags: true } }, sources: true, user: true },
            });
            return NextResponse.json(review || null);
        }

        // Get by date range
        if (startDate && endDate) {
            const reviews = await prisma.review.findMany({
                where: { date: { gte: String(startDate), lte: String(endDate) } },
                include: { ReviewToTag: { include: { tags: true } }, sources: true },
                orderBy: { date: 'desc' },
            });
            return NextResponse.json(reviews);
        }

        // Get all reviews (with optional filters)
        const where: { isPublic?: boolean } = {};
        if (isPublic !== null) where.isPublic = isPublic === 'true';

        const reviews = await prisma.review.findMany({
            where,
            include: { ReviewToTag: { include: { tags: true } }, sources: true },
            orderBy: { date: 'desc' },
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/reviews
export async function POST(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await req.json();
        // Validate request body
        const {
            content, sources, date, formattedDate, flashSummary, aiAnalysis,
            dominantCategory, newsCount, generationTime, isPublic, tags: tagNames, id
        } = validateRequest(createReviewSchema, body.review);

        // Create or get tags
        const tagOperations = (tagNames || []).map(async (tagName: string) => {
            return await prisma.tag.upsert({
                where: { name: tagName },
                update: {},
                create: { name: tagName },
            });
        });
        const tags = await Promise.all(tagOperations);

        // Create review
        const newReview = await prisma.review.create({
            data: {
                id: id || Math.random().toString(36).substring(2, 15),
                date, formattedDate, content, flashSummary, aiAnalysis,
                dominantCategory, newsCount, generationTime, isPublic,
                userId, // <-- SECURITY FIX: Using the authenticated user's ID
                ReviewToTag: {
                    create: tags.map((tag: { id: string }) => ({ tags: { connect: { id: tag.id } } })),
                },
                sources: {
                    create: (sources || []).map((source: { title: string; uri: string }) => ({
                        title: source.title,
                        uri: source.uri,
                    })),
                },
            },
            include: { ReviewToTag: { include: { tags: true } }, sources: true },
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
