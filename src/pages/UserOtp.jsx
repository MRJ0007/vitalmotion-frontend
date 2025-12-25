import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function UserOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Matches your AuthPage localStorage key
    const email = localStorage.getItem("pending_email");

    useEffect(() => {
        if (!email) navigate("/user/auth");
    }, [email, navigate]);

    async function verifyOtp(e) {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            // Matches your existing VerifyOtpRequest { email, otp }
            await api.post("/auth/verify-otp", {
                email: email,
                otp: otp
            });

            // ✅ Matches your existing route in App.jsx
            navigate("/user/create-password");
        } catch (err) {
            setError(err.response?.data?.detail || "Invalid OTP. Use 123456.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={verifyOtp} style={styles.card}>
                <h2 style={{ color: "white", marginBottom: 10 }}>Verify OTP</h2>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Sent to: {email}</p>
                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    style={styles.input}
                    required
                />
                {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}
                <button disabled={loading} style={styles.btn}>
                    {loading ? "Verifying..." : "Confirm OTP"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" },
    card: { width: 350, padding: 30, borderRadius: 15, background: "#0f172a", border: "1px solid #1e293b", textAlign: "center" },
    input: { width: "100%", padding: 12, marginBottom: 15, borderRadius: 8, background: "#020617", color: "white", border: "1px solid #334155", textAlign: 'center', fontSize: '20px' },
    btn: { width: "100%", padding: 12, background: "#22c55e", color: "black", fontWeight: "bold", border: "none", borderRadius: 8, cursor: "pointer" }
};