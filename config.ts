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

    // Frontend Server Configuration (Vite)
    FRONTEND_PORT: Number(process.env.FRONTEND_PORT) || 3000,

    // Environment
    ENV: process.env.NODE_ENV || 'development',

    // Mail Configuration (Resend)
    MAIL: {
        DOMAIN: process.env.RESEND_DOMAIN || 'net.eurinhash.com',
        FROM: process.env.RESEND_FROM || 'Eureka AI <notifications@net.eurinhash.com>',
    },

    // Metadata
    APP_NAME: process.env.APP_NAME || 'EUREKA AI',
    VERSION: '1.1.0'
};

export default CONFIG;
