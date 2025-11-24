// Storage Service - Gère le stockage avec Prisma (base de données) et fallback localStorage
// Utilise Prisma pour la persistance en base de données PostgreSQL

import { Review } from '../types';

// Détection de l'environnement
const isServer = typeof window === 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';

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

const prismaToReviewFormat = (prismaReview: any): Review => {
  return {
    metadata: {
      id: prismaReview.id,
      date: prismaReview.date,
      formattedDate: prismaReview.formattedDate,
      username: prismaReview.user?.username || 'Anonyme',
      timestamp: new Date(prismaReview.createdAt).getTime(),
      generationTime: prismaReview.generationTime,
      tags: prismaReview.tags?.map((t: any) => t.name) || [],
      dominantCategory: prismaReview.dominantCategory,
      newsCount: prismaReview.newsCount,
      flashSummary: prismaReview.flashSummary,
      aiAnalysis: prismaReview.aiAnalysis,
      isPublic: prismaReview.isPublic,
    },
    content: prismaReview.content,
    sources: prismaReview.sources?.map((s: any) => ({
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
    const user = await getOrCreateUser(review.metadata.username || 'Anonyme') as any;
    
    // Sauvegarder dans la base de données
    const saved = await saveToDb(review, user.id) as any;
    
    console.log('✅ Revue sauvegardée dans PostgreSQL:', saved?.id || 'unknown');
    
    return review;
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    
    // Fallback vers localStorage
    const { saveReviewToStorage } = await import('./apiService');
    return await saveReviewToStorage(review);
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    // Essayer d'utiliser Prisma
    const { getAllReviews: getFromDb } = await import('./databaseService');
    
    const prismaReviews = await getFromDb() as any[];
    const reviews = prismaReviews.map(prismaToReviewFormat);
    
    console.log(`✅ ${reviews.length} revues chargées depuis PostgreSQL`);
    
    return reviews;
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    
    // Fallback vers localStorage
    const { getAllReviewsFromStorage } = await import('./apiService');
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
    const { getReviewByDate: getFromStorage } = await import('./apiService');
    return await getFromStorage(date);
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
    const { addFavorite: addToStorage } = await import('./apiService');
    await addToStorage(reviewId);
  }
};

export const removeFromFavorites = async (userId: string, reviewId: string): Promise<void> => {
  try {
    const { removeFavorite } = await import('./databaseService');
    await removeFavorite(userId, reviewId);
    console.log('✅ Favori retiré de PostgreSQL');
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    const { removeFavorite: removeFromStorage } = await import('./apiService');
    await removeFromStorage(reviewId);
  }
};

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const { getFavorites } = await import('./databaseService');
    const favorites = await getFavorites(userId) as any[];
    return favorites.map((f: any) => f.reviewId);
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    const { getFavorites: getFromStorage } = await import('./apiService');
    return await getFromStorage();
  }
};

// ==================== SEARCH HISTORY ====================

export const saveSearch = async (
  userId: string,
  query: string,
  filters: any,
  results: number
): Promise<void> => {
  try {
    const { saveSearchHistory } = await import('./databaseService');
    await saveSearchHistory(userId, query, filters, results);
    console.log('✅ Recherche sauvegardée dans PostgreSQL');
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    const { saveSearchHistory: saveToStorage } = await import('./apiService');
    await saveToStorage(query, filters, results);
  }
};

export const getSearchHistory = async (userId: string, limit = 10): Promise<any[]> => {
  try {
    const { getSearchHistory: getFromDb } = await import('./databaseService');
    const history = await getFromDb(userId, limit) as any[];
    return history;
  } catch (error) {
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    const { getSearchHistory: getFromStorage } = await import('./apiService');
    const storageHistory = await getFromStorage(limit);
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
    console.warn('⚠️ Erreur Prisma, fallback vers localStorage:', error);
    const { getStatistics: getFromStorage } = await import('./apiService');
    return await getFromStorage();
  }
};

// ==================== INITIALIZATION ====================

export const initializeStorage = async (mockReviews: Review[]): Promise<void> => {
  try {
    // Vérifier si des revues existent déjà
    const existing = await getAllReviews();
    
    if (existing.length === 0) {
      console.log('📦 Initialisation avec les données mock...');
      
      // Créer un utilisateur par défaut
      const { getOrCreateUser } = await import('./databaseService');
      const user = await getOrCreateUser('Anonyme');
      
      // Sauvegarder les mock reviews
      for (const review of mockReviews) {
        await saveReview(review);
      }
      
      console.log(`✅ ${mockReviews.length} revues mock initialisées`);
    }
  } catch (error) {
    console.warn('⚠️ Erreur lors de l\'initialisation, utilisation de localStorage');
    const { initializeWithMockData } = await import('./apiService');
    await initializeWithMockData(mockReviews);
  }
};
