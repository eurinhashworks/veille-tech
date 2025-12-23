import { NextResponse } from 'next/server';
import { headers } from 'next/headers'; // Import headers
import { auth } from '@/auth';
import { prisma } from '@/lib/server/prisma';
import { validateRequest, trackEventSchema } from '@/lib/schemas/validation'; // Import validateRequest and trackEventSchema

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id || 'anonymous';

    try {
        const body = await req.json();
        const validatedBody = validateRequest(trackEventSchema, body);

        console.log(`[ANALYTICS] Event: ${validatedBody.event}`, {
            userId: userId,
            meta: validatedBody.metadata,
            timestamp: new Date().toISOString()
        });

        // In a real app, save to ClickHouse, Mixpanel, or PostHog
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Événement analytique invalide', details: error.errors }, { status: 400 });
        }
        console.error('[ANALYTICS ERROR]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
