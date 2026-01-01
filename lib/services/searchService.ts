import { prisma } from '@/lib/server/prisma';
import { Prisma } from '@prisma/client';

export interface SearchReviewsParams {
    q?: string;
    category?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
    userId?: string;
}

export async function searchReviews(params: SearchReviewsParams) {
    const { q, category, tags, dateFrom, dateTo, userId } = params;

    const tagList = tags || [];

    const whereClause: Prisma.ReviewWhereInput = {
        AND: [
            // Text search
            q
                ? {
                    OR: [
                        { content: { contains: q, mode: 'insensitive' } },
                        { flashSummary: { contains: q, mode: 'insensitive' } },
                        { aiAnalysis: { contains: q, mode: 'insensitive' } },
                    ] as Prisma.ReviewWhereInput[],
                }
                : {},
            // Filters
            category && category !== 'Mix'
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
            userId ? { userId: userId } : {},
        ].filter(Boolean) as Prisma.ReviewWhereInput[],
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

    return results;
}
