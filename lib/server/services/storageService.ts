import { prisma } from '../prisma';

// Fonction pour récupérer les statistiques globales
export const getStatistics = async () => {
  try {
    // Nombre total de revues
    const totalReviews = await prisma.review.count();
    
    // Nombre total d'actualités
    const totalNews = await prisma.review.aggregate({
      _sum: {
        newsCount: true
      }
    });
    
    // Temps moyen de génération
    const avgGenerationTime = await prisma.review.aggregate({
      _avg: {
        generationTime: true
      }
    });
    
    // Distribution par catégorie
    const categoryDistribution = await prisma.review.groupBy({
      by: ['dominantCategory'],
      _count: {
        dominantCategory: true
      }
    });
    
    // Conversion en objet pour la distribution
    const distributionObj: Record<string, number> = {};
    categoryDistribution.forEach(item => {
      distributionObj[item.dominantCategory] = item._count.dominantCategory;
    });
    
    // Catégorie la plus courante
    const topCategory = categoryDistribution.length > 0 
      ? categoryDistribution.reduce((prev, current) => 
          (prev._count.dominantCategory > current._count.dominantCategory) ? prev : current
        ).dominantCategory 
      : 'Mix';
    
    return {
      totalReviews,
      totalNews: totalNews._sum.newsCount || 0,
      avgGenerationTime: avgGenerationTime._avg.generationTime || 0,
      categoryDistribution: distributionObj,
      topCategory
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};

// Fonction pour récupérer l'historique de recherche d'un utilisateur
export const getSearchHistory = async (userId: string, limit: number = 50) => {
  try {
    const history = await prisma.searchHistory.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
    
    return history;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique de recherche:', error);
    throw error;
  }
};

// Fonction pour récupérer les favoris d'un utilisateur
export const getUserFavorites = async (userId: string) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId
      },
      include: {
        review: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return favorites;
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    throw error;
  }
};

// Fonction pour récupérer toutes les revues (utilisée dans personalizationService)
export const getAllReviews = async () => {
  try {
    const prismaReviews = await prisma.review.findMany({
      include: {
        user: true,
        ReviewToTag: {
          include: {
            tags: true
          }
        },
        sources: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Mapper les objets Prisma au format Review
    const reviews = prismaReviews.map(prismaReview => ({
      metadata: {
        id: prismaReview.id,
        date: prismaReview.date,
        formattedDate: prismaReview.formattedDate,
        username: prismaReview.user?.username || 'Anonyme',
        userId: prismaReview.userId,
        timestamp: prismaReview.createdAt.getTime(),
        generationTime: prismaReview.generationTime,
        tags: prismaReview.ReviewToTag.map(rt => rt.tags.name),
        dominantCategory: prismaReview.dominantCategory as any, // Conversion temporaire
        newsCount: prismaReview.newsCount,
        flashSummary: prismaReview.flashSummary,
        aiAnalysis: prismaReview.aiAnalysis,
        isPublic: prismaReview.isPublic
      },
      content: prismaReview.content,
      sources: prismaReview.sources.map(source => ({
        title: source.title,
        uri: source.uri
      }))
    }));

    return reviews;
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les revues:', error);
    throw error;
  }
};

// Fonction pour récupérer les paramètres utilisateur
export const getUserSettings = async (userId: string) => {
  try {
    const settings = await prisma.userSettings.findUnique({
      where: {
        userId: userId
      }
    });

    return settings;
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres utilisateur:', error);
    throw error;
  }
};

// Fonction pour sauvegarder les paramètres utilisateur
export const saveUserSettings = async (userId: string, settings: any) => {
  try {
    const updatedSettings = await prisma.userSettings.upsert({
      where: {
        userId: userId
      },
      update: {
        ...settings
      },
      create: {
        userId: userId,
        ...settings
      }
    });

    return updatedSettings;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres utilisateur:', error);
    throw error;
  }
};