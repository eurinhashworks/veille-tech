import { GoogleGenAI } from "@google/genai";
import { Review, Source, CategoryType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper for simple ID generation
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const generateTechReview = async (date: string, username: string, isPublic: boolean): Promise<Review> => {
  if (!process.env.API_KEY) {
    throw new Error("Clé API manquante.");
  }

  const startTime = Date.now();

  // Prompt engineered to separate Metadata (hidden logic) from Content (visible text)
  const prompt = `
  Tu es un rédacteur en chef expert en technologie et une IA dotée d'un esprit critique aiguisé. 
  Ta mission est de rédiger une "Revue Tech" pour la date du ${date}.
  Utilise l'outil Google Search pour trouver les actualités technologiques les plus pertinentes des dernières 24-48 heures par rapport à cette date.
  
  Concentre tes recherches sur : Développement Web/Mobile, Cloud Computing, DevOps, Cybersécurité, et Intelligence Artificielle.

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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // 1. Extract Metadata (JSON)
    let parsedMeta: any = {
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
             } catch(e) { console.warn("Fallback JSON parse failed"); }
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
        markdownContent = markdownContent.replace(/```json/g, '').replace(/```markdown/g, '').replace(/```/g, '').trim();
    }
    
    // Extract sources from grounding metadata
    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
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

  } catch (error) {
    console.error("Erreur génération:", error);
    throw error;
  }
};