// MOCK Service for Visitor Stats (Client-side only)
// Replaces the direct Prisma database connection which cannot run in the browser.

const API_URL = '/api/visitors';

// Interface pour les statistiques des visiteurs
interface VisitorStats {
  id: string;
  date: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les visiteurs en temps réel
interface CurrentVisitors {
  id: string;
  count: number;
  lastReset: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchVisitorApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Visitor API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Incrémente le compteur de visiteurs pour la date actuelle
 */
export const incrementDailyVisitors = async (): Promise<VisitorStats> => {
  return await fetchVisitorApi('', {
    method: 'POST',
    body: JSON.stringify({ action: 'increment_daily' })
  });
};

/**
 * Incrémente le compteur de visiteurs en temps réel
 */
export const incrementCurrentVisitors = async (): Promise<CurrentVisitors> => {
  return await fetchVisitorApi('', {
    method: 'POST',
    body: JSON.stringify({ action: 'increment_current' })
  });
};

/**
 * Décrémente le compteur de visiteurs en temps réel
 */
export const decrementCurrentVisitors = async (): Promise<CurrentVisitors> => {
  return await fetchVisitorApi('', {
    method: 'POST',
    body: JSON.stringify({ action: 'decrement_current' })
  });
};

/**
 * Réinitialise le compteur de visiteurs en temps réel
 */
export const resetCurrentVisitors = async (): Promise<CurrentVisitors> => {
  // Not implemented in API yet, fallback to decrement for now or implement properly later
  console.warn('resetCurrentVisitors not fully implemented in API');
  return { id: '', count: 0, lastReset: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
};

/**
 * Obtient les statistiques des visiteurs pour la date actuelle
 */
export const getDailyVisitorStats = async (): Promise<VisitorStats | null> => {
  try {
    return await fetchVisitorApi('?type=daily');
  } catch (error) {
    return null;
  }
};

/**
 * Obtient le nombre total de visiteurs depuis toujours
 */
export const getTotalVisitors = async (): Promise<number> => {
  try {
    const data = await fetchVisitorApi<{ count: number }>('?type=total');
    return data.count;
  } catch (error) {
    return 0;
  }
};

/**
 * Obtient le nombre de visiteurs actuels
 */
export const getCurrentVisitors = async (): Promise<number> => {
  try {
    const data = await fetchVisitorApi<{ count: number }>('?type=current');
    return data.count;
  } catch (error) {
    return 0;
  }
};

/**
 * Obtient les statistiques des visiteurs pour une période donnée
 */
export const getVisitorStatsForPeriod = async (startDate: Date, endDate: Date): Promise<VisitorStats[]> => {
  // Not implemented in this iteration
  return [];
};