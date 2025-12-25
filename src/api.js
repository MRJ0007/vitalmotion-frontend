import axios from "axios";

/**
 * BASE_URL Logic:
 * In local dev, Vite sets import.meta.env.PROD to false.
 * In Vercel (Production), it becomes true.
 */
const BASE_URL = import.meta.env.PROD
    ? "https://api.vitalmotion.xyz"  // Production Azure URL
    : "http://127.0.0.1:8000";       // Local Uvicorn URL

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
            const cleanToken = token.replace(/"/g, '');
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handles session expiry (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            if (!window.location.pathname.includes("/auth")) {
                window.location.href = "/user/auth";
            }
        }
        return Promise.reject(error);
    }
);