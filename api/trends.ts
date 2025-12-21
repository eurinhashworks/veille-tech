import { prisma } from "../lib/prisma";
import { TrendPredictionModel } from "../services/ml/models/TrendPredictionModel";
import { Review } from "../types";
import { trendAnalysisSchema, validateRequest } from "../schemas/validation";
import { Request, Response } from "express";

// Helper to convert Prisma Review with tags to the format expected by TrendPredictionModel
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
        isPublic: pReview.isPublic
    },
    content: pReview.content,
    sources: (pReview.sources as any[])?.map((s: any) => ({
        title: s.title,
        uri: s.uri
    })) || []
});

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // For the auth-less model, we use 'global_user' or just fetch public reviews
    const GLOBAL_USER_ID = 'global_user';

    try {
        const query = validateRequest(trendAnalysisSchema, req.query) as any;
        const days = query.daysBack || 30;
        const limit = query.limit || 10;
        const trendFilter = query.trend as string; // 'rising' or 'falling'
        const model = new TrendPredictionModel();

        // Fetch user's reviews + public reviews from DB
        const reviewsData = await prisma.review.findMany({
            where: {
                OR: [
                    { userId: GLOBAL_USER_ID },
                    { isPublic: true }
                ]
            },
            include: {
                ReviewToTag: {
                    include: {
                        tags: true
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

        return res.status(200).json(sortedReports);
    } catch (error) {
        const err = error as Error;
        console.error("Server-side trend analysis error:", err);
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        return res.status(500).json({ error: "Erreur lors de l'analyse des tendances sur le serveur." });
    }
}
