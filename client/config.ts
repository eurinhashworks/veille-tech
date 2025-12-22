/**
 * Client-Side Configuration (Vite)
 * Uses import.meta.env for environment variables.
 */
export const CONFIG = {
    // API Configuration
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',

    // App Metadata
    APP_NAME: import.meta.env.VITE_APP_NAME || 'EUREKA AI',
    VERSION: '1.2.1',

    // Feature Flags & UI Settings
    THEME: {
        DEFAULT_MODE: 'dark',
    }
};

export default CONFIG;
