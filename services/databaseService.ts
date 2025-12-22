import { Review } from '../types';
import { CONFIG } from '../config';

const API_BASE = CONFIG.API_URL;

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// ==================== USER OPERATIONS ====================

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export const createUser = async (username: string, email?: string): Promise<User> => {
  return await fetchApi<User>('/users', {
    method: 'POST',
    body: JSON.stringify({ username, email }),
  });
};

export const getUserByUsername = async (username: string) => {
  return await fetchApi(`/users?username=${encodeURIComponent(username)}`);
};

export const getOrCreateUser = async (username: string) => {
  try {
    return await getUserByUsername(username);
  } catch (error) {
    // If not found (or other error), try to create
    return await createUser(username);
  }
};

// ==================== REVIEW OPERATIONS ====================

export const saveReview = async (review: Review, userId: string) => {
  return await fetchApi('/reviews', {
    method: 'POST',
    body: JSON.stringify({ review, userId }),
  });
};

export const getReviewByDate = async (date: string) => {
  return await fetchApi(`/reviews?date=${encodeURIComponent(date)}`);
};

export const getAllReviews = async (userId?: string, isPublic?: boolean) => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (isPublic !== undefined) params.append('isPublic', String(isPublic));

  return await fetchApi(`/reviews?${params.toString()}`);
};

export const getReviewsByDateRange = async (
  startDate: string,
  endDate: string,
  userId?: string
) => {
  const params = new URLSearchParams({ startDate, endDate });
  if (userId) params.append('userId', userId);

  return await fetchApi(`/reviews?${params.toString()}`);
};

export const searchReviews = async (
  query: string,
  filters?: {
    category?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
    userId?: string;
  }
) => {
  const params = new URLSearchParams({ q: query });
  if (filters?.category) params.append('category', filters.category);
  if (filters?.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);
  if (filters?.userId) params.append('userId', filters.userId);

  return await fetchApi(`/search?${params.toString()}`);
};

// ==================== FAVORITE OPERATIONS ====================

export const addFavorite = async (userId: string, reviewId: string) => {
  return await fetchApi('/favorites', {
    method: 'POST',
    body: JSON.stringify({ userId, reviewId }),
  });
};

export const removeFavorite = async (userId: string, reviewId: string) => {
  return await fetchApi(`/favorites?userId=${userId}&reviewId=${reviewId}`, {
    method: 'DELETE',
  });
};

export const getFavorites = async (userId: string) => {
  return await fetchApi(`/favorites?userId=${userId}`);
};

export const isFavorite = async (userId: string, reviewId: string) => {
  const result = await fetchApi<{ isFavorite: boolean }>(
    `/favorites?userId=${userId}&reviewId=${reviewId}&check=true`
  );
  return result.isFavorite;
};

// ==================== SEARCH HISTORY OPERATIONS ====================

export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: Record<string, any>;
  results: number;
  createdAt: string;
  user?: { username: string };
}

export const saveSearchHistory = async (
  userId: string,
  query: string,
  filters: Record<string, any>,
  results: number
): Promise<void> => {
  return await fetchApi<void>('/history', {
    method: 'POST',
    body: JSON.stringify({ userId, query, filters, results }),
  });
};

export const getSearchHistory = async (userId: string, limit = 10): Promise<SearchHistoryItem[]> => {
  return await fetchApi<SearchHistoryItem[]>(`/history?userId=${userId}&limit=${limit}`);
};

export const clearSearchHistory = async (userId: string): Promise<void> => {
  return await fetchApi<void>(`/history?userId=${userId}`, {
    method: 'DELETE',
  });
};

// ==================== USER SETTINGS OPERATIONS ====================

export const updateUserSettings = async (
  userId: string,
  settings: {
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
) => {
  return await fetchApi('/settings', {
    method: 'POST',
    body: JSON.stringify({ userId, settings }),
  });
};

export const getUserSettings = async (userId: string) => {
  return await fetchApi(`/settings?userId=${userId}`);
};

// ==================== STATISTICS ====================

export const getReviewStats = async (userId?: string) => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  return await fetchApi(`/stats?${params.toString()}`);
};

// ==================== TAGS ====================

export const getAllTags = async () => {
  return await fetchApi('/tags');
};

export const getPopularTags = async (limit = 10) => {
  return await fetchApi(`/tags?limit=${limit}`);
};