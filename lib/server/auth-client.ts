// This file is a stub for the removed better-auth client.
// It exists to prevent build errors in legacy frontend files.

export const signIn = {
    social: async () => {
        console.log("Authentication is disabled.");
        window.location.href = "/dashboard";
    }
};

export const signOut = async () => {
    console.log("Sign out called (no-op).");
};

export const useSession = () => {
    return {
        data: null,
        loading: false
    };
};
