import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "@/lib/server/prisma"; // Updated path
import { CONFIG } from '@/lib/server/config'; // Updated path
import { Resend } from 'resend';

const resend = new Resend(CONFIG.MAIL.API_KEY || 're_dummy_key_for_build');

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                try {
                    await resend.emails.send({
                        from: CONFIG.MAIL.FROM,
                        to: email,
                        subject: `Votre code de vérification ${CONFIG.APP_NAME}`,
                        html: `<p>Votre code OTP est <strong>${otp}</strong>. Il expire dans 5 minutes.</p>`
                    });
                } catch (error) {
                    console.error("Failed to send OTP:", error);
                    // In production you might want to throw or handle this more gracefully
                }
            },
            otpLength: 6,
            expiresIn: 300, // 5 minutes
        })
    ],
    // Add other providers if needed (Google, GitHub etc)
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    // Optional: Enable debug logs in dev
    // debug: process.env.NODE_ENV === 'development',
});

// Export the auth instance and specific methods
export default auth;
