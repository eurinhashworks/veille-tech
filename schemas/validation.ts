import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
    username: z.string()
        .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
        .max(50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),
    email: z.string().email('Email invalide').optional(),
});

export const getUserSchema = z.object({
    username: z.string().optional(),
    id: z.string().optional(),
});

// Review validation schemas
export const createReviewSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
    formattedDate: z.string(),
    content: z.string().min(100, 'Le contenu doit contenir au moins 100 caractères'),
    flashSummary: z.string().min(10, 'Le résumé doit contenir au moins 10 caractères'),
    aiAnalysis: z.string(),
    dominantCategory: z.enum(['Search', 'Web', 'Cloud', 'DevOps', 'Security', 'IA', 'Mix']),
    newsCount: z.number().int().positive(),
    generationTime: z.number().positive(),
    isPublic: z.boolean(),
    userId: z.string(),
    tags: z.array(z.string()).optional(),
    sources: z.array(z.object({
        title: z.string(),
        uri: z.string().url('URI invalide'),
    })).optional(),
});

export const searchReviewsSchema = z.object({
    query: z.string().optional(),
    category: z.enum(['Search', 'Web', 'Cloud', 'DevOps', 'Security', 'IA', 'Mix']).optional(),
    tags: z.array(z.string()).optional(),
    dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    userId: z.string().optional(),
    isPublic: z.boolean().optional(),
});

// Favorite validation schemas
export const addFavoriteSchema = z.object({
    userId: z.string().min(1, 'UserId requis'),
    reviewId: z.string().min(1, 'ReviewId requis'),
});

export const removeFavoriteSchema = z.object({
    userId: z.string().min(1, 'UserId requis'),
    reviewId: z.string().min(1, 'ReviewId requis'),
});

// Search history validation schemas
export const saveSearchHistorySchema = z.object({
    userId: z.string().min(1, 'UserId requis'),
    query: z.string().min(1, 'Query requis'),
    filters: z.record(z.string(), z.any()).optional(),
    results: z.number().int().nonnegative(),
});

// Settings validation schemas
export const updateSettingsSchema = z.object({
    userId: z.string().min(1, 'UserId requis'),
    settings: z.object({
        theme: z.enum(['dark', 'light', 'auto']).optional(),
        defaultVisibility: z.enum(['public', 'private']).optional(),
        notifications: z.boolean().optional(),
        autoGenerate: z.boolean().optional(),
        aiPreferences: z.object({
            style: z.enum(['analytical', 'creative', 'technical', 'executive']).optional(),
            tone: z.enum(['formal', 'casual', 'humorous', 'serious']).optional(),
            depth: z.enum(['brief', 'detailed', 'comprehensive']).optional(),
        }).optional(),
    }),
});

// Visitor stats validation schemas
export const visitorActionSchema = z.object({
    action: z.enum(['increment_daily', 'increment_current', 'decrement_current']),
});

// Helper function to validate request body
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}
