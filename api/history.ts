import express from 'express';
import { prisma } from '../lib/prisma';

export default async function handler(req: express.Request, res: express.Response) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        const { userId, limit } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        try {
            const history = await prisma.searchHistory.findMany({
                where: { userId: String(userId) },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit ? Number(limit) : 10,
            });
            return res.status(200).json(history);
        } catch (error) {
            console.error('Error fetching history:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        const { userId, query, filters, results } = req.body;

        if (!userId || !query) {
            return res.status(400).json({ error: 'UserId and query are required' });
        }

        try {
            const history = await prisma.searchHistory.create({
                data: {
                    userId,
                    query,
                    filters,
                    results,
                },
            });
            return res.status(201).json(history);
        } catch (error) {
            console.error('Error saving history:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        try {
            await prisma.searchHistory.deleteMany({
                where: { userId: String(userId) },
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error clearing history:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}