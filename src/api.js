import axios from "axios";

// Logic: Check environment
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Logic: Use localhost to match the Vite server origin
const BASE_URL = import.meta.env.VITE_API_URL ||
    (isLocal ? "http://localhost:8000" : "https://vitalmotion-api.onrender.com");

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && token !== "null") {
            const cleanToken = token.replace(/"/g, "");
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            if (!window.location.pathname.includes("/auth")) {
                window.location.href = "/user/auth";
            }
        }
        return Promise.reject(error);
    }
);

export default api;