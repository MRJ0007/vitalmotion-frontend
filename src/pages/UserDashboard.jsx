import { useEffect, useState } from "react";
import { api } from "../api";
import LogoutButton from "../components/LogoutButton";
import { getToken } from "../auth/authStorage";
import ChatBox from "../components/ChatBox";
import ClinicalScanner from "../components/ClinicalScanner";
import { Link } from "react-router-dom";

function parseJwt(token) {
    try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
}

export default function UserDashboard() {
    const [latest, setLatest] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [aiText, setAiText] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);
    const [error, setError] = useState("");

    const token = getToken();
    const payload = parseJwt(token);
    const deviceId = payload?.device_id || "vm-001";

    useEffect(() => {
        async function fetchData() {
            try {
                const live = await api.get(`/sensor/live/${deviceId}`);
                const alertRes = await api.get(`/alerts/latest/${deviceId}`);
                setLatest(live.data);
                setAlerts(alertRes.data || []);
                setError("");
            } catch {
                setError("OFFLINE: UNABLE TO SYNC WEARABLE");
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
                heart_rate: latest.heart_rate,
                spo2: latest.spo2,
                temperature: latest.temperature,
            });
            setAiText(res.data.ai_insight || res.data.summary || "");
        } catch {
            setAiText("AI Guide is recalibrating. Please retry shortly.");
        } finally {
            setLoadingAI(false);
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.greeting}>WELCOME BACK! 👋</h2>
                    <p style={styles.subText}>REAL-TIME HEALTH INTELLIGENCE</p>
                </div>
                <div style={styles.headerRight}>
                    <Link to="/about" style={styles.aboutLink}>SYSTEM INFO</Link>
                    <LogoutButton />
                </div>
            </div>

            <div style={styles.statusBadgeBlue}>
                <span style={styles.pulseBlue}></span>
                AZURE AI VISION ACTIVE — READY FOR SCAN
            </div>

            {error && <div style={styles.errorBox}>⚠️ {error}</div>}

            {latest && (
                <div style={styles.grid}>
                    <MetricCard label="HEART RATE" value={latest.heart_rate} unit="BPM" color="#ef4444" />
                    <MetricCard label="BLOOD OXYGEN" value={latest.spo2} unit="%" color="#3b82f6" />
                    <MetricCard label="BODY TEMP" value={latest.temperature} unit="°C" color="#f59e0b" />
                </div>
            )}

            <div style={styles.mainLayout}>
                <div style={styles.leftCol}>
                    <div style={styles.panel}>
                        <div style={styles.panelHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={styles.iconBoxBlue}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                                <h3 style={styles.panelTitle}>PERSONAL DOCUMENT SCANNER</h3>
                            </div>
                            <span style={styles.tagBlue}>AI VISION</span>
                        </div>
                        <div style={styles.panelBody}><ClinicalScanner /></div>
                    </div>

                    <div style={styles.aiPanel}>
                        <div style={styles.aiHeader}>
                            <h3 style={styles.panelTitle}>✨ VITALMOTION AI GUIDE</h3>
                            <button onClick={runAI} disabled={loadingAI} style={loadingAI ? styles.btnDisabled : styles.btnActive}>
                                {loadingAI ? "ANALYZING..." : "REFRESH INSIGHT"}
                            </button>
                        </div>
                        <div style={styles.aiBody}>
                            {aiText ? <p style={styles.aiText}>{aiText}</p> : <div style={styles.placeholder}>Click above for your personalized AI health analysis.</div>}
                        </div>
                    </div>
                </div>

                <div style={styles.sidebar}>
                    {alerts.length > 0 && (
                        <div style={styles.alertBox}>
                            <h4 style={{ color: '#fcd34d', margin: '0 0 15px 0', fontWeight: '900' }}>SAFETY NOTICES</h4>
                            {alerts.map((a, i) => <div key={i} style={styles.alertItem}>{a.message}</div>)}
                        </div>
                    )}
                    <div style={styles.chatWrapper}><ChatBox deviceId={deviceId} role="user" /></div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, unit, color }) {
    return (
        <div style={styles.card}>
            <span style={styles.cardLabel}>{label}</span>
            <div style={styles.cardValueRow}>
                <span style={{ ...styles.cardValue, color: color }}>{value}</span>
                <span style={styles.cardUnit}>{unit}</span>
            </div>
        </div>
    );
}
const styles = {
    page: { minHeight: "100vh", background: "#020617", color: "#f8fafc", padding: "40px", fontFamily: "'Inter', sans-serif" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    greeting: { fontSize: "28px", fontWeight: "900", margin: 0, letterSpacing: "-0.5px" },
    subText: { color: "#64748b", fontSize: "14px", fontWeight: "700", marginTop: "4px" },
    headerRight: { display: "flex", gap: "25px", alignItems: "center" },
    adminLink: { color: "#22c55e", textDecoration: "none", fontWeight: "900", fontSize: "13px" },
    aboutLink: { color: "#3b82f6", textDecoration: "none", fontWeight: "900", fontSize: "13px" },

    statusBadge: { padding: "14px", borderRadius: "12px", background: "rgba(34, 197, 94, 0.05)", border: "1px solid #22c55e", color: "#22c55e", fontSize: "12px", fontWeight: "900", textAlign: "center", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", letterSpacing: "1px" },
    statusBadgeBlue: { padding: "14px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.05)", border: "1px solid #3b82f6", color: "#3b82f6", fontSize: "12px", fontWeight: "900", textAlign: "center", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", letterSpacing: "1px" },
    pulse: { height: "10px", width: "10px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 12px #22c55e" },
    pulseBlue: { height: "10px", width: "10px", borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 12px #3b82f6" },

    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "40px" },
    card: { background: "#0f172a", padding: "28px", borderRadius: "24px", border: "1px solid #1e293b", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
    cardLabel: { fontSize: "11px", color: "#94a3b8", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" },
    cardValueRow: { display: "flex", alignItems: "baseline", gap: "8px", marginTop: "12px" },
    cardValue: { fontSize: "42px", fontWeight: "900" },
    cardUnit: { fontSize: "18px", color: "#475569", fontWeight: "700" },

    mainLayout: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "30px" },
    leftCol: { display: "flex", flexDirection: "column", gap: "30px" },
    panel: { background: "#0f172a", borderRadius: "24px", border: "1px solid #1e293b", overflow: "hidden" },
    panelHeader: { padding: "20px 24px", background: "#131823", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" },
    panelTitle: { fontSize: "15px", fontWeight: "900", margin: 0, letterSpacing: "0.5px" },
    iconBox: { background: '#22c55e', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)' },
    iconBoxBlue: { background: '#3b82f6', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' },
    tag: { fontSize: "10px", color: "#22c55e", background: "rgba(34, 197, 94, 0.1)", padding: "5px 10px", borderRadius: "6px", fontWeight: "900" },
    tagBlue: { fontSize: "10px", color: "#3b82f6", background: "rgba(59, 130, 246, 0.1)", padding: "5px 10px", borderRadius: "6px", fontWeight: "900" },
    panelBody: { padding: "24px" },

    aiPanel: { background: "#0f172a", borderRadius: "24px", border: "1px solid rgba(34, 197, 94, 0.2)", overflow: "hidden" },
    aiHeader: { padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", background: "rgba(34, 197, 94, 0.03)" },
    aiBody: { padding: "28px" },
    aiText: { fontSize: "16px", lineHeight: "1.8", color: "#cbd5e1", fontWeight: "500" },
    placeholder: { textAlign: "center", color: "#475569", fontSize: "14px", padding: "20px", fontWeight: "600" },

    btnActive: { background: "#f8fafc", color: "#020617", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "900", cursor: "pointer", fontSize: "12px", transition: "0.2s" },
    btnDisabled: { background: "#1e293b", color: "#475569", border: "none", padding: "12px 24px", borderRadius: "12px", cursor: "not-allowed", fontSize: "12px" },

    sidebar: { display: "flex", flexDirection: "column", gap: "30px" },
    alertBox: { background: "rgba(251, 191, 36, 0.05)", border: "1px solid rgba(251, 191, 36, 0.2)", padding: "24px", borderRadius: "24px" },
    alertItem: { fontSize: "14px", color: "#fbbf24", padding: "12px 0", borderBottom: "1px solid rgba(251, 191, 36, 0.1)", fontWeight: "600" },
    chatWrapper: { flex: 1, minHeight: "550px" },
    errorBox: { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "18px", borderRadius: "16px", textAlign: "center", fontWeight: "900", marginBottom: "30px", border: "1px solid #ef4444", fontSize: "14px" }
};