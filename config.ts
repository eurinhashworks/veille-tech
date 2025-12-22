/**
 * Centralized Project Configuration
 * This file serves as the single source of truth for project-wide constants.
 */

export const CONFIG = {
    // API Server Configuration
    API_PORT: 5000,
    API_BASE_URL: '/api',
    BACKEND_URL: 'http://localhost:5000',

    // Frontend Server Configuration (Vite)
    FRONTEND_PORT: 3000,

    // Environment
    ENV: 'development', // Force development as requested

    // Metadata
    APP_NAME: 'EUREKA AI',
    VERSION: '1.1.0'
};

export default CONFIG;
