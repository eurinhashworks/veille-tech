import { Prisma } from '@prisma/client';

// Types Prisma avec relations incluses
export type ReviewWithTagsAndSources = Prisma.ReviewGetPayload<{
  include: {
    ReviewToTag: {
      include: {
        tags: true;
      };
    };
    sources: true;
    user: {
      select: {
        username: true;
      };
    };
  };
}>;

export type ReviewWithTagDetails = Prisma.ReviewGetPayload<{
  include: {
    ReviewToTag: {
      include: {
        tags: true;
      };
    };
  };
}>;

export type TagWithReviewCount = Prisma.TagGetPayload<{
  include: {
    ReviewToTag: {
      include: {
        reviews: true;
      };
    };
  };
}>;

// Helper pour transformer le format Prisma vers le format TypeScript
export function transformPrismaReview(review: ReviewWithTagsAndSources) {
  // Extraire les tags de la relation ReviewToTag
  const tags = review.ReviewToTag.map(rt => rt.tags.name);
  
  // Retirer ReviewToTag du résultat et ajouter les tags directement
  const { ReviewToTag, ...reviewWithoutJoinTable } = review;
  
  return {
    ...reviewWithoutJoinTable,
    tags: tags,
  };
}

// Helper pour transformer le format Prisma vers le format TypeScript avec les détails
export function transformPrismaReviewWithTagDetails(review: ReviewWithTagDetails) {
  // Extraire les tags de la relation ReviewToTag
  const tags = review.ReviewToTag.map(rt => rt.tags.name);
  
  // Retirer ReviewToTag du résultat et ajouter les tags directement
  const { ReviewToTag, ...reviewWithoutJoinTable } = review;
  
  return {
    ...reviewWithoutJoinTable,
    tags: tags,
  };
}