import { NextResponse } from 'next/server';
import { headers } from 'next/headers'; // Import headers
import { prisma } from '@/lib/server/prisma';
import { auth } from '@/auth';
import { validateRequest, searchReviewsSchema } from '@/lib/schemas/validation'; // Import validateRequest and searchReviewsSchema
import { z } from 'zod'; // Import z from zod

export async function GET(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    const authenticatedUserId = session?.user?.id;

    try {
        const { searchParams } = new URL(req.url);
        const queryParams = Object.fromEntries(searchParams.entries());

        // Validate all incoming query parameters, including the optional userId
        const validatedParams = validateRequest(searchReviewsSchema.extend({ userId: z.string().optional() }), queryParams);

        const { query: q, category, tags, dateFrom, dateTo, userId } = validatedParams;

        // If a userId is provided in the query, use it.
        // Otherwise, if an authenticated user exists, default to their reviews.
        // If neither, then it's a public search (no userId filter).
        const effectiveUserId = userId || authenticatedUserId;

        if (!q && !category && !tags && !dateFrom && !dateTo && !effectiveUserId) {
            return NextResponse.json({ error: 'Critères de recherche requis' }, { status: 400 });
        }

        const tagList = tags || [];

        const whereClause: any = {
            AND: [
                // Text search
                q
                    ? {
                        OR: [
                            { content: { contains: q, mode: 'insensitive' } },
                            { flashSummary: { contains: q, mode: 'insensitive' } },
                            { aiAnalysis: { contains: q, mode: 'insensitive' } },
                        ],
                    }
                    : {},
                // Filters
                category && category !== 'Mix' // 'Mix' is equivalent to 'all' in some contexts, but schema uses specific enum
                    ? { dominantCategory: category }
                    : {},
                tagList.length > 0
                    ? {
                        ReviewToTag: {
                            some: {
                                tags: {
                                    name: {
                                        in: tagList,
                                    },
                                },
                            },
                        },
                    }
                    : {},
                dateFrom ? { date: { gte: dateFrom } } : {},
                dateTo ? { date: { lte: dateTo } } : {},
                effectiveUserId ? { userId: effectiveUserId } : {},
            ].filter(Boolean), // Filter out empty objects
        };

        const results = await prisma.review.findMany({
            where: whereClause,
            include: {
                ReviewToTag: {
                    include: {
                        tags: true
                    }
                },
                sources: true,
                user: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json(results);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Paramètres de recherche invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error searching reviews:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
