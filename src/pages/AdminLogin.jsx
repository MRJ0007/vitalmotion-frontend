import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { setToken } from "../auth/authStorage"; // ✅ Standardized Import

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Administrator credentials required");
            return;
        }

        try {
            setLoading(true);

            // Admin specific endpoint
            const res = await api.post("/auth/admin/login", {
                email,
                password,
            });

            const token = res.data.access_token || res.data.token;

            if (!token) {
                throw new Error("System Level Token not received");
            }

            // Save the session
            setToken(token);

            // Redirect to admin control center
            navigate("/admin/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unauthorized: System Admin access only"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.card}>
                <h2 style={styles.title}>System Console</h2>
                <p style={styles.subtitle}>VitalMotion Infrastructure Access</p>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>ADMIN EMAIL</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="root@vitalmotion.ai"
                        required
                        style={styles.inputStyle}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>MASTER PASSWORD</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        style={styles.inputStyle}
                    />
                </div>

                {error && (
                    <p style={styles.errorText}>
                        ⚠️ {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={styles.btn}
                >
                    {loading ? "AUTHENTICATING ROOT..." : "INITIALIZE CONSOLE"}
                </button>

                <div style={styles.warningArea}>
                    <p style={styles.warning}>
                        This is a restricted area. All login attempts are logged for clinical security audits.
                    </p>
                </div>
            </form>
        </div>
    );
}

/* ---------------- BROAD & ELITE ADMIN STYLES ---------------- */

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
        boxShadow: "0 10px 30px rgba(239, 68, 68, 0.1)", // Red glow for Admin
    },
    title: {
        fontSize: "26px",
        fontWeight: "900",
        marginBottom: "8px",
        textAlign: "center",
        letterSpacing: "-0.5px"
    },
    subtitle: {
        fontSize: "13px",
        color: "#94a3b8",
        textAlign: "center",
        marginBottom: "35px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "1px"
    },
    inputGroup: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        fontSize: "11px",
        fontWeight: "900",
        color: "#ef4444", // Red for System Admin
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
        outline: "none"
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
        background: "#ef4444", // Bold red button
        border: "none",
        color: "white",
        borderRadius: 10,
        fontWeight: "900",
        fontSize: "14px",
        cursor: "pointer",
        transition: "0.2s",
        marginTop: "10px"
    },
    warningArea: {
        marginTop: "25px",
        textAlign: "center",
        borderTop: "1px solid #1e293b",
        paddingTop: "15px"
    },
    warning: {
        fontSize: "11px",
        color: "#64748b",
        lineHeight: "1.4",
        fontWeight: "600",
        fontStyle: "italic"
    }
};

export default AdminLogin;