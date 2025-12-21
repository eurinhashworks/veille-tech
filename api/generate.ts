import { GoogleGenAI } from "@google/genai";
import { Review, Source, CategoryType } from "../types";
import { generateReviewSchema, validateRequest } from "../schemas/validation";
import express from 'express';

const defaultApiKey = process.env.API_KEY || '';
// Use the same initialization as in geminiService.ts
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
        analytical: `Adopte une approche factuelle et logique, en mettant l'accent sur les données et les analyses objectives. Structure ton analyse avec des chiffres, des tendances mesurables et des comparaisons factuelles.`,
        creative: `Offre une perspective originale et imaginative, en explorant des angles moins conventionnels. Utilise des métaphores, des analogies et des approches créatives pour rendre les concepts techniques plus accessibles.`,
        technical: `Concentre-toi sur les détails techniques approfondis et les aspects d'implémentation. Explique les architectures, les protocoles, les spécifications techniques et les implications de mise en œuvre.`,
        executive: `Prends un point de vue stratégique orienté business, en mettant en avant l'impact sur les décideurs. Analyse les implications financières, les opportunités de marché et les risques business.`
    };

    const tonePrompts: Record<AiTone, string> = {
        formal: `Utilise un langage professionnel et académique, approprié pour un contexte business. Sois précis, structuré et utilise un vocabulaire technique approprié.`,
        casual: `Adopte un ton conversationnel et accessible, plus proche du langage courant. Explique les concepts complexes de manière simple et engageante.`,
        humorous: `Intègre des touches d'humour subtil pour rendre le contenu plus engageant. Utilise des analogies amusantes et un ton léger sans perdre le sérieux de l'analyse.`,
        serious: `Maintiens un ton direct, grave et concentré sur l'essentiel. Sois concis, percutant et ne perds pas de temps en digressions.`
    };

    const depthPrompts: Record<AiDepth, string> = {
        brief: `Fournis l'essentiel uniquement, avec un focus sur la concision et la clarté. Limite-toi aux points les plus importants et évite les détails secondaires.`,
        detailed: `Offre un bon équilibre entre détails et lisibilité, couvrant les aspects importants. Développe les points clés avec suffisamment d'explications sans surcharger.`,
        comprehensive: `Donne une analyse approfondie avec tous les détails techniques et contextuels pertinents. Explore chaque sujet en profondeur avec des exemples concrets.`
    };

    return `
    STYLE DE RÉDACTION : ${stylePrompts[preferences.style]}
    TON DE L'IA : ${tonePrompts[preferences.tone]}
    PROFONDEUR : ${depthPrompts[preferences.depth]}
  `;
};

export default async function handler(req: express.Request, res: express.Response) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = validateRequest(generateReviewSchema, req.body);
        const { date, username, isPublic, aiPreferences, useCustomApiKey } = body;
        const effectiveUsername = username || "EUREKA User";

        if (!defaultApiKey) {
            return res.status(500).json({ error: "Clé API Gemini manquante côté serveur." });
        }

        const startTime = Date.now();
        let prompt = `
  Tu es un rédacteur en chef expert en technologie et une IA dotée d'un esprit critique aiguisé. 
  Ta mission est de rédiger une "Revue Tech" pour la date du ${date}.
  Utilise l'outil Google Search pour trouver les actualités technologiques les plus pertinentes des dernières 24-48 heures par rapport à cette date.
  
  Concentre tes recherches sur : Développement Web/Mobile, Cloud Computing, DevOps, Cybersécurité, et Intelligence Artificielle.
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
  ⚠️ INSTRUCTION SUR LE FORMAT :
  Ne renvoie PAS un seul objet JSON global. Sépare clairement les métadonnées (JSON pour le système) et le contenu (Texte Markdown pour le lecteur) avec des délimiteurs stricts.

  1. SECTION METADATA (Format JSON strict) :
  ---METADATA---
  {
      "flashSummary": "Un résumé très court...",
      "dominantCategory": "Une des valeurs: Web, Cloud, DevOps, Security, IA, Mix",
      "tags": ["tag1", "tag2", "tag3"],
      "newsCount": 10,
      "aiAnalysis": "Mon analyse : L'annonce d'aujourd'hui..."
  }
  ---END METADATA---

  2. SECTION CONTENT (Format TEXTE MARKDOWN pur) :
  ---CONTENT---
  # Revue Tech — [Date]
  ...
  ---END CONTENT---
  `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                tools: [{ googleSearch: {} }],
            },
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
            } catch (parseError) {
                console.error("Erreur de parsing des métadonnées:", parseError);
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
        if (candidates && candidates.length > 0) {
            const grounding = candidates[0].groundingMetadata;
            if (grounding && grounding.groundingChunks) {
                grounding.groundingChunks.forEach((chunk: any) => {
                    if (chunk.web?.uri) {
                        sources.push({
                            title: chunk.web.title || "Lien externe",
                            uri: chunk.web.uri
                        });
                    }
                });
            }
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

        return res.status(200).json(review);

    } catch (error: any) {
        console.error("Server-side generation error:", error);
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        return res.status(500).json({ error: error.message || "Erreur lors de la génération IA." });
    }
}
