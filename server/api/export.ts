import { prisma } from '../lib/prisma';
import { exportDataSchema, validateRequest } from '../schemas/validation';
import { Response } from 'express';

export default async function handler(req: any, res: Response) {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non autorisé' });

    if (req.method === 'POST') {
        try {
            const body = validateRequest(exportDataSchema, req.body);
            const { format, resourceType, id } = body;

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
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', `attachment; filename="export-${resourceType}-${Date.now()}.json"`);
                return res.send(JSON.stringify(data, null, 2));
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

                res.setHeader('Content-Type', 'text/markdown');
                res.setHeader('Content-Disposition', `attachment; filename="export-${resourceType}-${Date.now()}.md"`);
                return res.send(mdContent);
            }

            return res.status(400).json({ error: 'Format non supporté' });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: 'Paramètres d\'export invalides', details: error.errors });
            }
            console.error('Error exporting data:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
