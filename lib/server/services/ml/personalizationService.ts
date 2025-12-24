import { UserProfileModel, UserProfile } from './models/UserProfileModel';
import { Review } from '../../../../types/types';
import { getAllReviews, getUserFavorites, getSearchHistory } from '../../services/storageService';

export class PersonalizationService {
  private profileModel: UserProfileModel;

  constructor() {
    this.profileModel = new UserProfileModel();
  }

  // Recommander revues
  async recommendReviews(
    userId: string,
    allReviews: Review[]
  ): Promise<Review[]> {
    // 1. Charger profil utilisateur
    const profile = await this.loadUserProfile(userId);

    // 2. Scorer chaque revue
    const scored = allReviews.map(review => ({
      review,
      score: this.profileModel.calculateRelevance(review, profile)
    }));

    // 3. Trier par score
    scored.sort((a, b) => b.score - a.score);

    // 4. Retourner top 10
    return scored.slice(0, 10).map(s => s.review);
  }

  private async loadUserProfile(userId: string): Promise<UserProfile> {
    const history = await getSearchHistory(userId);
    const favorites = await getUserFavorites(userId);

    // Get all reviews to extract data from favorites
    const { getAllReviews, getUserSettings } = await import('../../services/storageService');
    const allReviews = await getAllReviews();
    const favoriteReviews = allReviews.filter(r => favorites.some(fav => fav.reviewId === r.metadata.id));

    // Extract interests using the model's logic
    const interests = this.profileModel.extractInterests(favoriteReviews);

    // Get settings and infer tech stack from dominant categories in favorites
    const settings = await getUserSettings(userId);
    const techStackFromFavorites = Array.from(new Set(favoriteReviews.map(r => r.metadata.dominantCategory)));
    const techStack = (settings?.aiPreferences && typeof settings.aiPreferences === 'object' && 'style' in settings.aiPreferences ? [(settings.aiPreferences as any).style] : []) as string[];
    if (techStack.length === 0) {
      techStack.push(...(techStackFromFavorites.length > 0 ? techStackFromFavorites : ['IA', 'Web']));
    }

    // Calculate dynamic skill level based on variety of tags and history length
    const uniqueTags = new Set(favoriteReviews.flatMap(r => r.metadata.tags));
    const skillLevel = Math.min(0.3 + (uniqueTags.size * 0.05) + (history.length * 0.01), 1);

    // Convert search history to interaction history format
    const interactionHistory = history.map(item => ({
      reviewId: item.id, // Using search history item id as a proxy for reviewId
      timeSpent: 30, // Default time spent
      clicked: true, // Default clicked status
      favorited: favorites.some(fav => fav.reviewId === item.id) // Check if this search result was favorited
    }));

    return {
      userId,
      techStack,
      interests,
      interactionHistory,
      skillLevel
    };
  }
}