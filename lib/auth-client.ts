// This file is a stub for the removed better-auth client.
// It exists to prevent build errors in legacy frontend files.

export const authClient = {
    signIn: {
        emailOtp: async ({ email, otp }: { email: string, otp: string }) => {
            console.log("Mock sign in with OTP", email, otp);
            // Explicitly typing error as nullable object with message
            return {
                data: { user: { id: "mock-user" } },
                error: null as { message: string } | null
            };
        },
        social: async () => {
            console.log("Authentication is disabled.");
            if (typeof window !== 'undefined') window.location.href = "/dashboard";
        }
    },
    emailOtp: {
        sendVerificationOtp: async ({ email, type }: { email: string, type: string }) => {
            console.log("Mock send OTP", email, type);
            return {
                data: { success: true },
                error: null as { message: string } | null
            };
        }
    },
    signOut: async () => {
        console.log("Sign out called (no-op).");
    },
    useSession: () => {
        return {
            data: null,
            loading: false
        };
    }
};

export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
