// Final Handshake Fix
import axios from "axios";

/**
 * SMART BASE_URL LOGIC FOR VITALMOTION
 * 1. Priority: Vercel Environment Variable (VITE_API_URL)
 * 2. Fallback: Direct Render URL (Hardcoded to ensure it never fails)
 */
const BASE_URL = import.meta.env.VITE_API_URL || "https://vitalmotion-api.onrender.com";

// Defensive check to alert you in the console if something is wrong
if (!BASE_URL) {
    console.error("❌ API BASE URL is not configured. Check Vercel Settings.");
}

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ==============================
// REQUEST INTERCEPTOR (JWT Handling)
// ==============================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && token !== "null") {
            // Cleans token of extra quotes if stored via JSON.stringify
            const cleanToken = token.replace(/"/g, "");
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
    },
    (error) => {
        console.error("Request Interceptor Error:", error);
        return Promise.reject(error);
    }
);

// ==============================
// RESPONSE INTERCEPTOR (Error Handling)
// ==============================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle Session Expiry (401 Unauthorized)
        if (error.response?.status === 401) {
            localStorage.clear();
            // Redirect to login if not already there
            if (!window.location.pathname.includes("/auth")) {
                window.location.href = "/user/auth";
            }
        }

        // Handle Connection/Network Errors
        if (error.code === "ERR_NETWORK") {
            console.error("❌ Network Error → Cannot reach backend at:", BASE_URL);
            console.warn("Hint: Ensure Render backend is not sleeping and CORS includes this domain.");
        }

        return Promise.reject(error);
    }
);

export default api;