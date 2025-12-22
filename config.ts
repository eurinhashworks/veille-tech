/**
 * Centralized Project Configuration
 * This file serves as the single source of truth for project-wide constants.
 * It uses environment variables where possible.
 */

export const CONFIG = {
    // API Server Configuration
    API_PORT: Number(process.env.API_PORT) || 5000,
    API_BASE_URL: '/api',
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
    get API_URL() { return `${this.BACKEND_URL}${this.API_BASE_URL}`; },

    // Frontend Server Configuration (Vite)
    FRONTEND_PORT: Number(process.env.FRONTEND_PORT) || 3000,

    // Environment
    ENV: process.env.NODE_ENV || 'development',

    // Database Configuration
    DATABASE: {
        URL: process.env.DATABASE_URL || '',
    },

    // AI Configuration (Gemini)
    AI: {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.API_KEY || '',
        MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    },

    // Mail Configuration (Resend)
    MAIL: {
        API_KEY: process.env.RESEND_API_KEY || '',
        DOMAIN: process.env.RESEND_DOMAIN || 'net.eurinhash.com',
        FROM: process.env.RESEND_FROM || 'Eureka AI <notifications@net.eurinhash.com>',
    },

    // Security Configuration
    CORS: {
        ALLOWED_ORIGINS: [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            process.env.FRONTEND_URL,
        ].filter(Boolean) as string[],
    },

    // Metadata
    APP_NAME: process.env.APP_NAME || 'EUREKA AI',
    VERSION: '1.2.1'
};

export default CONFIG;
