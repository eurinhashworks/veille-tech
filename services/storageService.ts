// Storage Service - Gère le stockage avec Prisma (base de données) et fallback localStorage
// Utilise Prisma pour la persistance en base de données PostgreSQL

import { Review } from '../types';

// Détection de l'environnement
const isServer = typeof window === 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';

// ==================== LOCAL STORAGE FALLBACK FUNCTIONS ====================

const saveReviewToStorage = async (review: Review): Promise<Review> => {
  try {
    const reviews = JSON.parse(localStorage.getItem('tech_reviews') || '[]');
    const existingIndex = reviews.findIndex((r: Review) => r.metadata.date === review.metadata.date);

    if (existingIndex >= 0) {
      reviews[existingIndex] = review;
    } else {
      reviews.unshift(review);
    }

    localStorage.setItem('tech_reviews', JSON.stringify(reviews.slice(0, 100))); // Limite à 100 revues
    console.log('💾 Revue sauvegardée dans localStorage');
    return review;
  } catch (error) {
    console.error('❌ Erreur sauvegarde localStorage:', error);
    throw error;
  }
};

const getAllReviewsFromStorage = async (): Promise<Review[]> => {
  try {
    const reviews = JSON.parse(localStorage.getItem('tech_reviews') || '[]');
    console.log(`💾 ${reviews.length} revues chargées depuis localStorage`);
    return reviews;
  } catch (error) {
    console.error('❌ Erreur chargement localStorage:', error);
    return [];
  }
};

const getReviewByDateFromStorage = async (date: string): Promise<Review | null> => {
  try {
    const reviews = JSON.parse(localStorage.getItem('tech_reviews') || '[]');
    const review = reviews.find((r: Review) => r.metadata.date === date);
    return review || null;
  } catch (error) {
    console.error('❌ Erreur recherche localStorage:', error);
    return null;
  }
};

const addFavoriteToStorage = async (reviewId: string): Promise<void> => {
  try {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(reviewId)) {
      favorites.push(reviewId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      console.log('💾 Favori ajouté dans localStorage');
    }
  } catch (error) {
    console.error('❌ Erreur ajout favori localStorage:', error);
  }
};

const removeFavoriteFromStorage = async (reviewId: string): Promise<void> => {
  try {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updated = favorites.filter((id: string) => id !== reviewId);
    localStorage.setItem('favorites', JSON.stringify(updated));
    console.log('💾 Favori retiré de localStorage');
  } catch (error) {
    console.error('❌ Erreur retrait favori localStorage:', error);
  }
};

const getFavoritesFromStorage = async (): Promise<string[]> => {
  try {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites;
  } catch (error) {
    console.error('❌ Erreur chargement favoris localStorage:', error);
    return [];
  }
};

const saveSearchHistoryToStorage = async (query: string, filters: Record<string, unknown>, results: number): Promise<void> => {
  try {
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    history.unshift({
      query,
      filters,
      results,
      timestamp: Date.now()
    });
    localStorage.setItem('search_history', JSON.stringify(history.slice(0, 50))); // Limite à 50 recherches
    console.log('💾 Recherche sauvegardée dans localStorage');
  } catch (error) {
    console.error('❌ Erreur sauvegarde historique localStorage:', error);
  }
};

import { SearchHistoryItem, User } from './databaseService';

const getSearchHistoryFromStorage = async (limit = 10): Promise<SearchHistoryItem[]> => {
  try {
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    return history.slice(0, limit);
  } catch (error) {
    console.error('❌ Erreur chargement historique localStorage:', error);
    return [];
  }
};

const getStatisticsFromStorage = async () => {
  try {
    const reviews = JSON.parse(localStorage.getItem('tech_reviews') || '[]');

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        totalNews: 0,
        avgGenerationTime: 0,
        categoryDistribution: {},
        topCategory: 'Mix'
      };
    }

    const totalNews = reviews.reduce((sum: number, r: Review) => sum + r.metadata.newsCount, 0);
    const avgGenerationTime = reviews.reduce((sum: number, r: Review) => sum + r.metadata.generationTime, 0) / reviews.length;

    const categoryDistribution: Record<string, number> = {};
    reviews.forEach((r: Review) => {
      categoryDistribution[r.metadata.dominantCategory] = (categoryDistribution[r.metadata.dominantCategory] || 0) + 1;
    });

    const topCategory = Object.entries(categoryDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mix';

    return {
      totalReviews: reviews.length,
      totalNews,
      avgGenerationTime: parseFloat(avgGenerationTime.toFixed(2)),
      categoryDistribution,
      topCategory
    };
  } catch (error) {
    console.error('❌ Erreur calcul statistiques localStorage:', error);
    return {
      totalReviews: 0,
      totalNews: 0,
      avgGenerationTime: 0,
      categoryDistribution: {},
      topCategory: 'Mix'
    };
  }
};

// ==================== HELPER: Convertir Review vers format Prisma ====================

const reviewToPrismaFormat = (review: Review, userId: string) => {
  return {
    id: review.metadata.id,
    date: review.metadata.date,
    formattedDate: review.metadata.formattedDate,
    content: review.content,
    flashSummary: review.metadata.flashSummary,
    aiAnalysis: review.metadata.aiAnalysis,
    dominantCategory: review.metadata.dominantCategory,
    newsCount: review.metadata.newsCount,
    generationTime: review.metadata.generationTime,
    isPublic: review.metadata.isPublic,
    userId,
    tags: review.metadata.tags,
    sources: review.sources,
  };
};

const prismaToReviewFormat = (prismaReview: Record<string, any>): Review => {
  return {
    metadata: {
      id: prismaReview.id,
      date: prismaReview.date,
      formattedDate: prismaReview.formattedDate,
      username: prismaReview.user?.username || 'Anonyme',
      timestamp: new Date(prismaReview.createdAt).getTime(),
      generationTime: prismaReview.generationTime,
      tags: prismaReview.tags?.map((t: { name: string }) => t.name) || [],
      dominantCategory: prismaReview.dominantCategory,
      newsCount: prismaReview.newsCount,
      flashSummary: prismaReview.flashSummary,
      aiAnalysis: prismaReview.aiAnalysis,
      isPublic: prismaReview.isPublic,
    },
    content: prismaReview.content,
    sources: prismaReview.sources?.map((s: { title: string; uri: string }) => ({
      title: s.title,
      uri: s.uri,
    })) || [],
  };
};

// ==================== REVIEWS ====================

export const saveReview = async (review: Review): Promise<Review> => {
  try {
    // Essayer d'utiliser Prisma
    const { saveReview: saveToDb } = await import('./databaseService');
    const { getOrCreateUser } = await import('./databaseService');

    // Obtenir ou créer l'utilisateur
    const user = await getOrCreateUser(review.metadata.username || 'Anonyme');

    // Sauvegarder dans la base de données
    const saved = await saveToDb(review, user.id);

    console.log('✅ Revue sauvegardée dans PostgreSQL:', saved?.id || 'unknown');

    return review;
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);

    // Fallback vers localStorage
    return await saveReviewToStorage(review);
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    // Essayer d'utiliser Prisma
    const { getAllReviews: getFromDb } = await import('./databaseService');

    const prismaReviews = await getFromDb();
    const reviews = prismaReviews.map(prismaToReviewFormat);

    console.log(`✅ ${reviews.length} revues chargées depuis PostgreSQL`);

    return reviews;
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);

    // Fallback vers localStorage
    return await getAllReviewsFromStorage();
  }
};

export const getReviewByDate = async (date: string): Promise<Review | null> => {
  try {
    // Essayer d'utiliser Prisma
    const { getReviewByDate: getFromDb } = await import('./databaseService');

    const prismaReview = await getFromDb(date);

    if (!prismaReview) return null;

    return prismaToReviewFormat(prismaReview);
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);

    // Fallback vers localStorage
    return await getReviewByDateFromStorage(date);
  }
};

// ==================== FAVORITES ====================

export const addToFavorites = async (userId: string, reviewId: string): Promise<void> => {
  try {
    const { addFavorite } = await import('./databaseService');
    await addFavorite(userId, reviewId);
    console.log('✅ Favori ajouté dans PostgreSQL');
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    await addFavoriteToStorage(reviewId);
  }
};

export const removeFromFavorites = async (userId: string, reviewId: string): Promise<void> => {
  try {
    const { removeFavorite } = await import('./databaseService');
    await removeFavorite(userId, reviewId);
    console.log('✅ Favori retiré de PostgreSQL');
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    await removeFavoriteFromStorage(reviewId);
  }
};

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const { getFavorites } = await import('./databaseService');
    const favorites = await getFavorites(userId);
    return favorites.map((f: { reviewId: string }) => f.reviewId);
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    return await getFavoritesFromStorage();
  }
};

// ==================== SEARCH HISTORY ====================

export const saveSearch = async (
  userId: string,
  query: string,
  filters: Record<string, unknown>,
  results: number
): Promise<void> => {
  try {
    const { saveSearchHistory } = await import('./databaseService');
    await saveSearchHistory(userId, query, filters, results);
    console.log('✅ Recherche sauvegardée dans PostgreSQL');
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    await saveSearchHistoryToStorage(query, filters, results);
  }
};

export const getSearchHistory = async (userId: string, limit = 10): Promise<SearchHistoryItem[]> => {
  try {
    const { getSearchHistory: getFromDb } = await import('./databaseService');
    const history = await getFromDb(userId, limit);
    return history;
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    const storageHistory = await getSearchHistoryFromStorage(limit);
    return storageHistory;
  }
};

// ==================== STATISTICS ====================

export const getStatistics = async (userId?: string) => {
  try {
    const { getReviewStats } = await import('./databaseService');
    const stats = await getReviewStats(userId);
    console.log('✅ Statistiques chargées depuis PostgreSQL');
    return stats;
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers statistiques par défaut:', error);
    // Retourner des statistiques par défaut pour que l'interface ne soit jamais vide
    return {
      totalReviews: 0,
      totalNews: 0,
      avgGenerationTime: 0,
      categoryDistribution: {},
      topCategory: 'Mix'
    };
  }
};

// ==================== AI PREFERENCES ====================

export const saveAiPreferences = async (
  userId: string,
  preferences: {
    style: 'analytical' | 'creative' | 'technical' | 'executive';
    tone: 'formal' | 'casual' | 'humorous' | 'serious';
    depth: 'brief' | 'detailed' | 'comprehensive';
  }
): Promise<void> => {
  try {
    const { updateUserSettings } = await import('./databaseService');
    await updateUserSettings(userId, {
      aiPreferences: preferences
    });
    console.log('✅ Préférences IA sauvegardées dans PostgreSQL');
  } catch (error) {
    console.warn('⚠️ Erreur lors de la sauvegarde des préférences IA:', error);
  }
};

export const getAiPreferences = async (
  userId: string
): Promise<{
  style: 'analytical' | 'creative' | 'technical' | 'executive';
  tone: 'formal' | 'casual' | 'humorous' | 'serious';
  depth: 'brief' | 'detailed' | 'comprehensive';
} | null> => {
  try {
    const { getUserSettings } = await import('./databaseService');
    const settings = await getUserSettings(userId) as UserSettings;

    if (settings?.aiPreferences) {
      return settings.aiPreferences;
    }

    return null;
  } catch (error) {
    console.warn('⚠️ Erreur lors de la récupération des préférences IA:', error);
    return null;
  }
};

// ==================== INITIALIZATION ====================

export const initializeStorage = async (): Promise<void> => {
  try {
    // Ne plus initialiser avec des données mock
    console.log('📦 Initialisation du stockage sans données mock');
  } catch (error) {
    console.warn('⚠️ Erreur lors de l\'initialisation');
  }
};

// Types pour les préférences utilisateur
interface UserSettings {
  theme?: string;
  defaultVisibility?: string;
  notifications?: boolean;
  autoGenerate?: boolean;
  aiPreferences?: {
    style: 'analytical' | 'creative' | 'technical' | 'executive';
    tone: 'formal' | 'casual' | 'humorous' | 'serious';
    depth: 'brief' | 'detailed' | 'comprehensive';
  };
}

// Fonction pour obtenir les paramètres utilisateur
export const getUserSettings = async (): Promise<UserSettings> => {
  // Pour le moment, nous utilisons localStorage comme solution temporaire
  // Dans une version future, cela pourrait être migré vers une base de données
  const settings: UserSettings = {
    theme: localStorage.getItem('theme') || 'dark',
    defaultVisibility: localStorage.getItem('default_visibility') || 'public',
    notifications: localStorage.getItem('notifications') === 'true',
    autoGenerate: localStorage.getItem('auto_generate') === 'true',
    aiPreferences: {
      style: (localStorage.getItem('ai_style') as 'analytical' | 'creative' | 'technical' | 'executive') || 'analytical',
      tone: (localStorage.getItem('ai_tone') as 'formal' | 'casual' | 'humorous' | 'serious') || 'formal',
      depth: (localStorage.getItem('ai_depth') as 'brief' | 'detailed' | 'comprehensive') || 'detailed'
    }
  };

  return settings;
};

// Fonction pour sauvegarder les paramètres utilisateur
export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  // Sauvegarder dans localStorage
  if (settings.theme) localStorage.setItem('theme', settings.theme);
  if (settings.defaultVisibility) localStorage.setItem('default_visibility', settings.defaultVisibility);
  if (settings.notifications !== undefined) localStorage.setItem('notifications', settings.notifications.toString());
  if (settings.autoGenerate !== undefined) localStorage.setItem('auto_generate', settings.autoGenerate.toString());

  // Sauvegarder les préférences IA
  if (settings.aiPreferences) {
    localStorage.setItem('ai_style', settings.aiPreferences.style);
    localStorage.setItem('ai_tone', settings.aiPreferences.tone);
    localStorage.setItem('ai_depth', settings.aiPreferences.depth);
  }
};

// ==================== DATA EXPORT/IMPORT ====================

/**
 * Exporte toutes les données de l'application
 * @returns Un objet contenant toutes les données
 */
export const exportAllData = async () => {
  try {
    // Récupérer toutes les revues
    const reviews = await getAllReviews();

    // Récupérer les favoris
    const favorites = await getUserFavorites('anonymous'); // Pour le moment, on utilise un ID anonyme

    // Récupérer l'historique de recherche
    const searchHistory = await getSearchHistory('anonymous', 100); // Récupérer jusqu'à 100 éléments

    // Récupérer les statistiques
    const statistics = await getStatistics();

    return {
      reviews,
      favorites,
      searchHistory,
      statistics,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'export des données:', error);
    throw error;
  }
};

/**
 * Importe des données dans l'application
 * @param data Les données à importer
 */
export const importData = async (data: { reviews?: Review[]; favorites?: string[] }) => {
  try {
    // Importer les revues
    if (data.reviews && Array.isArray(data.reviews)) {
      for (const review of data.reviews) {
        try {
          await saveReview(review);
        } catch (error) {
          console.warn('⚠️ Erreur lors de l\'import d\'une revue:', error);
        }
      }
    }

    // Importer les favoris
    if (data.favorites && Array.isArray(data.favorites)) {
      for (const reviewId of data.favorites) {
        try {
          await addToFavorites('anonymous', reviewId); // Pour le moment, on utilise un ID anonyme
        } catch (error) {
          console.warn('⚠️ Erreur lors de l\'import d\'un favori:', error);
        }
      }
    }

    console.log('✅ Données importées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des données:', error);
    throw error;
  }
};
