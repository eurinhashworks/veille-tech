import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from '../lib/prisma';
import { apiLimiter } from '../middleware/rateLimiter';

const app = express();
const port = 3001;

// Security: Helmet for HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Security: CORS configuration with whitelist
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://192.168.100.10:3000',
    // Add production domain when deployed
    // 'https://veille-tech.eurinhash.com'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// API Handling Helper
const handleApi = (handler: (req: express.Request, res: express.Response) => Promise<any>) => async (req: express.Request, res: express.Response) => {
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
