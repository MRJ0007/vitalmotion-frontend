import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function AuthPage() {
    const navigate = useNavigate();

    // Toggle between Login and Signup
    const [isLogin, setIsLogin] = useState(true);

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // Only used for Signup
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleAuth(e) {
        e.preventDefault();
        setError("");

        if (!email || (!isLogin && !phone)) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);

            // Logic: If Login, go to login endpoint. If Signup, go to signup.
            const endpoint = isLogin ? "/auth/login" : "/auth/signup";
            const payload = isLogin ? { email } : { email, phone, role: "user" };

            await api.post(endpoint, payload);

            localStorage.setItem("otp_user", JSON.stringify({ email }));

            // Immediate transition to OTP verification
            navigate("/user/otp");
        } catch (err) {
            setError(err.response?.data?.detail || "Authentication failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleAuth} style={styles.card}>
                <h2 style={styles.title}>
                    {isLogin ? "VitalMotion Login" : "Start Registering"}
                </h2>
                <p style={styles.subtitle}>
                    {isLogin ? "Enter your email to receive a secure OTP" : "Join our clinical telemetry network"}
                </p>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>EMAIL ADDRESS</label>
                    <input
                        type="email"
                        placeholder="doctor@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.inputStyle}
                        required
                    />
                </div>

                {!isLogin && (
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>PHONE NUMBER</label>
                        <input
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={styles.inputStyle}
                            required
                        />
                    </div>
                )}

                {error && <p style={styles.errorText}>⚠️ {error}</p>}

                <button disabled={loading} style={styles.btn}>
                    {loading ? "PROCESSING..." : isLogin ? "SEND OTP" : "CREATE ACCOUNT & SEND OTP"}
                </button>

                <div style={styles.toggleArea}>
                    <span style={styles.toggleText}>
                        {isLogin ? "Don't have an account?" : "Already a member?"}
                    </span>
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(""); }}
                        style={styles.toggleBtn}
                    >
                        {isLogin ? "START REGISTERING" : "BACK TO LOGIN"}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ---------------- BROAD & SIMPLE STYLES ---------------- */

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "white",
        fontFamily: "sans-serif",
    },
    card: {
        width: 400,
        padding: "40px 30px",
        borderRadius: 20,
        background: "#0f172a",
        border: "1px solid #1e293b",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    },
    title: {
        fontSize: "24px",
        fontWeight: "900",
        marginBottom: "8px",
        textAlign: "center",
        letterSpacing: "-0.5px"
    },
    subtitle: {
        fontSize: "13px",
        color: "#94a3b8",
        textAlign: "center",
        marginBottom: "30px",
    },
    inputGroup: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        fontSize: "11px",
        fontWeight: "900",
        color: "#22c55e",
        marginBottom: "8px",
        letterSpacing: "1px",
    },
    inputStyle: {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #334155",
        background: "#020617",
        color: "white",
        fontSize: "15px",
        boxSizing: "border-box",
    },
    errorText: {
        color: "#f87171",
        fontSize: "13px",
        textAlign: "center",
        marginBottom: "15px",
        fontWeight: "bold"
    },
    btn: {
        width: "100%",
        padding: "14px",
        background: "#22c55e",
        border: "none",
        color: "#020617",
        borderRadius: 10,
        fontWeight: "900",
        fontSize: "14px",
        cursor: "pointer",
        transition: "0.2s",
    },
    toggleArea: {
        marginTop: "25px",
        textAlign: "center",
    },
    toggleText: {
        fontSize: "13px",
        color: "#64748b",
        marginRight: "5px",
    },
    toggleBtn: {
        background: "none",
        border: "none",
        color: "#3b82f6",
        fontWeight: "900",
        fontSize: "13px",
        cursor: "pointer",
        textDecoration: "underline",
    },
};

export default AuthPage;