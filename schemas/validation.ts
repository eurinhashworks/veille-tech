import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
    username: z.string()
        .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
        .max(50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),
    email: z.string().email('Email invalide').optional(),
});

export const sourceSchema = z.object({
    title: z.string(),
    uri: z.string().url('URI invalide').refine(val => !val.toLowerCase().startsWith('javascript:'), {
        message: "URL scheme not allowed"
    }),
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
    limit: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional(),
    isPublic: z.string().transform(val => val === 'true').optional(), // Query params are strings
});

// Favorite validation schemas
export const addFavoriteSchema = z.object({
    reviewId: z.string().min(1, 'ReviewId requis'),
});

export const removeFavoriteSchema = z.object({
    reviewId: z.string().min(1, 'ReviewId requis'),
});

// Search history validation schemas
export const saveSearchHistorySchema = z.object({
    query: z.string().min(1, 'Query requis'),
    filters: z.record(z.string(), z.any()).optional(),
    results: z.number().int().nonnegative(),
});

// Settings validation schemas
export const updateSettingsSchema = z.object({
    theme: z.enum(['dark', 'light', 'auto']).optional(),
    defaultVisibility: z.enum(['public', 'private']).optional(),
    notifications: z.boolean().optional(),
    autoGenerate: z.boolean().optional(),
    aiPreferences: z.object({
        style: z.enum(['analytical', 'creative', 'technical', 'executive']).optional(),
        tone: z.enum(['formal', 'casual', 'humorous', 'serious']).optional(),
        depth: z.enum(['brief', 'detailed', 'comprehensive']).optional(),
        apiKey: z.string().optional(), // Server-side stored key
    }).optional(),
});

// Visitor stats validation schemas
export const visitorActionSchema = z.object({
    action: z.enum(['increment_daily', 'increment_current', 'decrement_current']),
});

// AI Generation Schema
export const generateReviewSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide'),
    username: z.string().optional(),
    isPublic: z.boolean().optional(),
    aiPreferences: z.object({
        style: z.enum(['analytical', 'creative', 'technical', 'executive']).optional(),
        tone: z.enum(['formal', 'casual', 'humorous', 'serious']).optional(),
        depth: z.enum(['brief', 'detailed', 'comprehensive']).optional(),
    }).optional(),
    useCustomApiKey: z.boolean().optional(),
});

// Trends Schema
export const trendAnalysisSchema = z.object({
    daysBack: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional(),
    limit: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional(),
});

// --- NEW FEATURES ---

// Comments
export const createCommentSchema = z.object({
    content: z.string().min(1, 'Le commentaire ne peut pas être vide').max(1000, 'Commentaire trop long'),
    reviewId: z.string().min(1),
});

// Notifications
export const updateNotificationSchema = z.object({
    read: z.boolean(),
});

// Integrations
export const createIntegrationSchema = z.object({
    provider: z.enum(['slack', 'discord', 'email', 'notion']),
    config: z.record(z.string(), z.any()), // JSON config depend de provider
});

// Sharing
export const createShareLinkSchema = z.object({
    resourceId: z.string().min(1),
});

// Analytics
export const trackEventSchema = z.object({
    event: z.string().min(1),
    metadata: z.record(z.string(), z.any()).optional(),
});

// Exports
export const exportDataSchema = z.object({
    format: z.enum(['json', 'md', 'html']),
    resourceType: z.enum(['review', 'history', 'all']),
    id: z.string().optional() // specific ID export
});

// Helper function to validate request body
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}
