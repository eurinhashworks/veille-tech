import { prisma } from '../lib/prisma';
import { exportDataSchema, validateRequest } from '../schemas/validation';
import { AuthenticatedRequest } from '../types/request';
import { Response } from 'express';

export default async function handler(req: AuthenticatedRequest, res: Response) {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
        const body = validateRequest(exportDataSchema, req.body);
        const { format, resourceType, id } = body;

        let data: any = {};

        // Fetch Data
        if (resourceType === 'review' || resourceType === 'all') {
            const where = id ? { id, userId } : { userId };
            data.reviews = await prisma.review.findMany({
                where,
                include: { tags: { include: { tags: true } }, sources: true }
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
            let mdContent = `# Export Data (${new Date().toISOString()})\n\n`;

            if (data.reviews) {
                mdContent += `## Reviews\n\n`;
                data.reviews.forEach((r: any) => {
                    mdContent += `### ${r.date} - ${r.dominantCategory}\n`;
                    mdContent += `**Summary**: ${r.flashSummary}\n\n`;
                    mdContent += `**Content**:\n${r.content}\n\n`;
                    mdContent += `---\n\n`;
                });
            }

            res.setHeader('Content-Type', 'text/markdown');
            res.setHeader('Content-Disposition', `attachment; filename="export-${resourceType}-${Date.now()}.md"`);
            return res.send(mdContent);
        }

        return res.status(400).json({ error: 'Unsupported format' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
