/**
 * Server-Side Configuration (Node/Express)
 * Uses process.env for environment variables.
 */
import 'dotenv/config';

export const CONFIG = {
    // Server Configuration
    PORT: Number(process.env.PORT) || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // AI (Gemini)
    AI: {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.API_KEY,
        MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    },

    // Mail (Resend)
    MAIL: {
        API_KEY: process.env.RESEND_API_KEY,
        FROM: process.env.RESEND_FROM || 'Eureka AI <notifications@net.eurinhash.com>',
    },

    // CORS
    CORS: {
        ALLOWED_ORIGINS: [
            'http://localhost:3000',
            'http://localhost:5173',
            process.env.FRONTEND_URL,
        ].filter(Boolean) as string[],
    }
};

export default CONFIG;
