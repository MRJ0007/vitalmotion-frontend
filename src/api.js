import axios from "axios";

/**
 * BASE_URL Logic (Fixed for Imagine Cup Demo):
 * 1. It first looks for VITE_API_URL (which you set in Vercel Settings).
 * 2. If that's missing, it defaults to your live Render backend.
 * 3. In local development, if VITE_API_URL isn't set, it falls back to localhost.
 */
const BASE_URL = import.meta.env.VITE_API_URL || "https://vitalmotion-api.onrender.com";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// REQUEST INTERCEPTOR: Automatically adds the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && token !== "null") {
            // Remove quotes if the token was stored as a JSON string
            const cleanToken = token.replace(/"/g, '');
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
    },
    (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR: Handles session expiry (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the backend returns 401, the user is logged out
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            if (!window.location.pathname.includes("/auth")) {
                window.location.href = "/user/auth";
            }
        }

        // Log network errors specifically for debugging during your demo
        if (error.code === 'ERR_NETWORK') {
            console.error("Network Error: Check if your Render backend is 'asleep' or if CORS is configured.");
        }

        return Promise.reject(error);
    }
);

export default api;