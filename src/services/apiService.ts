import { generateTechReview, AiPreferences } from './geminiService';

/**
 * Génère une revue technique avec gestion automatique des limites d'API
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
) => {
  // D'abord, essayer avec la clé API par défaut
  try {
    return await generateTechReview(date, username, isPublic, aiPreferences, false);
  } catch (error) {
    const err = error as Error;
    // Si l'erreur est liée à une limite d'API, essayer avec la clé personnalisée
    if (err.message && (err.message.includes('Limite') || err.message.includes('quota') || err.message.includes('limit'))) {
      const customApiKey = localStorage.getItem('gemini_api_key');

      // Vérifier si l'utilisateur a configuré une clé API personnalisée
      if (customApiKey) {
        try {
          return await generateTechReview(date, username, isPublic, aiPreferences, true);
        } catch (customKeyError) {
          // Si la clé personnalisée échoue aussi, renvoyer l'erreur d'origine avec un message plus clair
          throw new Error(`Impossible de générer la revue avec votre clé API personnalisée. ${customKeyError.message || 'Veuillez vérifier votre clé API dans les paramètres.'}`);
        }
      } else {
        // Si l'utilisateur n'a pas de clé personnalisée, renvoyer un message explicite
        throw new Error("Limite d'utilisation de l'API atteinte. Veuillez configurer votre propre clé API Google Gemini dans les paramètres pour continuer à générer des revues.");
      }
    }

    // Pour toutes les autres erreurs, les renvoyer telles quelles
    throw error;
  }
};