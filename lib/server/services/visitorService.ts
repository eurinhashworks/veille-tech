import { prisma } from '../prisma';

// Fonction pour récupérer les statistiques des visiteurs du jour
export const getDailyVisitorStats = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = await prisma.visitorStats.findFirst({
      where: {
        date: {
          gte: today,
        },
      },
    });
    
    return stats || { count: 0 };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques quotidiennes des visiteurs:', error);
    throw error;
  }
};

// Fonction pour récupérer le nombre total de visiteurs
export const getTotalVisitors = async () => {
  try {
    // Pour l'instant, on retourne une estimation basée sur le nombre d'utilisateurs
    // Dans une implémentation complète, on aurait une table dédiée aux visiteurs
    const userCount = await prisma.user.count();
    return userCount; // Approximation pour le moment
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre total de visiteurs:', error);
    throw error;
  }
};

// Fonction pour récupérer le nombre de visiteurs actuels
export const getCurrentVisitors = async () => {
  try {
    // Pour l'instant, on retourne une valeur par défaut
    // Dans une implémentation complète, on utiliserait une table CurrentVisitors
    const currentVisitors = await prisma.currentVisitors.findFirst();
    return currentVisitors?.count || 0;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de visiteurs actuels:', error);
    throw error;
  }
};