import { AdaptiveIntelligenceModel, AdaptationProfile, LearningPattern, AdaptationRule } from './models/AdaptiveIntelligenceModel';
import { UserProfile } from './models/UserProfileModel';
import { Review } from '../../../../types/types';
import { getSearchHistory, getUserSettings, saveUserSettings, getUserFavorites } from '../../services/storageService';

export class AdaptiveIntelligenceService {
  private model: AdaptiveIntelligenceModel;

  constructor() {
    this.model = new AdaptiveIntelligenceModel();
  }

  // Adapter la veille pour un utilisateur
  async adaptUserWatch(userId: string): Promise<AdaptationProfile> {
    // Récupérer les données de l'utilisateur
    const userProfile = await this.getUserProfile(userId);
    const learningPatterns = await this.getUserLearningPatterns(userId);
    const adaptationRules = await this.getUserRules(userId);

    // Générer des règles d'adaptation supplémentaires basées sur les patterns
    const generatedRules = this.model.generateAdaptationRules(userProfile, learningPatterns);
    const allRules = [...adaptationRules, ...generatedRules];

    // Adapter les préférences
    const newProfile = this.model.adaptUserPreferences(userProfile, learningPatterns, allRules);

    // Sauvegarder le profil d'adaptation (via settings dans cette implémentation simple)
    await this.saveAdaptationProfile(newProfile);

    return newProfile;
  }

  private async getUserProfile(userId: string): Promise<UserProfile> {
    const history = await getSearchHistory(userId);
    const favorites = await getUserFavorites(userId);

    // Convertir l'historique de recherche au format d'historique d'interaction attendu
    const interactionHistory = history.map(item => ({
      reviewId: item.id, // Utilisation de l'ID de l'élément d'historique comme ID de revue
      timeSpent: 30, // Temps par défaut passé sur chaque élément
      clicked: true, // Statut par défaut
      favorited: favorites.some(fav => fav.reviewId === item.id) // Vérifier si cet élément a été mis en favori
    }));

    return {
      userId,
      techStack: [],
      interests: [], // Devrait être extrait des favoris si nécessaire
      interactionHistory,
      skillLevel: 0.5
    };
  }

  private async getUserLearningPatterns(userId: string): Promise<LearningPattern[]> {
    const history = await getSearchHistory(userId);
    const patterns: LearningPattern[] = [];

    if (history.length > 5) {
      // Analyser la fréquence des recherches
      const queries = history.map(h => h.query.toLowerCase());
      const categories = history
        .map(h => typeof h.filters === 'object' && h.filters !== null ? (h.filters as any).category : undefined)
        .filter(Boolean);

      // Détecter une préférence pour l'IA
      if (categories.filter(c => c === 'IA').length > history.length / 2) {
        patterns.push({
          userId,
          behaviorType: 'searching',
          contentCategory: 'IA',
          timeSpent: 30, // Estimation
          engagementScore: 0.9,
          timestamp: Date.now()
        });
      }

      // Détecter des recherches techniques (ex: avec des mots clés spécifiques)
      const technicalKeywords = ['api', 'prisma', 'docker', 'kubernetes', 'cloud', 'backend'];
      const techMatchCount = queries.filter(q => technicalKeywords.some(k => q.includes(k))).length;
      if (techMatchCount > 2) {
        patterns.push({
          userId,
          behaviorType: 'searching',
          contentCategory: 'Mix',
          timeSpent: 60, // Estimation
          engagementScore: 0.7,
          timestamp: Date.now()
        });
      }
    }

    return patterns;
  }

  private async getUserRules(userId: string): Promise<AdaptationRule[]> {
    const history = await getSearchHistory(userId, 20);
    const rules: AdaptationRule[] = [];

    // Ajouter une règle si l'utilisateur recherche souvent mais ne favorise pas (besoin de plus de profondeur ?)
    const favorites = await getUserFavorites(userId);
    if (history.length > 10 && favorites.length === 0) {
      rules.push({
        id: 'rule-depth-adjustment',
        condition: 'low-engagement-to-content',
        action: 'increase-content-depth',
        priority: 2,
        active: true
      });
    }

    return rules;
  }

  private async saveAdaptationProfile(profile: AdaptationProfile): Promise<void> {
    // Dans une implémentation réelle, on sauvegarderait le profil complet
    // Ici on simule par un log
    console.log(`Profil d'adaptation mis à jour pour ${profile.userId}`);
  }

  // Détecter les changements dans les préférences de l'utilisateur
  async detectPreferenceChanges(userId: string): Promise<string[]> {
    const newProfile = await this.adaptUserWatch(userId);
    return [`Profil d'adaptation mis à jour pour l'utilisateur ${userId}`];
  }

  // Obtenir les préférences adaptées pour un utilisateur
  async getAdaptedPreferences(userId: string) {
    const profile = await this.adaptUserWatch(userId);
    return profile.preferences;
  }

  // Obtenir les règles d'adaptation actives pour un utilisateur
  async getActiveAdaptationRules(userId: string): Promise<AdaptationRule[]> {
    const profile = await this.adaptUserWatch(userId);
    return profile.adaptationRules.filter(rule => rule.active);
  }

  // Personnaliser la veille basée sur les préférences adaptées
  async customizeWatchContent(userId: string, reviews: Review[]): Promise<Review[]> {
    const preferences = await this.getAdaptedPreferences(userId);
    let filteredReviews = [...reviews];

    if (preferences.contentDepth === 'shallow') {
      filteredReviews = filteredReviews.sort((a, b) => b.metadata.newsCount - a.metadata.newsCount);
    } else if (preferences.contentDepth === 'deep') {
      filteredReviews = filteredReviews.sort((a, b) => b.metadata.generationTime - a.metadata.generationTime);
    }

    return filteredReviews;
  }

  // Obtenir les suggestions d'amélioration pour l'utilisateur
  async getImprovementSuggestions(userId: string) {
    const profile = await this.adaptUserWatch(userId);
    const suggestions: string[] = [];
    const lastEffectiveness = profile.adaptationHistory.length > 0
      ? profile.adaptationHistory[profile.adaptationHistory.length - 1].effectiveness
      : 0.5;

    if (lastEffectiveness < 0.5) {
      suggestions.push("Considérez d'ajuster vos préférences de contenu pour une meilleure pertinence");
    } else if (lastEffectiveness < 0.7) {
      suggestions.push("Votre expérience de veille peut être améliorée en ajustant certains paramètres");
    } else {
      suggestions.push("Excellent! Votre profil de veille est bien adapté à vos préférences");
    }

    return suggestions;
  }

  // Mettre à jour les patterns d'apprentissage
  async updateLearningPatterns(userId: string, newPatterns: LearningPattern[]): Promise<void> {
    await this.adaptUserWatch(userId);
  }
}