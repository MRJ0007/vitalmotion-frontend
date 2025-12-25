import { Navigate } from "react-router-dom";
import { getToken } from "./authStorage";

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

export default function RequireRole({ role, children }) {
    const token = getToken();

    if (!token) {
        return <Navigate to={`/${role}/login`} />;
    }

    const payload = parseJwt(token);

    if (!payload || payload.role !== role) {
        return <Navigate to={`/${role}/login`} />;
    }

    return children;
}
