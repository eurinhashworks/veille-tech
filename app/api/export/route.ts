import { NextResponse } from 'next/server';
import { headers } from 'next/headers'; // Import headers
import { prisma } from '@/lib/server/prisma';
import { auth } from '@/auth';
import { validateRequest } from '@/lib/schemas/validation';
import { exportDataSchema } from '@/lib/schemas/validation';

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { format, resourceType, id } = validateRequest(exportDataSchema, body);

        let data: any = {};

        // Fetch Data
        if (resourceType === 'review' || resourceType === 'all') {
            const where: any = id ? { id, userId } : { userId };
            data.reviews = await prisma.review.findMany({
                where,
                include: { ReviewToTag: { include: { tags: true } }, sources: true }
            });
        }

        if (resourceType === 'history' || resourceType === 'all') {
            data.history = await prisma.searchHistory.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
        }

        // Format Data
        if (format === 'json') {
            const jsonString = JSON.stringify(data, null, 2);
            return new NextResponse(jsonString, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Disposition': `attachment; filename="export-${resourceType}-${Date.now()}.json"`,
                },
            });
        }

        if (format === 'md') {
            let mdContent = `# Export de Données (${new Date().toISOString()})\n\n`;

            if (data.reviews) {
                mdContent += `## Revues\n\n`;
                data.reviews.forEach((r: any) => {
                    mdContent += `### ${r.date} - ${r.dominantCategory}\n`;
                    mdContent += `**Résumé**: ${r.flashSummary}\n\n`;
                    mdContent += `**Contenu**:\n${r.content}\n\n`;
                    mdContent += `---\n\n`;
                });
            }

            if (data.history) {
                mdContent += `## Historique de Recherche\n\n`;
                data.history.forEach((h: any) => {
                    mdContent += `* [${h.createdAt}] **Query**: ${h.query} (${h.results} résultats)\n`;
                });
            }

            return new NextResponse(mdContent, {
                status: 200,
                headers: {
                    'Content-Type': 'text/markdown',
                    'Content-Disposition': `attachment; filename="export-${resourceType}-${Date.now()}.md"`,
                },
            });
        }

        return NextResponse.json({ error: 'Format non supporté' }, { status: 400 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Paramètres d\'export invalides', details: error.errors }, { status: 400 });
        }
        console.error('Error exporting data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
