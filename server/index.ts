import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { prisma } from './lib/prisma';

// Imports des handlers API
import usersHandler from './api/users';
import reviewsHandler from './api/reviews';
import statsHandler from './api/stats';
import searchHandler from './api/search';
import favoritesHandler from './api/favorites';
import historyHandler from './api/history';
import settingsHandler from './api/settings';
import tagsHandler from './api/tags';
import visitorsHandler from './api/visitors';
import notificationsHandler from './api/notifications';
import analyticsHandler from './api/analytics';
import commentsHandler from './api/comments';
import exportHandler from './api/export';
import sharingHandler from './api/sharing';
import trendsHandler from './api/trends';

const app = express();
const port = 3001;

// 1. CORS Configuration (Plus précis pour éviter les conflits)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// 2. Better Auth Handler
app.all(/^\/api\/auth\/.*/, (req, res) => {
    return toNodeHandler(auth)(req, res);
});

// 3. Middlewares standard
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Désactivé en dev pour faciliter le debug
}));
app.use(express.json());

// 4. API Handling Helper
const handleApi = (handler: any) => async (req: express.Request, res: express.Response) => {
    try {
        const fn = handler.default || handler;
        await fn(req, res);
    } catch (error) {
        console.error('API Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// 5. Routes API
app.all('/api/users', handleApi(usersHandler));
app.all('/api/reviews', handleApi(reviewsHandler));
app.all('/api/stats', handleApi(statsHandler));
app.all('/api/search', handleApi(searchHandler));
app.all('/api/favorites', handleApi(favoritesHandler));
app.all('/api/history', handleApi(historyHandler));
app.all('/api/settings', handleApi(settingsHandler));
app.all('/api/tags', handleApi(tagsHandler));
app.all('/api/visitors', handleApi(visitorsHandler));
app.all('/api/notifications', handleApi(notificationsHandler));
app.all('/api/analytics', handleApi(analyticsHandler));
app.all('/api/comments', handleApi(commentsHandler));
app.all('/api/export', handleApi(exportHandler));
app.all('/api/sharing', handleApi(sharingHandler));
app.all('/api/trends', handleApi(trendsHandler));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`
  🚀 Server ready at http://localhost:${port}
  ⭐️ Auth API ready at http://localhost:${port}/api/auth
  📡 All API Routes loaded.
  `);
});
