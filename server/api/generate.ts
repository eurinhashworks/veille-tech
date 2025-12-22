import { GoogleGenAI } from "@google/genai";
import { Review, Source, CategoryType } from "../types";
import { generateReviewSchema, validateRequest } from "../schemas/validation";
import express from 'express';
import { CONFIG } from "../config";
import cacheService from "../lib/cacheService";
import logger from "../lib/logger";

const defaultApiKey = CONFIG.AI.GEMINI_API_KEY;
let ai = new GoogleGenAI({ apiKey: defaultApiKey });

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

export default async function handler(req: express.Request, res: express.Response) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const body = validateRequest(generateReviewSchema, req.body);
        const { date, username, isPublic, aiPreferences } = body;
        const effectiveUsername = username || `Utilisateur ${CONFIG.APP_NAME}`;

        // Generate cache key from core parameters (date + preferences)
        const cacheKey = cacheService.generateKey({ date, aiPreferences });

        // Check cache
        const cachedReview = cacheService.get<Review>(cacheKey);
        if (cachedReview) {
            logger.info(`⚡ Cache Hit for review: ${date}`, { user: effectiveUsername });
            return res.status(200).json({
                ...cachedReview,
                metadata: {
                    ...cachedReview.metadata,
                    id: generateId(),
                    username: effectiveUsername,
                    isPublic: isPublic ?? true,
                    timestamp: Date.now()
                }
            });
        }

        logger.info(`🔥 Cache Miss for review: ${date}. Calling Gemini API...`);

        if (!defaultApiKey) {
            logger.error("Configuration API incomplète: Clé manquante.");
            return res.status(500).json({ error: "Configuration API incomplète." });
        }

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
  {
      "flashSummary": "Résumé court...",
      "dominantCategory": "Web|Cloud|DevOps|Security|IA|Mix",
      "tags": ["tag1", "tag2"],
      "newsCount": 10,
      "aiAnalysis": "Analyse stratégique..."
  }
  ---END METADATA---

  ---CONTENT---
  # Revue Tech
  ...
  ---END CONTENT---
  `;

        const response = await ai.models.generateContent({
            model: CONFIG.AI.MODEL,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: { tools: [{ googleSearch: {} }] },
        });

        const text = response.text || "";

        interface ParsedMetadata {
            flashSummary?: string;
            dominantCategory?: string;
            tags?: string[];
            newsCount?: number;
            aiAnalysis?: string;
        }

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

        const sources: Source[] = [];
        const candidates = (response as any).candidates;
        if (candidates?.[0]?.groundingMetadata?.groundingChunks) {
            candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
                if (chunk.web?.uri) {
                    sources.push({
                        title: chunk.web.title || "Lien externe",
                        uri: chunk.web.uri
                    });
                }
            });
        }

        const duration = (Date.now() - startTime) / 1000;

        const review: Review = {
            content: markdownContent,
            sources: Array.from(new Map(sources.map(s => [s.uri, s])).values()),
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
                isPublic: isPublic ?? true
            }
        };

        // Cache for 12 hours
        cacheService.set(cacheKey, review, 43200);
        logger.info(`✅ Review generated and cached for ${date}`, { duration: `${duration}s` });

        return res.status(200).json(review);

    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Données invalides', details: error.errors });
        }
        logger.error("Generation error:", error);
        return res.status(500).json({ error: "Erreur lors de la génération." });
    }
}
