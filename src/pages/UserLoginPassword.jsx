import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { saveToken } from "../auth/authStorage";

export default function UserLoginPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            saveToken(res.data.access_token);
            navigate("/user/dashboard");

        } catch {
            setError("Invalid email or password");
        }
    }

    return (
        <div style={container}>
            <form onSubmit={handleLogin} style={card}>
                <h2>User Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={input}
                />

                {error && <p style={{ color: "#ef4444" }}>{error}</p>}

                <button style={btn}>Login</button>
            </form>
        </div>
    );
}

const container = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#020617",
    color: "white",
};

const card = {
    width: 360,
    padding: 24,
    borderRadius: 12,
    border: "1px solid #1e293b",
};

const input = {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    background: "#020617",
    color: "white",
    border: "1px solid #334155",
};

const btn = {
    width: "100%",
    padding: 10,
    background: "#22c55e",
    color: "#020617",
    borderRadius: 8,
    fontWeight: "bold",
};
