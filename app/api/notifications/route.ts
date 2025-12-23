import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { updateNotificationSchema, validateRequest } from '@/lib/schemas/validation';
import { auth } from '@/auth';
import { z } from 'zod';

// GET /api/notifications - Get notifications for the authenticated user
export async function GET(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const notifications = await prisma.notification.findMany({ // Assuming prisma.notification exists
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/notifications?id=... - Mark a notification as read/unread
export async function PATCH(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const querySchema = z.object({ id: z.string().min(1) });
        const { id } = validateRequest(querySchema, { id: searchParams.get('id') });
        
        const body = await req.json();
        const validatedBody = validateRequest(updateNotificationSchema, body);

        const updated = await prisma.notification.updateMany({
            where: { id: id, userId }, // Ensure user owns it
            data: { read: validatedBody.read }
        });
        return NextResponse.json({ success: true, count: updated.count });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error updating notification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
