import { NextResponse } from 'next/server';
import { headers } from 'next/headers'; // Import headers
import { generateContent } from '@/lib/gemini';
import { geminiModel } from '@/lib/gemini'; // Import geminiModel
import { prisma } from '@/lib/server/prisma';
import { Review, Source, CategoryType } from '@/types/types';
import { generateReviewSchema, validateRequest } from '@/lib/schemas/validation';
import { CONFIG } from '@/lib/server/config';
import cacheService from '@/lib/server/cacheService';
import logger from '@/lib/server/logger';
import { auth } from '@/auth';

// Helper for simple ID generation
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Types pour les préférences IA
type AiStyle = 'analytical' | 'creative' | 'technical' | 'executive';
type AiTone = 'formal' | 'casual' | 'humorous' | 'serious';
type AiDepth = 'brief' | 'detailed' | 'comprehensive';

interface AiPreferences {
    style: AiStyle;
    tone: AiTone;
    depth: AiDepth;
}

const getCustomPrompt = (preferences: AiPreferences) => {
    const stylePrompts: Record<AiStyle, string> = {
        analytical: `Adopte une approche factuelle et logique, en mettant l'accent sur les données et les analyses objectives.`, 
        creative: `Offre une perspective originale et imaginative, en explorant des angles moins conventionnels.`, 
        technical: `Concentre-toi sur les détails techniques approfondis et les aspects d'implémentation.`, 
        executive: `Prends un point de vue stratégique orienté business, en mettant en avant l'impact stratégique.`
    };
    const tonePrompts: Record<AiTone, string> = {
        formal: `Utilise un langage professionnel et académique.`, 
        casual: `Adopte un ton conversationnel et accessible.`, 
        humorous: `Intègre des touches d'humour subtil pour rendre le contenu plus engageant.`, 
        serious: `Maintiens un ton direct, grave et concentré sur l'essentiel.`
    };
    const depthPrompts: Record<AiDepth, string> = {
        brief: `Fournis l'essentiel uniquement, focus sur la concision.`, 
        detailed: `Équilibre entre détails et lisibilité.`, 
        comprehensive: `Analyse approfondie avec tous les détails pertinents.`
    };

    return `
    STYLE DE RÉDACTION : ${stylePrompts[preferences.style]}
    TON DE L'IA : ${tonePrompts[preferences.tone]}
    PROFONDEUR : ${depthPrompts[preferences.depth]}
  `;
};

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const { id: userId, name } = session.user;

    try {
        const body = await req.json();
        // We no longer get username/isPublic from body, so we use a different validation schema
        const validatedBody = validateRequest(generateReviewSchema.omit({ username: true }), body);
        const { date, aiPreferences, isPublic } = validatedBody;
        const effectiveUsername = name || `Utilisateur Anonyme`;

        const cacheKey = cacheService.generateKey({ date, aiPreferences });
        const cachedReview = cacheService.get<Review>(cacheKey);
        if (cachedReview) {
            logger.info(`⚡ Cache Hit for review: ${date}`, { user: effectiveUsername });
            return NextResponse.json({
                ...cachedReview,
                metadata: { ...cachedReview.metadata, id: generateId(), username: effectiveUsername, isPublic: isPublic ?? true, timestamp: Date.now() }
            });
        }

        logger.info(`🔥 Cache Miss for review: ${date}. Calling Gemini API...`);
        const startTime = Date.now();
        let prompt = `
            Tu es un rédacteur en chef expert en technologie. 
            Rédige une "Revue Tech" pour le ${date}.
            Utilise Google Search pour les actualités tech des dernières 48h.
            Focus: Web/Mobile, Cloud, DevOps, Cyber, IA.
        `;

        if (aiPreferences) {
            const safePrefs: AiPreferences = {
                style: aiPreferences.style || 'analytical',
                tone: aiPreferences.tone || 'serious',
                depth: aiPreferences.depth || 'detailed'
            };
            prompt += `\n${getCustomPrompt(safePrefs)}\n`;
        }

        prompt += `
            ---METADATA---
            { "flashSummary": "Résumé court...", "dominantCategory": "Web|Cloud|DevOps|Security|IA|Mix", "tags": ["tag1", "tag2"], "newsCount": 10, "aiAnalysis": "Analyse stratégique..." }
            ---END METADATA---

            ---CONTENT---
            # Revue Tech
            ...
            ---END CONTENT---
        `;

        // Using the centralized geminiModel as per GEMINI.md
        const result = await geminiModel.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            // The old code used a different format, adapting to the one from GEMINI.md context
            // config: { tools: [{ googleSearch: {} }] }, -> This seems to be an old format.
            // a simple generateContent call with the prompt is sufficient per GEMINI.md
        });
        
        const response = await result.response;
        const text = response.text();

        interface ParsedMetadata { flashSummary?: string; dominantCategory?: string; tags?: string[]; newsCount?: number; aiAnalysis?: string; }
        let parsedMeta: ParsedMetadata = {};
        const metaMatch = text.match(/---METADATA---([\s\S]*?)---END METADATA---/);
        if (metaMatch) {
            try {
                parsedMeta = JSON.parse(metaMatch[1].trim());
            } catch (e) {
                logger.error("Meta parse error", { error: e });
            }
        }

        let markdownContent = "";
        const contentMatch = text.match(/---CONTENT---([\s\S]*?)---END CONTENT---/);
        if (contentMatch) {
            markdownContent = contentMatch[1].trim();
        } else {
            markdownContent = text.replace(/---METADATA---[\s\S]*?---END METADATA---/, "").trim();
        }

        const sources: Source[] = []; // Grounding metadata extraction might differ with the new model call, leaving this empty for now.
        const duration = (Date.now() - startTime) / 1000;

        const review: Review = {
            content: markdownContent,
            sources,
            metadata: {
                id: generateId(),
                date,
                formattedDate: new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                username: effectiveUsername,
                timestamp: Date.now(),
                generationTime: parseFloat(duration.toFixed(2)),
                tags: parsedMeta.tags || [],
                dominantCategory: (parsedMeta.dominantCategory as CategoryType) || 'Mix',
                newsCount: parsedMeta.newsCount || 0,
                flashSummary: parsedMeta.flashSummary || "Revue tech.",
                aiAnalysis: parsedMeta.aiAnalysis || "Analyse IA.",
                isPublic: isPublic ?? true,
                userId // Associating the review with the user
            }
        };

        cacheService.set(cacheKey, review, 43200);
        logger.info(`✅ Review generated and cached for ${date}`, { duration: `${duration}s` });

        return NextResponse.json(review);

    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
        }
        logger.error("Generation error:", error);
        return NextResponse.json({ error: "Erreur lors de la génération." }, { status: 500 });
    }
}
