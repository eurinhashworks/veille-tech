import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from '../lib/prisma';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// API Handling Helper
const handleApi = (handler: any) => async (req: express.Request, res: express.Response) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error('API Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Import API handlers
import usersHandler from '../api/users';
import reviewsHandler from '../api/reviews';
import statsHandler from '../api/stats';
import searchHandler from '../api/search';
import favoritesHandler from '../api/favorites';
import historyHandler from '../api/history';
import settingsHandler from '../api/settings';
import tagsHandler from '../api/tags';
import visitorsHandler from '../api/visitors';

// Routes
app.all('/api/users', handleApi(usersHandler));
app.all('/api/reviews', handleApi(reviewsHandler));
app.all('/api/stats', handleApi(statsHandler));
app.all('/api/search', handleApi(searchHandler));
app.all('/api/favorites', handleApi(favoritesHandler));
app.all('/api/history', handleApi(historyHandler));
app.all('/api/settings', handleApi(settingsHandler));
app.all('/api/tags', handleApi(tagsHandler));
app.all('/api/visitors', handleApi(visitorsHandler));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: process.env.DATABASE_URL ? 'configured' : 'missing' });
});

app.listen(port, () => {
    console.log(`
  🚀 Server ready at http://localhost:${port}
  ⭐️ API running at http://localhost:${port}/api
  `);
});
