import express from 'express';
import { prisma } from '../lib/prisma';
import { saveSearchHistorySchema, validateRequest, getUserSchema } from '../schemas/validation';
import { z } from 'zod';

export default async function handler(req: express.Request, res: express.Response) {
    if (req.method === 'GET') {
        try {
            const querySchema = getUserSchema.extend({
                limit: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional()
            });
            const { id: userId, limit } = validateRequest(querySchema, req.query);

            if (!userId) {
                return res.status(400).json({ error: 'UserId est requis' });
            }

            const history = await prisma.searchHistory.findMany({
                where: { userId },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit || 10,
            });
            return res.status(200).json(history);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Paramètres invalides', details: error.errors });
            }
            console.error('Error fetching history:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const bodySchema = saveSearchHistorySchema.extend({
                userId: z.string().min(1)
            });
            const { userId, query, filters, results } = validateRequest(bodySchema, req.body);

            const history = await prisma.searchHistory.create({
                data: {
                    userId,
                    query,
                    filters: filters || {},
                    results,
                },
            });
            return res.status(201).json(history);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Données d\'historique invalides', details: error.errors });
            }
            console.error('Error saving history:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id: userId } = validateRequest(getUserSchema, req.query);

            if (!userId) {
                return res.status(400).json({ error: 'UserId est requis' });
            }

            await prisma.searchHistory.deleteMany({
                where: { userId },
            });
            return res.status(200).json({ success: true });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Paramètres invalides', details: error.errors });
            }
            console.error('Error clearing history:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}