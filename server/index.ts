import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import pc from 'picocolors';
import { prisma } from '../lib/prisma';
import { apiLimiter } from '../middleware/rateLimiter';
import { CONFIG } from '../config';

const app = express();
const port = process.env.PORT || CONFIG.API_PORT;

// Logging: Custom beautiful morgan format
const loggerFormat = (tokens: any, req: any, res: any) => {
    const status = tokens.status(req, res);
    const statusColor = status >= 500 ? pc.red : status >= 400 ? pc.yellow : status >= 300 ? pc.cyan : pc.green;

    return [
        pc.gray(`[${new Date().toISOString()}]`),
        pc.magenta(pc.bold(tokens.method(req, res))),
        pc.white(tokens.url(req, res)),
        statusColor(pc.bold(status)),
        pc.gray(`- ${tokens['response-time'](req, res)} ms`)
    ].join(' ');
};

app.use(morgan(loggerFormat));

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
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (CONFIG.CORS.ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(pc.red(`CORS blocked for: ${origin}`));
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
        console.error(pc.red('API Error:'), error);
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
import analyticsHandler from '../api/analytics';
import commentsHandler from '../api/comments';
import exportHandler from '../api/export';
import generateHandler from '../api/generate';
import integrationsHandler from '../api/integrations';
import notificationsHandler from '../api/notifications';
import testEmailHandler from '../api/test-email';
import sharingHandler from '../api/sharing';
import trendsHandler from '../api/trends';

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
app.all('/api/analytics', handleApi(analyticsHandler));
app.all('/api/comments', handleApi(commentsHandler));
app.all('/api/export', handleApi(exportHandler));
app.all('/api/generate', handleApi(generateHandler));
app.all('/api/test-email', handleApi(testEmailHandler));
app.all('/api/integrations', handleApi(integrationsHandler));
app.all('/api/notifications', handleApi(notificationsHandler));
app.all('/api/sharing', handleApi(sharingHandler));
app.all('/api/trends', handleApi(trendsHandler));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: process.env.DATABASE_URL ? 'configured' : 'missing' });
});

app.listen(port, () => {
    console.log(`
  ${pc.bgBlue(pc.white(pc.bold(' BACKEND ')))} ${pc.blue('🚀 Server ready at')} ${pc.cyan(pc.underline(`http://localhost:${port}`))}
  ${pc.bgMagenta(pc.white(pc.bold(' API ')))} ${pc.magenta('⭐️ API running at')} ${pc.cyan(pc.underline(`http://localhost:${port}/api`))}
  `);
});
