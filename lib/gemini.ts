import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY!
);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

/**
 * Génère du texte à partir d'un prompt.
 * @param prompt - Le texte d'entrée à soumettre à Gemini
 * @param options - Options additionnelles (température, etc.)
 * @returns Le texte généré par le modèle
 * @throws Error si la génération échoue
 */
export async function generateContent(
  prompt: string,
  options?: {
    temperature?: number;
    maxOutputTokens?: number;
  }
): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erreur lors de la génération de contenu:", error);
    throw new Error("Impossible de générer le contenu avec Gemini");
  }
}