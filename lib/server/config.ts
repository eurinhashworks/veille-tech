/**
 * Server-Side Configuration for Next.js Environment
 * Next.js automatically handles environment variables.
 */

export const CONFIG = {
    APP_NAME: process.env.APP_NAME || 'EUREKA AI',

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
};

export default CONFIG;
