import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { z } from 'zod';
import { validateRequest } from '@/lib/schemas/validation';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const querySchema = z.object({
            limit: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional()
        });
        const { limit } = validateRequest(querySchema, { limit: searchParams.get('limit') });

        const tags = await prisma.tag.findMany({
            include: {
                ReviewToTag: {
                    include: {
                        reviews: true
                    }
                },
                _count: {
                    select: {
                        ReviewToTag: true,
                    },
                },
            },
            orderBy: {
                ReviewToTag: {
                    _count: 'desc',
                },
            },
            ...(limit ? { take: limit } : {}),
        });

        return NextResponse.json(tags);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Paramètre limit invalide', details: error.errors }, { status: 400 });
        }
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
