import { createAuthClient } from "better-auth/client"
import { emailOTPClient } from "better-auth/client/plugins"
import { CONFIG } from "../config";

export const authClient = createAuthClient({
    baseURL: CONFIG.API_URL, // Ensure this matches your API URL
    plugins: [
        emailOTPClient()
    ]
})
