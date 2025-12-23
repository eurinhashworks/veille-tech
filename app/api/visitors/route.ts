import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { visitorActionSchema, validateRequest } from '@/lib/schemas/validation';
import { z } from 'zod';

// GET /api/visitors?type=...
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const querySchema = z.object({
            type: z.enum(['daily', 'total', 'current'])
        });
        const { type } = validateRequest(querySchema, { type: searchParams.get('type') });

        if (type === 'daily') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const stats = await prisma.visitorStats.findUnique({
                where: { date: today }
            });
            return NextResponse.json(stats || { count: 0 });
        } else if (type === 'total') {
            const result = await prisma.visitorStats.aggregate({
                _sum: { count: true }
            });
            return NextResponse.json({ count: result._sum.count || 0 });
        } else if (type === 'current') {
            const currentVisitors = await prisma.currentVisitors.findFirst();
            return NextResponse.json(currentVisitors || { count: 0 });
        }
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Paramètre invalide', details: error.errors }, { status: 400 });
        }
        console.error('Error fetching visitor stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/visitors
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action } = validateRequest(visitorActionSchema, body);

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
            return NextResponse.json(stats);
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
            return NextResponse.json(currentVisitors);
        }

        else if (action === 'decrement_current') {
            let currentVisitors = await prisma.currentVisitors.findFirst();
            if (currentVisitors && currentVisitors.count > 0) {
                currentVisitors = await prisma.currentVisitors.update({
                    where: { id: currentVisitors.id },
                    data: { count: { decrement: 1 }, updatedAt: new Date() }
                });
            }
            return NextResponse.json(currentVisitors || { count: 0 });
        }
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Action invalide', details: error.errors }, { status: 400 });
        }
        console.error('Error updating visitor stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
