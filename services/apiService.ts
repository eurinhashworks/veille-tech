// API Service - Interface entre le client et le stockage des données
// Pour l'instant utilise localStorage, mais peut être facilement remplacé par des appels API

import { Review } from '../types';

const STORAGE_KEYS = {
  REVIEWS: 'techpulse_reviews',
  FAVORITES: 'techpulse_favorites',
  SEARCH_HISTORY: 'techpulse_search_history',
  USER: 'techpulse_current_user',
};

// ==================== REVIEWS ====================

export const saveReviewToStorage = async (review: Review): Promise<Review> => {
  const reviews = await getAllReviewsFromStorage();
  const existingIndex = reviews.findIndex(r => r.metadata.id === review.metadata.id);
  
  if (existingIndex >= 0) {
    reviews[existingIndex] = review;
  } else {
    reviews.unshift(review);
  }
  
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return review;
};

export const getAllReviewsFromStorage = async (): Promise<Review[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const getReviewByDate = async (date: string): Promise<Review | null> => {
  const reviews = await getAllReviewsFromStorage();
  return reviews.find(r => r.metadata.date === date) || null;
};

export const deleteReview = async (id: string): Promise<void> => {
  const reviews = await getAllReviewsFromStorage();
  const filtered = reviews.filter(r => r.metadata.id !== id);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(filtered));
};

// ==================== FAVORITES ====================

export const getFavorites = async (): Promise<string[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addFavorite = async (reviewId: string): Promise<void> => {
  const favorites = await getFavorites();
  if (!favorites.includes(reviewId)) {
    favorites.push(reviewId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }
};

export const removeFavorite = async (reviewId: string): Promise<void> => {
  const favorites = await getFavorites();
  const filtered = favorites.filter(id => id !== reviewId);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
};

export const isFavorite = async (reviewId: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(reviewId);
};

// ==================== SEARCH HISTORY ====================

export interface SearchHistoryEntry {
  id: string;
  query: string;
  filters: any;
  results: number;
  timestamp: number;
}

export const saveSearchHistory = async (
  query: string,
  filters: any,
  results: number
): Promise<void> => {
  const history = await getSearchHistory();
  const entry: SearchHistoryEntry = {
    id: Date.now().toString(),
    query,
    filters,
    results,
    timestamp: Date.now(),
  };
  
  history.unshift(entry);
  
  // Garder seulement les 50 dernières recherches
  const limited = history.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limited));
};

export const getSearchHistory = async (limit = 10): Promise<SearchHistoryEntry[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
  if (!stored) return [];
  
  try {
    const history = JSON.parse(stored);
    return history.slice(0, limit);
  } catch {
    return [];
  }
};

export const clearSearchHistory = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
};

// ==================== STATISTICS ====================

export const getStatistics = async () => {
  const reviews = await getAllReviewsFromStorage();
  
  const totalReviews = reviews.length;
  const totalNews = reviews.reduce((sum, r) => sum + r.metadata.newsCount, 0);
  const avgGenerationTime = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.metadata.generationTime, 0) / reviews.length
    : 0;
  
  // Distribution par catégorie
  const categoryDistribution: Record<string, number> = {
    'Web': 0,
    'Cloud': 0,
    'DevOps': 0,
    'Security': 0,
    'IA': 0,
    'Mix': 0,
  };
  
  reviews.forEach(r => {
    categoryDistribution[r.metadata.dominantCategory]++;
  });
  
  // Top catégorie
  const topCategory = Object.entries(categoryDistribution)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mix';
  
  return {
    totalReviews,
    totalNews,
    avgGenerationTime: parseFloat(avgGenerationTime.toFixed(2)),
    categoryDistribution,
    topCategory,
  };
};

// ==================== EXPORT ====================

export const exportAllData = async () => {
  const reviews = await getAllReviewsFromStorage();
  const favorites = await getFavorites();
  const searchHistory = await getSearchHistory(50);
  
  return {
    reviews,
    favorites,
    searchHistory,
    exportDate: new Date().toISOString(),
  };
};

export const importData = async (data: any): Promise<void> => {
  if (data.reviews) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(data.reviews));
  }
  if (data.favorites) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(data.favorites));
  }
  if (data.searchHistory) {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(data.searchHistory));
  }
};

// ==================== INITIALIZATION ====================

export const initializeWithMockData = async (mockReviews: Review[]): Promise<void> => {
  const existing = await getAllReviewsFromStorage();
  if (existing.length === 0) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(mockReviews));
  }
};
