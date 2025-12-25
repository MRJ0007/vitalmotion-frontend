import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { setToken } from "../auth/authStorage"; // ✅ Fixed: Import setToken instead of saveToken

function DoctorLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            // Updated endpoint to match your common auth structure
            const res = await api.post("/auth/doctor/login", {
                email,
                password,
            });

            // Standardized token handling
            const token = res.data.access_token || res.data.token;

            if (!token) {
                throw new Error("Clinical Authorization Token not received");
            }

            // ✅ Fixed: Use setToken to match your authStorage.js
            setToken(token);

            // Redirect to broad doctor dashboard
            navigate("/doctor/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Invalid Physician Credentials"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.card}>
                <h2 style={styles.title}>Physician Portal</h2>
                <p style={styles.subtitle}>Secure Clinical Telemetry Access</p>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>EMAIL ADDRESS</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="physician@vitalmotion.ai"
                        required
                        style={styles.inputStyle}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>PASSWORD</label>
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
                    {loading ? "AUTHORIZING..." : "ACCESS PORTAL"}
                </button>

                <div style={styles.noteArea}>
                    <p style={styles.note}>
                        Physician accounts are provisioned by the Central Health Administrator only.
                    </p>
                </div>
            </form>
        </div>
    );
}

/* ---------------- BROAD & ELITE DOCTOR STYLES ---------------- */

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
        boxShadow: "0 10px 30px rgba(56, 189, 248, 0.1)", // Light blue glow for Doctor
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
        color: "#38bdf8", // Professional Blue for Doctor
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
        background: "#38bdf8", // Blue branding for physicians
        border: "none",
        color: "#020617",
        borderRadius: 10,
        fontWeight: "900",
        fontSize: "14px",
        cursor: "pointer",
        transition: "0.2s",
        marginTop: "10px"
    },
    noteArea: {
        marginTop: "25px",
        textAlign: "center",
        borderTop: "1px solid #1e293b",
        paddingTop: "15px"
    },
    note: {
        fontSize: "12px",
        color: "#475569",
        lineHeight: "1.4",
        fontWeight: "600"
    }
};

export default DoctorLogin;