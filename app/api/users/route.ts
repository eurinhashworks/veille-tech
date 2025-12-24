import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { validateRequest, getUserSchema } from '@/lib/schemas/validation';
import { auth } from '@/auth';

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: req.headers,
    });
    const authenticatedUserId = session?.user?.id;

    try {
        const { searchParams } = new URL(req.url);
        const { username } = validateRequest(getUserSchema, { username: searchParams.get('username') });

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { username: String(username) },
            include: {
                settings: true, // Always include for the check
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If the authenticated user is requesting their own profile, return everything.
        if (authenticatedUserId && authenticatedUserId === user.id) {
            return NextResponse.json(user);
        }

        // Otherwise, return a public version of the user profile.
        const { settings, email, ...publicProfile } = user;
        return NextResponse.json(publicProfile);

    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
