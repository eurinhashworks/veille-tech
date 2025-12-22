import { Review } from '../types';

export interface AiPreferences {
  style: 'analytical' | 'creative' | 'technical' | 'executive';
  tone: 'formal' | 'casual' | 'humorous' | 'serious';
  depth: 'brief' | 'detailed' | 'comprehensive';
}

/**
 * Génère une revue technique via l'API backend (sécurisé)
 * @param date La date pour laquelle générer la revue
 * @param username Le nom d'utilisateur
 * @param isPublic Si la revue est publique
 * @param aiPreferences Les préférences d'IA
 * @returns La revue générée
 */
export const generateReviewWithLimitHandling = async (
  date: string,
  username: string,
  isPublic: boolean,
  aiPreferences?: AiPreferences
): Promise<Review> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        username,
        isPublic,
        aiPreferences
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Erreur serveur (${response.status})`;

      // Gestion spécifique des quotas/limites pour guider l'utilisateur
      if (errorMessage.toLowerCase().includes('limit') || errorMessage.toLowerCase().includes('quota')) {
        throw new Error("Limite d'utilisation de l'API atteinte. Veuillez réessayer plus tard ou configurer votre propre clé API dans les paramètres.");
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API de génération:", error);
    throw error;
  }
};