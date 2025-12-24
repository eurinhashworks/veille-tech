import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { validateRequest, searchReviewsSchema } from '@/lib/schemas/validation';
import { z } from 'zod';
import { searchReviews } from '@/lib/services/searchService';

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

        const results = await searchReviews({
            q,
            category,
            tags,
            dateFrom,
            dateTo,
            userId: effectiveUserId
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
