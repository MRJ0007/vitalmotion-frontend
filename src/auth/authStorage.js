// src/auth/authStorage.js

export function setToken(token) {
    localStorage.setItem("token", token);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function removeToken() {
    localStorage.removeItem("token");
}

// Keep logout as an alias if your other components use it
export function logout() {
    localStorage.removeItem("token");
}