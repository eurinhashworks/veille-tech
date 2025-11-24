import { prisma } from '../lib/prisma';

// Interface pour les statistiques des visiteurs
interface VisitorStats {
  id: string;
  date: Date;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les visiteurs en temps réel
interface CurrentVisitors {
  id: string;
  count: number;
  lastReset: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Incrémente le compteur de visiteurs pour la date actuelle
 */
export const incrementDailyVisitors = async (): Promise<VisitorStats> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer uniquement la date

    // Mettre à jour ou créer l'entrée pour aujourd'hui
    const stats = await prisma.visitorStats.upsert({
      where: { date: today },
      update: { 
        count: { increment: 1 },
        updatedAt: new Date()
      },
      create: { 
        date: today,
        count: 1
      }
    });

    return stats;
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des visiteurs quotidiens:', error);
    throw error;
  }
};

/**
 * Incrémente le compteur de visiteurs en temps réel
 */
export const incrementCurrentVisitors = async (): Promise<CurrentVisitors> => {
  try {
    // Obtenir ou créer l'entrée pour les visiteurs actuels
    let currentVisitors = await prisma.currentVisitors.findFirst();
    
    if (!currentVisitors) {
      // Créer l'entrée si elle n'existe pas
      currentVisitors = await prisma.currentVisitors.create({
        data: {
          count: 1
        }
      });
    } else {
      // Mettre à jour le compteur
      currentVisitors = await prisma.currentVisitors.update({
        where: { id: currentVisitors.id },
        data: { 
          count: { increment: 1 },
          updatedAt: new Date()
        }
      });
    }

    return currentVisitors;
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des visiteurs actuels:', error);
    throw error;
  }
};

/**
 * Décrémente le compteur de visiteurs en temps réel
 */
export const decrementCurrentVisitors = async (): Promise<CurrentVisitors> => {
  try {
    // Obtenir l'entrée pour les visiteurs actuels
    let currentVisitors = await prisma.currentVisitors.findFirst();
    
    if (currentVisitors && currentVisitors.count > 0) {
      // Mettre à jour le compteur
      currentVisitors = await prisma.currentVisitors.update({
        where: { id: currentVisitors.id },
        data: { 
          count: { decrement: 1 },
          updatedAt: new Date()
        }
      });
    }

    return currentVisitors || { 
      id: '', 
      count: 0, 
      lastReset: new Date(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
  } catch (error) {
    console.error('Erreur lors de la décrémentation des visiteurs actuels:', error);
    throw error;
  }
};

/**
 * Réinitialise le compteur de visiteurs en temps réel
 */
export const resetCurrentVisitors = async (): Promise<CurrentVisitors> => {
  try {
    // Obtenir ou créer l'entrée pour les visiteurs actuels
    let currentVisitors = await prisma.currentVisitors.findFirst();
    
    if (!currentVisitors) {
      // Créer l'entrée si elle n'existe pas
      currentVisitors = await prisma.currentVisitors.create({
        data: {
          count: 0,
          lastReset: new Date()
        }
      });
    } else {
      // Réinitialiser le compteur
      currentVisitors = await prisma.currentVisitors.update({
        where: { id: currentVisitors.id },
        data: { 
          count: 0,
          lastReset: new Date(),
          updatedAt: new Date()
        }
      });
    }

    return currentVisitors;
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des visiteurs actuels:', error);
    throw error;
  }
};

/**
 * Obtient les statistiques des visiteurs pour la date actuelle
 */
export const getDailyVisitorStats = async (): Promise<VisitorStats | null> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer uniquement la date

    const stats = await prisma.visitorStats.findUnique({
      where: { date: today }
    });

    return stats;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques quotidiennes:', error);
    return null;
  }
};

/**
 * Obtient le nombre total de visiteurs depuis toujours
 */
export const getTotalVisitors = async (): Promise<number> => {
  try {
    const result = await prisma.visitorStats.aggregate({
      _sum: {
        count: true
      }
    });

    return result._sum.count || 0;
  } catch (error) {
    console.error('Erreur lors du calcul du total des visiteurs:', error);
    return 0;
  }
};

/**
 * Obtient le nombre de visiteurs actuels
 */
export const getCurrentVisitors = async (): Promise<number> => {
  try {
    const currentVisitors = await prisma.currentVisitors.findFirst();
    return currentVisitors?.count || 0;
  } catch (error) {
    console.error('Erreur lors de la récupération des visiteurs actuels:', error);
    return 0;
  }
};

/**
 * Obtient les statistiques des visiteurs pour une période donnée
 */
export const getVisitorStatsForPeriod = async (startDate: Date, endDate: Date): Promise<VisitorStats[]> => {
  try {
    const stats = await prisma.visitorStats.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return stats;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques pour la période:', error);
    return [];
  }
};