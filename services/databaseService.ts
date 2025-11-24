import { prisma } from '../lib/prisma';
import { Review } from '../types';

// ==================== USER OPERATIONS ====================

export const createUser = async (username: string, email?: string) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      settings: {
        create: {
          theme: 'dark',
          defaultVisibility: 'public',
          notifications: false,
          autoGenerate: false,
        },
      },
    },
    include: {
      settings: true,
    },
  });
};

export const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      settings: true,
    },
  });
};

export const getOrCreateUser = async (username: string) => {
  let user = await getUserByUsername(username);
  if (!user) {
    user = await createUser(username);
  }
  return user;
};

// ==================== REVIEW OPERATIONS ====================

export const saveReview = async (review: Review, userId: string) => {
  // Créer ou récupérer les tags
  const tagOperations = review.metadata.tags.map(async (tagName) => {
    return await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  });

  const tags = await Promise.all(tagOperations);

  // Créer la revue
  return await prisma.review.create({
    data: {
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
      tags: {
        connect: tags.map((tag) => ({ id: tag.id })),
      },
      sources: {
        create: review.sources.map((source) => ({
          title: source.title,
          uri: source.uri,
        })),
      },
    },
    include: {
      tags: true,
      sources: true,
    },
  });
};

export const getReviewByDate = async (date: string) => {
  return await prisma.review.findUnique({
    where: { date },
    include: {
      tags: true,
      sources: true,
      user: true,
    },
  });
};

export const getAllReviews = async (userId?: string, isPublic?: boolean) => {
  return await prisma.review.findMany({
    where: {
      ...(userId && { userId }),
      ...(isPublic !== undefined && { isPublic }),
    },
    include: {
      tags: true,
      sources: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
};

export const getReviewsByDateRange = async (
  startDate: string,
  endDate: string,
  userId?: string
) => {
  return await prisma.review.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(userId && { userId }),
    },
    include: {
      tags: true,
      sources: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
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
  return await prisma.review.findMany({
    where: {
      AND: [
        // Recherche textuelle
        {
          OR: [
            { content: { contains: query, mode: 'insensitive' } },
            { flashSummary: { contains: query, mode: 'insensitive' } },
            { aiAnalysis: { contains: query, mode: 'insensitive' } },
          ],
        },
        // Filtres
        ...(filters?.category && filters.category !== 'all'
          ? [{ dominantCategory: filters.category }]
          : []),
        ...(filters?.tags && filters.tags.length > 0
          ? [
              {
                tags: {
                  some: {
                    name: {
                      in: filters.tags,
                    },
                  },
                },
              },
            ]
          : []),
        ...(filters?.dateFrom ? [{ date: { gte: filters.dateFrom } }] : []),
        ...(filters?.dateTo ? [{ date: { lte: filters.dateTo } }] : []),
        ...(filters?.userId ? [{ userId: filters.userId }] : []),
      ],
    },
    include: {
      tags: true,
      sources: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
};

// ==================== FAVORITE OPERATIONS ====================

export const addFavorite = async (userId: string, reviewId: string) => {
  return await prisma.favorite.create({
    data: {
      userId,
      reviewId,
    },
  });
};

export const removeFavorite = async (userId: string, reviewId: string) => {
  return await prisma.favorite.delete({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });
};

export const getFavorites = async (userId: string) => {
  return await prisma.favorite.findMany({
    where: { userId },
    include: {
      review: {
        include: {
          tags: true,
          sources: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const isFavorite = async (userId: string, reviewId: string) => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });
  return !!favorite;
};

// ==================== SEARCH HISTORY OPERATIONS ====================

export const saveSearchHistory = async (
  userId: string,
  query: string,
  filters: any,
  results: number
) => {
  return await prisma.searchHistory.create({
    data: {
      userId,
      query,
      filters,
      results,
    },
  });
};

export const getSearchHistory = async (userId: string, limit = 10) => {
  return await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
};

export const clearSearchHistory = async (userId: string) => {
  return await prisma.searchHistory.deleteMany({
    where: { userId },
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
  }
) => {
  return await prisma.userSettings.upsert({
    where: { userId },
    update: settings,
    create: {
      userId,
      ...settings,
    },
  });
};

export const getUserSettings = async (userId: string) => {
  return await prisma.userSettings.findUnique({
    where: { userId },
  });
};

// ==================== STATISTICS ====================

export const getReviewStats = async (userId?: string) => {
  const where = userId ? { userId } : {};

  const [totalReviews, totalNews, avgGenerationTime, categoryDistribution] =
    await Promise.all([
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _sum: {
          newsCount: true,
        },
      }),
      prisma.review.aggregate({
        where,
        _avg: {
          generationTime: true,
        },
      }),
      prisma.review.groupBy({
        by: ['dominantCategory'],
        where,
        _count: {
          dominantCategory: true,
        },
      }),
    ]);

  return {
    totalReviews,
    totalNews: totalNews._sum.newsCount || 0,
    avgGenerationTime: avgGenerationTime._avg.generationTime || 0,
    categoryDistribution: categoryDistribution.reduce(
      (acc, item) => {
        acc[item.dominantCategory] = item._count.dominantCategory;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
};

// ==================== TAGS ====================

export const getAllTags = async () => {
  return await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: {
      reviews: {
        _count: 'desc',
      },
    },
  });
};

export const getPopularTags = async (limit = 10) => {
  return await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: {
      reviews: {
        _count: 'desc',
      },
    },
    take: limit,
  });
};
