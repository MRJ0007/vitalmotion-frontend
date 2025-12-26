import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function CreatePassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const email = localStorage.getItem("pending_email");

    useEffect(() => {
        if (!email) navigate("/user/auth");
    }, [email, navigate]);

    async function handleSave(e) {
        e.preventDefault();
        setError("");

        if (password.length < 8) return setError("Password must be at least 8 characters");
        if (password !== confirm) return setError("Passwords do not match");

        try {
            setLoading(true);
            // Matches Schema: { email, password }
            await api.post("/auth/create-password", {
                email: email,
                password: password
            });

            localStorage.removeItem("pending_email");
            alert("Account fully activated!");
            navigate("/user/auth");
        } catch (err) {
            // LOGIC: Safely extract error string to prevent React crash
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail[0].msg);
            } else {
                setError(typeof detail === 'string' ? detail : "Failed to set password.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleSave} style={styles.card}>
                <h2 style={{ color: "white", marginBottom: 20 }}>Create Password</h2>
                <input
                    type="password" placeholder="New Password (min 8 chars)" value={password}
                    onChange={(e) => setPassword(e.target.value)} style={styles.input} required
                />
                <input
                    type="password" placeholder="Confirm Password" value={confirm}
                    onChange={(e) => setConfirm(e.target.value)} style={styles.input} required
                />
                {/* Logic: Render as string only */}
                {error && <p style={{ color: "#f87171", fontSize: "14px", marginTop: "10px" }}>{String(error)}</p>}

                <button disabled={loading} style={styles.btn}>
                    {loading ? "Saving..." : "Finalize Account"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#020617" },
    card: { background: "#0f172a", padding: 40, borderRadius: 16, border: "1px solid #1e293b", textAlign: "center", width: 360 },
    input: { width: "100%", padding: 12, marginBottom: 15, borderRadius: 8, background: "#020617", color: "white", border: "1px solid #334155", boxSizing: "border-box" },
    btn: { width: "100%", padding: 14, background: "#22c55e", color: "black", fontWeight: "bold", border: "none", borderRadius: 8, cursor: "pointer", marginTop: 10 }
};