import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import pc from 'picocolors';
import logger from './lib/logger';
import { prisma } from './lib/prisma';
import { apiLimiter } from './middleware/rateLimiter';
import { CONFIG } from './config';

logger.info('🏁 Starting Backend Server...');

const app = express();
const port = process.env.PORT || CONFIG.PORT;

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

app.use(morgan(loggerFormat, {
    stream: { write: (message) => logger.info(message.trim()) }
}));

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
            logger.warn(`CORS blocked for: ${origin}`);
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
        logger.error('API Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Import API handlers
import usersHandler from './api/users';
import reviewsHandler from './api/reviews';
import statsHandler from './api/stats';
import searchHandler from './api/search';
import favoritesHandler from './api/favorites';
import historyHandler from './api/history';
import settingsHandler from './api/settings';
import tagsHandler from './api/tags';
import visitorsHandler from './api/visitors';
import analyticsHandler from './api/analytics';
import commentsHandler from './api/comments';
import exportHandler from './api/export';
import generateHandler from './api/generate';
import integrationsHandler from './api/integrations';
import notificationsHandler from './api/notifications';
import testEmailHandler from './api/test-email';
import sharingHandler from './api/sharing';
import trendsHandler from './api/trends';

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

// Basic health check to see if we're configured
app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: process.env.DATABASE_URL ? 'configured' : 'missing' });
});

// Initialization: Fail-fast checks for critical infrastructure
async function startServer() {
    try {
        logger.info('🔍 Testing infrastructure connectivity...');

        // 1. Test Database Connection
        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        // 2. Test Resend API Key (Optional presence check)
        if (!CONFIG.MAIL.API_KEY) {
            logger.warn('⚠️ RESEND_API_KEY is missing. Emails will fail to send.');
        } else {
            logger.info('✅ Mail service (Resend) configured');
        }

        // 3. Test Gemini API Key
        if (!CONFIG.AI.GEMINI_API_KEY) {
            logger.error('❌ CRITICAL: GEMINI_API_KEY is missing. AI features will be disabled.');
            // We might not want to exit here if other core features work, 
            // but for EUREKA, it's pretty critical.
        } else {
            logger.info('✅ AI service (Gemini) configured');
        }

        app.listen(port, () => {
            logger.info(`🚀 Server ready at http://localhost:${port}`);
            logger.info(`⭐️ API running at http://localhost:${port}/api`);
        });
    } catch (error) {
        logger.error('❌ Failed to start server due to infrastructure error:', error);
        process.exit(1);
    }
}

logger.info(`🔌 Attempting to boot system...`);
startServer();

// Deep Debugging: Listen for any reason the process might exit
process.on('exit', (code) => {
    console.log(pc.yellow(`⚠️ Process exiting with code: ${code}`));
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(pc.red('❌ Unhandled Rejection at:'), promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error(pc.red('❌ Uncaught Exception:'), err);
    process.exit(1);
});
