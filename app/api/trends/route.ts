import {
    NextResponse
} from 'next/server';
import {
    prisma
} from '@/lib/server/prisma';
import { TrendPredictionModel } from '@/lib/server/services/ml/models/TrendPredictionModel'; // Assuming this will be moved or is accessible here
import {
    trendAnalysisSchema,
    validateRequest
} from '@/lib/schemas/validation';
import cacheService from '@/lib/server/cacheService';
import logger from '@/lib/server/logger';
import { Review } from '@/types/types';

// Helper to convert Prisma Review with tags to the format expected by TrendPredictionModel
const prismaToReviewFormat = (pReview: any): Review => ({
    metadata: {
        id: pReview.id,
        date: pReview.date,
        formattedDate: pReview.formattedDate,
        username: pReview.user?.username || 'Anonyme',
        timestamp: new Date(pReview.createdAt).getTime(),
        generationTime: pReview.generationTime,
        tags: (pReview.ReviewToTag as any[])?.map((rt: any) => rt.tags.name) || [],
        dominantCategory: pReview.dominantCategory,
        newsCount: pReview.newsCount,
        flashSummary: pReview.flashSummary,
        aiAnalysis: pReview.aiAnalysis,
        isPublic: pReview.isPublic,
        userId: pReview.userId // Added userId to ReviewMetadata
    },
    content: pReview.content,
    sources: (pReview.sources as any[])?.map((s: any) => ({
        title: s.title,
        uri: s.uri
    })) || []
});

export async function GET(req: Request) {
    if (req.method !== 'GET') {
        // Next.js Route Handlers handle method matching automatically.
        // If only GET is exported, other methods will automatically get 405.
        // This check is technically redundant in the final Next.js handler
        // but kept for conceptual consistency with original.
        return NextResponse.json({ error: 'Méthode non autorisée' }, { status: 405 });
    }

    const GLOBAL_USER_ID = 'global_user';

    try {
        const { searchParams
        } = new URL(req.url);
        const queryParams = Object.fromEntries(searchParams.entries());

        const query = validateRequest(trendAnalysisSchema, queryParams);
        const days = query.daysBack || 30;
        const limit = query.limit || 10;
        const trendFilter = query.trend;

        // Cache key based on query params
        const cacheKey = cacheService.generateKey({
            type: 'trends',
            days,
            limit,
            trendFilter
        });
        const cachedTrends = cacheService.get(cacheKey);

        if (cachedTrends) {
            logger.info('⚡ Cache Hit for trends analysis');
            return NextResponse.json(cachedTrends);
        }

        const startTime = Date.now();
        const model = new TrendPredictionModel();

        // Fetch user's reviews + public reviews from DB
        const reviewsData = await prisma.review.findMany({
            where: {
                OR: [
                    {
                        userId: GLOBAL_USER_ID
                    },
                    {
                        isPublic: true
                    }
                ]
            },
            include: {
                ReviewToTag: {
                    include: {
                        tags: true
                    }
                },
                sources: true,
                user: {
                    select: {
                        username: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        const reviews = reviewsData.map(prismaToReviewFormat);

        // 1. Extract technologies
        const techMap = model.extractTechnologiesFromReviews(reviews);
        const technologies = model.convertToTrendData(techMap, days);

        // 2. Predict trends and create reports
        let reports = technologies.map(tech => {
            const prediction = model.predictTrend(tech, 7); // Predict 7 days
            const impact = model.calculateImpactScore(tech);
            const currentMentions = tech.timeline.length > 0 ? tech.timeline[tech.timeline.length - 1].mentions : 0;
            const trend = prediction > currentMentions ? 'rising' : 'falling';

            return {
                technology: tech.technology,
                currentMentions,
                predictedMentions: prediction,
                impactScore: impact,
                trend: trend,
            };
        });

        // 3. Filter by trend if specified
        if (trendFilter) {
            reports = reports.filter(report => report.trend === trendFilter);
        }

        // 4. Sort by impact score and limit
        const sortedReports = reports.sort((a, b) => b.impactScore - a.impactScore).slice(0, limit);

        // Cache for 5 minutes (300 seconds)
        cacheService.set(cacheKey, sortedReports, 300);
        const duration = (Date.now() - startTime) / 1000;
        logger.info('✅ Trend analysis completed and cached', {
            duration: `${duration}s`
        });

        return NextResponse.json(sortedReports);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Paramètres d\'analyse invalides', details: error.errors }, { status: 400 });
        }
        logger.error("Trend analysis error:", error);
        return NextResponse.json({ error: "Erreur lors de l\'analyse des tendances." }, { status: 500 });
    }
}
