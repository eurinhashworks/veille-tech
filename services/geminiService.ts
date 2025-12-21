import { GoogleGenAI } from "@google/genai";
import { Review, Source, CategoryType } from "../types";

// Initialisation avec la clé API par défaut de l'application
const defaultApiKey = process.env.API_KEY || '';
let ai = new GoogleGenAI({ apiKey: defaultApiKey });

// Fonction pour mettre à jour la clé API
export const updateApiKey = (newApiKey: string) => {
  ai = new GoogleGenAI({ apiKey: newApiKey });
};

// Helper for simple ID generation
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Définition des types pour les paramètres d'IA
export interface AiPreferences {
  style: 'analytical' | 'creative' | 'technical' | 'executive';
  tone: 'formal' | 'casual' | 'humorous' | 'serious';
  depth: 'brief' | 'detailed' | 'comprehensive';
}

// Pré-prompts personnalisés en fonction des options choisies
const getCustomPrompt = (preferences: AiPreferences) => {
  const stylePrompts = {
    analytical: `Adopte une approche factuelle et logique, en mettant l'accent sur les données et les analyses objectives. Structure ton analyse avec des chiffres, des tendances mesurables et des comparaisons factuelles.`,
    creative: `Offre une perspective originale et imaginative, en explorant des angles moins conventionnels. Utilise des métaphores, des analogies et des approches créatives pour rendre les concepts techniques plus accessibles.`,
    technical: `Concentre-toi sur les détails techniques approfondis et les aspects d'implémentation. Explique les architectures, les protocoles, les spécifications techniques et les implications de mise en œuvre.`,
    executive: `Prends un point de vue stratégique orienté business, en mettant en avant l'impact sur les décideurs. Analyse les implications financières, les opportunités de marché et les risques business.`
  };

  const tonePrompts = {
    formal: `Utilise un langage professionnel et académique, approprié pour un contexte business. Sois précis, structuré et utilise un vocabulaire technique approprié.`,
    casual: `Adopte un ton conversationnel et accessible, plus proche du langage courant. Explique les concepts complexes de manière simple et engageante.`,
    humorous: `Intègre des touches d'humour subtil pour rendre le contenu plus engageant. Utilise des analogies amusantes et un ton léger sans perdre le sérieux de l'analyse.`,
    serious: `Maintiens un ton direct, grave et concentré sur l'essentiel. Sois concis, percutant et ne perds pas de temps en digressions.`
  };

  const depthPrompts = {
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

export const generateTechReview = async (
  date: string,
  username: string,
  isPublic: boolean,
  aiPreferences?: AiPreferences,
  useCustomApiKey: boolean = false
): Promise<Review> => {
  // Déterminer quelle clé API utiliser
  let currentAiInstance = ai;
  let apiKeyToUse = defaultApiKey;

  // Si l'utilisateur a configuré sa propre clé API et souhaite l'utiliser
  if (useCustomApiKey) {
    const customApiKey = localStorage.getItem('gemini_api_key');
    if (customApiKey) {
      currentAiInstance = new GoogleGenAI({ apiKey: customApiKey });
      apiKeyToUse = customApiKey;
    }
  }

  // Vérifier si une clé API est disponible
  if (!apiKeyToUse) {
    throw new Error("Clé API manquante. L'application nécessite une clé API Google Gemini pour fonctionner.");
  }

  const startTime = Date.now();

  // Construction du prompt personnalisé
  let prompt = `
  Tu es un rédacteur en chef expert en technologie et une IA dotée d'un esprit critique aiguisé. 
  Ta mission est de rédiger une "Revue Tech" pour la date du ${date}.
  Utilise l'outil Google Search pour trouver les actualités technologiques les plus pertinentes des dernières 24-48 heures par rapport à cette date.
  
  Concentre tes recherches sur : Développement Web/Mobile, Cloud Computing, DevOps, Cybersécurité, et Intelligence Artificielle.
  `;

  // Ajout des pré-prompts personnalisés si des préférences sont fournies
  if (aiPreferences) {
    prompt += `\n${getCustomPrompt(aiPreferences)}\n`;
  }

  prompt += `
  ⚠️ INSTRUCTION SUR LE FORMAT :
  Ne renvoie PAS un seul objet JSON global. Sépare clairement les métadonnées (JSON pour le système) et le contenu (Texte Markdown pour le lecteur) avec des délimiteurs stricts.

  1. SECTION METADATA (Format JSON strict, invisible pour l'utilisateur final) :
  Dans le champ "aiAnalysis", tu dois rédiger un paragraphe court (3-4 phrases) à la première personne ("Je pense", "Mon analyse") où tu donnes ton avis subjectif et stratégique sur la tendance globale du jour. Sois incisif, visionnaire, voire un peu provocateur.
  
  ---METADATA---
  {
      "flashSummary": "Un résumé très court (1-2 phrases) pour l'aperçu timeline.",
      "dominantCategory": "Une des valeurs exactes: Web, Cloud, DevOps, Security, IA, Mix",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "newsCount": 10,
      "aiAnalysis": "Mon analyse : L'annonce d'aujourd'hui confirme que..."
  }
  ---END METADATA---

  2. SECTION CONTENT (Format TEXTE MARKDOWN pur, visible par l'utilisateur) :
  C'est la partie qui sera lue. Elle doit être propre, aérée, sans JSON, prête à être copiée dans Word.
  Utilise des listes à puces claires, du gras (**gras**) pour les mots clés, et des titres standards (# Titre, ## Sous-titre).
  
  ---CONTENT---
  # Revue Tech — [Date]
  > Une punchline courte et inspirante.

  ### Résumé Flash
  Un paragraphe de 3 lignes max résumant la journée.

  ## [SEARCH] Search & Web
  * **Titre News 1** : Description courte et percutante.
  * **Titre News 2** : Description...

  ## [WEB] Web & Mobile Dev
  * **Titre News** : ...

  ## [CLOUD] Cloud Computing
  ...

  ## [DEVOPS] DevOps & Platform Engineering
  ...

  ## [SECURITY] Cybersécurité
  ...

  ## [IA] IA & Innovation
  ...
  
  ## Chiffres Clés du Jour
  * **Metric 1** : Valeur
  * **Metric 2** : Valeur

  ## Insight du jour (Editorial)
  Un paragraphe d'analyse factuelle et stratégique sur le marché.

  ## Impact
  * **Pour les développeurs** : Implications concrètes et actions recommandées
  * **Pour les entreprises** : Enjeux business et stratégiques
  * **Pour l'écosystème tech** : Tendances et évolutions à anticiper

  ## À surveiller demain
  ...

  ## Conclusion
  Une phrase de fin.

  #Hashtags
  #Tag1 #Tag2
  ---END CONTENT---

  Important : La section CONTENT ne doit contenir AUCUN artefact JSON (accolades, guillemets de code). Juste du texte Markdown propre.
  `;

  try {
    // Créer un contrôleur d'abandon pour pouvoir annuler la requête si nécessaire
    const controller = new AbortController();
    const { signal } = controller;

    // Exécuter la requête avec un timeout de 60 secondes
    const response = await Promise.race([
      currentAiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: La génération prend trop de temps')), 60000)
      )
    ]);

    const text = (response as any).text || "";

    // 1. Extract Metadata (JSON)
    interface MetaData {
      flashSummary: string;
      dominantCategory: string;
      tags: string[];
      newsCount: number;
      aiAnalysis: string;
    }

    let parsedMeta: MetaData = {
      flashSummary: "Résumé indisponible",
      dominantCategory: "Mix",
      tags: [],
      newsCount: 0,
      aiAnalysis: "L'IA analyse encore les données pour se forger une opinion..."
    };

    const metaMatch = text.match(/---METADATA---([\s\S]*?)---END METADATA---/);
    if (metaMatch && metaMatch[1]) {
      try {
        const cleanJson = metaMatch[1].replace(/```json/g, '').replace(/```/g, '').trim();
        parsedMeta = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Error parsing metadata JSON:", e, metaMatch[1]);
      }
    } else {
      // Fallback: try to find any JSON object in the beginning if delimiters are missing
      const jsonFallback = text.match(/\{[\s\S]*?\}/);
      if (jsonFallback) {
        try {
          parsedMeta = JSON.parse(jsonFallback[0]);
        } catch (e) { console.warn("Fallback JSON parse failed"); }
      }
    }

    // 2. Extract Content (Markdown)
    let markdownContent = "";
    const contentMatch = text.split('---CONTENT---');
    if (contentMatch.length > 1) {
      markdownContent = contentMatch[1].replace('---END CONTENT---', '').trim();
    } else {
      // Fallback: remove metadata part and take the rest
      markdownContent = text.replace(/---METADATA---[\s\S]*?---END METADATA---/, '').trim();
      // Cleanup accidental code blocks
      markdownContent = markdownContent.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    // Extract sources from grounding metadata
    const sources: Source[] = [];
    const groundingMetadata = (response as { candidates?: { groundingMetadata?: { groundingChunks?: { web?: { title?: string; uri?: string } }[] } }[] }).candidates?.[0]?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || new URL(chunk.web.uri).hostname,
            uri: chunk.web.uri,
          });
        }
      });
    }
    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const review: Review = {
      content: markdownContent || "Erreur: Contenu non généré.",
      sources: uniqueSources,
      metadata: {
        id: generateId(),
        date: date,
        formattedDate: new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        username: username.trim() || 'Anonyme',
        timestamp: Date.now(),
        generationTime: parseFloat(duration.toFixed(2)),
        tags: parsedMeta.tags || [],
        dominantCategory: (parsedMeta.dominantCategory as CategoryType) || 'Mix',
        newsCount: parsedMeta.newsCount || 0,
        flashSummary: parsedMeta.flashSummary || "Revue tech quotidienne.",
        aiAnalysis: parsedMeta.aiAnalysis || "Analyse en cours...",
        isPublic: isPublic
      }
    };

    return review;

  } catch (error: any) {
    console.error("Erreur génération:", error);

    // Si l'erreur est liée à une limite d'API, suggérer d'utiliser une clé personnalisée
    if (error.message && (error.message.includes('quota') || error.message.includes('limit'))) {
      throw new Error("Limite d'utilisation de l'API atteinte. Veuillez configurer votre propre clé API Google Gemini dans les paramètres.");
    }

    throw error;
  }
};