import { useEffect, useState } from "react";
import { api } from "../api";
import LogoutButton from "../components/LogoutButton";
import { getToken } from "../auth/authStorage";
import ChatBox from "../components/ChatBox";
import { Link } from "react-router-dom";

/* ---------------- JWT Helper ---------------- */
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

export default function UserDashboard() {
    const [latest, setLatest] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [aiText, setAiText] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);
    const [error, setError] = useState("");

    const [visionFile, setVisionFile] = useState(null);
    const [visionResult, setVisionResult] = useState(null);
    const [visionLoading, setVisionLoading] = useState(false);
    const [visionError, setVisionError] = useState("");

    const token = getToken();
    const payload = parseJwt(token);
    const deviceId = payload?.device_id || "vm-001";

    useEffect(() => {
        async function fetchData() {
            try {
                const live = await api.get(`/sensor/live/${deviceId}`);
                const alertRes = await api.get(`/alerts/latest/${deviceId}`);
                setLatest(live.data);
                setAlerts(Array.isArray(alertRes.data) ? alertRes.data : alertRes.data ? [alertRes.data] : []);
                setError("");
            } catch {
                setError("SYSTEM OFFLINE");
                setAlerts([]);
            }
        }
        fetchData();
        const t = setInterval(fetchData, 5000);
        return () => clearInterval(t);
    }, [deviceId]);

    async function runAI() {
        if (!latest) return;
        try {
            setLoadingAI(true);
            const res = await api.post("/ai/analyze", {
                device_id: deviceId,
                heart_rate: Number(latest.heart_rate),
                spo2: Number(latest.spo2),
                temperature: Number(latest.temperature),
            });
            setAiText(res.data.ai_insight);
        } catch {
            setAiText("AI Calibration required.");
        } finally {
            setLoadingAI(false);
        }
    }

    async function runVisionScan() {
        if (!visionFile) return;
        const formData = new FormData();
        formData.append("file", visionFile);
        try {
            setVisionLoading(true);
            const res = await api.post("/vision/analyze-live", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setVisionResult(res.data.analysis);
        } catch {
            setVisionError("Scan failed.");
        } finally {
            setVisionLoading(false);
        }
    }

    return (
        <div style={styles.page}>
            {/* 1. TOP NAVIGATION RAIL */}
            <nav style={styles.navRail}>
                <div style={styles.logoGroup}>
                    <div style={styles.pulseDot} />
                    <h1 style={styles.logoText}>VITALMOTION</h1>
                    <span style={styles.versionTag}>v2.0.4</span>
                </div>
                <div style={styles.navLinks}>
                    <Link to="/about" style={styles.aboutLink}>ABOUT SYSTEM</Link>
                    <div style={styles.divider} />
                    <LogoutButton />
                </div>
            </nav>

            {/* 2. TELEMETRY BANNER (VITALS) */}
            <section style={styles.telemetryGrid}>
                <MetricCard label="HEART RATE" value={latest?.heart_rate} unit="BPM" color="#ff4d4d" trend="Stable" />
                <MetricCard label="OXYGEN (SpO2)" value={latest?.spo2} unit="%" color="#00d1ff" trend="Normal" />
                <MetricCard label="TEMPERATURE" value={latest?.temperature} unit="°C" color="#ffb800" trend="Optimal" />
            </section>

            {error && <div style={styles.systemAlert}>{error}</div>}

            {/* 3. INTELLIGENCE WORKSPACE */}
            <main style={styles.workspace}>
                {/* LEFT: ACTIVE ANALYSIS */}
                <div style={styles.leftPanel}>
                    {/* VISION SCANNER */}
                    <div style={styles.actionCard}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>VISION INTELLIGENCE</h3>
                            <div style={styles.statusBadge}>ACTIVE</div>
                        </div>
                        <div style={styles.uploadZone}>
                            <input
                                type="file"
                                id="file-input"
                                style={{ display: 'none' }}
                                onChange={(e) => setVisionFile(e.target.files[0])}
                            />
                            <label htmlFor="file-input" style={styles.fileButton}>
                                {visionFile ? visionFile.name : "SELECT DOCUMENT"}
                            </label>
                            <button
                                onClick={runVisionScan}
                                style={styles.scanButton}
                                disabled={visionLoading || !visionFile}
                            >
                                {visionLoading ? "SCANNING..." : "EXECUTE SCAN"}
                            </button>
                        </div>
                        {visionResult && (
                            <div style={styles.resultBox}>
                                <p style={styles.resultText}>{visionResult.extracted_note}</p>
                                <div style={styles.tagWrap}>
                                    {visionResult.tags?.map((t, i) => <span key={i} style={styles.tag}>{t}</span>)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI ANALYTICS */}
                    <div style={styles.actionCard}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>AI HEALTH ADVISOR</h3>
                            <button onClick={runAI} style={styles.refreshBtn}>
                                {loadingAI ? "PROCESSING..." : "REFRESH INSIGHT"}
                            </button>
                        </div>
                        <div style={styles.aiTextBox}>
                            {aiText || "Aggregating telemetry data... Click refresh for real-time analysis."}
                        </div>
                    </div>
                </div>

                {/* RIGHT: MONITORING & CHAT */}
                <div style={styles.rightPanel}>
                    <div style={styles.monitorCard}>
                        <h4 style={styles.monitorTitle}>SAFETY NOTICES</h4>
                        <div style={styles.alertList}>
                            {alerts.length > 0 ? (
                                alerts.map((a, i) => <div key={i} style={styles.alertItem}>• {a.message}</div>)
                            ) : (
                                <div style={styles.emptyText}>Monitoring clear. No active alerts.</div>
                            )}
                        </div>
                    </div>
                    <div style={styles.chatContainer}>
                        <ChatBox deviceId={deviceId} role="user" />
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ---------------- UI COMPONENTS ---------------- */

function MetricCard({ label, value, unit, color, trend }) {
    return (
        <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
                <span style={styles.metricLabel}>{label}</span>
                <span style={{ color: '#4ade80', fontSize: '10px' }}>{trend}</span>
            </div>
            <div style={styles.metricBody}>
                <span style={{ ...styles.metricValue, color }}>{value || "--"}</span>
                <span style={styles.metricUnit}>{unit}</span>
            </div>
        </div>
    );
}

/* ---------------- ORGANIZED STYLES ---------------- */

const styles = {
    page: {
        minHeight: "100vh",
        background: "#020617",
        color: "#f1f5f9",
        padding: "0 40px 40px 40px",
        fontFamily: "'Inter', sans-serif"
    },
    navRail: {
        height: "80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #1e293b",
        marginBottom: "30px"
    },
    logoGroup: { display: "flex", alignItems: "center", gap: "12px" },
    pulseDot: { width: "10px", height: "10px", borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 12px #3b82f6" },
    logoText: { fontSize: "18px", fontWeight: "900", letterSpacing: "1px", margin: 0 },
    versionTag: { fontSize: "10px", background: "#1e293b", padding: "2px 6px", borderRadius: "4px", color: "#64748b" },

    navLinks: { display: "flex", alignItems: "center", gap: "20px" },
    aboutLink: { fontSize: "12px", fontWeight: "700", color: "#3b82f6", textDecoration: "none" },
    divider: { width: "1px", height: "20px", background: "#334155" },

    telemetryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" },
    metricCard: { background: "#0f172a", padding: "24px", borderRadius: "16px", border: "1px solid #1e293b" },
    metricHeader: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
    metricLabel: { fontSize: "10px", fontWeight: "800", color: "#64748b" },
    metricBody: { display: "flex", alignItems: "baseline", gap: "8px" },
    metricValue: { fontSize: "32px", fontWeight: "800" },
    metricUnit: { fontSize: "14px", color: "#475569" },

    systemAlert: { background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#ef4444", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "12px", textAlign: "center", fontWeight: "700" },

    workspace: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "30px" },
    leftPanel: { display: "flex", flexDirection: "column", gap: "30px" },
    rightPanel: { display: "flex", flexDirection: "column", gap: "30px" },

    actionCard: { background: "#0f172a", borderRadius: "20px", padding: "24px", border: "1px solid #1e293b" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    cardTitle: { fontSize: "14px", fontWeight: "800", color: "#94a3b8" },
    statusBadge: { fontSize: "9px", background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", padding: "4px 8px", borderRadius: "4px", fontWeight: "900" },

    uploadZone: { display: "flex", gap: "12px" },
    fileButton: { flex: 1, background: "#1e293b", padding: "12px", borderRadius: "12px", fontSize: "12px", textAlign: "center", cursor: "pointer", border: "1px dashed #334155" },
    scanButton: { background: "#3b82f6", color: "white", border: "none", padding: "0 24px", borderRadius: "12px", fontWeight: "700", cursor: "pointer" },

    resultBox: { marginTop: "20px", padding: "15px", background: "#020617", borderRadius: "12px" },
    resultText: { fontSize: "14px", lineHeight: "1.6", color: "#cbd5e1" },
    tagWrap: { display: "flex", gap: "8px", marginTop: "12px" },
    tag: { background: "#1e3a8a", color: "#60a5fa", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" },

    aiTextBox: { fontSize: "15px", lineHeight: "1.6", color: "#cbd5e1", background: "rgba(30, 41, 59, 0.5)", padding: "20px", borderRadius: "12px" },
    refreshBtn: { background: "transparent", color: "#3b82f6", border: "1px solid #3b82f6", padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", cursor: "pointer" },

    monitorCard: { background: "#0f172a", borderRadius: "20px", padding: "24px", border: "1px solid #1e293b" },
    monitorTitle: { fontSize: "12px", fontWeight: "800", color: "#64748b", marginBottom: "15px" },
    alertList: { display: "flex", flexDirection: "column", gap: "10px" },
    alertItem: { fontSize: "13px", color: "#fca5a5" },
    emptyText: { fontSize: "13px", color: "#475569", fontStyle: "italic" },
    chatContainer: { height: "400px", borderRadius: "20px", overflow: "hidden" }
};