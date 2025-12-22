import express from 'express';
import { prisma } from '../lib/prisma';
import { visitorActionSchema, validateRequest } from '../schemas/validation';
import { z } from 'zod';

export default async function handler(req: express.Request, res: express.Response) {
    // GET - Retrieve stats
    if (req.method === 'GET') {
        try {
            const querySchema = z.object({
                type: z.enum(['daily', 'total', 'current'])
            });
            const { type } = validateRequest(querySchema, req.query);

            if (type === 'daily') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const stats = await prisma.visitorStats.findUnique({
                    where: { date: today }
                });
                return res.status(200).json(stats || { count: 0 });
            } else if (type === 'total') {
                const result = await prisma.visitorStats.aggregate({
                    _sum: { count: true }
                });
                return res.status(200).json({ count: result._sum.count || 0 });
            } else if (type === 'current') {
                const currentVisitors = await prisma.currentVisitors.findFirst();
                return res.status(200).json(currentVisitors || { count: 0 });
            }
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Paramètre invalide', details: error.errors });
            }
            console.error('Error fetching visitor stats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST - Increment stats
    if (req.method === 'POST') {
        try {
            const { action } = validateRequest(visitorActionSchema, req.body);

            if (action === 'increment_daily') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

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
                return res.status(200).json(stats);
            }

            else if (action === 'increment_current') {
                let currentVisitors = await prisma.currentVisitors.findFirst();
                if (!currentVisitors) {
                    currentVisitors = await prisma.currentVisitors.create({ data: { count: 1 } });
                } else {
                    currentVisitors = await prisma.currentVisitors.update({
                        where: { id: currentVisitors.id },
                        data: { count: { increment: 1 }, updatedAt: new Date() }
                    });
                }
                return res.status(200).json(currentVisitors);
            }

            else if (action === 'decrement_current') {
                let currentVisitors = await prisma.currentVisitors.findFirst();
                if (currentVisitors && currentVisitors.count > 0) {
                    currentVisitors = await prisma.currentVisitors.update({
                        where: { id: currentVisitors.id },
                        data: { count: { decrement: 1 }, updatedAt: new Date() }
                    });
                }
                return res.status(200).json(currentVisitors || { count: 0 });
            }
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Action invalide', details: error.errors });
            }
            console.error('Error updating visitor stats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
