import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000" // On tape sur le frontend, le proxy Vite redirige vers 3001
});