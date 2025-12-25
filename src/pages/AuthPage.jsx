import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { setToken } from "../auth/authStorage";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: "", phone: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                const res = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password
                });

                if (res.data && res.data.access_token) {
                    setToken(res.data.access_token);

                    // ✅ FIXED: Safety check for user and role
                    const userData = res.data.user || { role: "user" };
                    localStorage.setItem("user", JSON.stringify(userData));

                    const role = userData.role ? userData.role.toLowerCase() : "user";

                    if (role === "doctor") navigate("/doctor/dashboard");
                    else navigate("/user/dashboard");
                }
            } else {
                // SIGNUP: Only Patients can sign up
                await api.post("/auth/signup", {
                    email: formData.email,
                    phone: formData.phone,
                    role: "user"
                });

                localStorage.setItem("pending_email", formData.email);
                alert("Patient Initialized! Use OTP: 123456");
                navigate("/user/otp");
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.response?.data?.detail || "Connection Error. Check your backend/DB.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>{isLogin ? "VITALMOTION LOGIN" : "PATIENT SIGNUP"}</h1>
                {error && <div style={styles.errorBox}>⚠️ {error}</div>}
                <form onSubmit={handleAction} style={styles.form}>
                    <input
                        type="email" style={styles.input} placeholder="Email"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
                    />
                    {!isLogin && (
                        <input
                            type="text" style={styles.input} placeholder="Phone Number"
                            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required
                        />
                    )}
                    {isLogin && (
                        <input
                            type="password" style={styles.input} placeholder="Password"
                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required
                        />
                    )}
                    <button type="submit" style={styles.mainBtn} disabled={loading}>
                        {loading ? "CONNECTING..." : isLogin ? "AUTHORIZE" : "CREATE ACCOUNT"}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
                    {isLogin ? "New Patient? Register Here" : "Existing User? Login"}
                </button>

            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: "100vh", background: "#020617", display: "flex", alignItems: "center", justifyContent: "center" },
    card: { width: "380px", background: "#0f172a", padding: "40px", borderRadius: "24px", border: "1px solid #1e293b", textAlign: "center" },
    input: { width: "100%", background: "#020617", border: "1px solid #1e293b", padding: "12px", borderRadius: "10px", color: "#fff", marginBottom: "15px", boxSizing: "border-box" },
    mainBtn: { width: "100%", background: "#22c55e", color: "#020617", padding: "14px", borderRadius: "10px", fontWeight: "900", border: "none", cursor: "pointer" },
    errorBox: { color: "#ef4444", marginBottom: "15px", fontSize: "12px", border: "1px solid #ef4444", padding: "10px", borderRadius: "8px" },
    switchBtn: { background: "none", border: "none", color: "#3b82f6", marginTop: "20px", cursor: "pointer", textDecoration: "underline" }
};