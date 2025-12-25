import { useEffect, useState } from "react";
import { api } from "../api";
import LogoutButton from "../components/LogoutButton";
import { getToken } from "../auth/authStorage";
import ChatBox from "../components/ChatBox";
import ClinicalScanner from "../components/ClinicalScanner";
import { Link } from "react-router-dom";

/* ---------------- JWT Helper ---------------- */
function parseJwt(token) {
    try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
}

export default function DoctorDashboard() {
    const [latest, setLatest] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [clinicalInsight, setClinicalInsight] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);
    const [error, setError] = useState("");

    const token = getToken();
    const payload = parseJwt(token);
    const doctorName = payload?.name || "Physician";
    const activePatientId = "vm-001";

    /* ---------------- Telemetry Sync ---------------- */
    useEffect(() => {
        async function fetchPatientData() {
            try {
                const live = await api.get(`/sensor/live/${activePatientId}`);
                const alertRes = await api.get(`/alerts/latest/${activePatientId}`);
                setLatest(live.data);
                setAlerts(alertRes.data || []);
                setError("");
            } catch {
                setError("SYSTEM FAILURE: PATIENT TELEMETRY UPLINK OFFLINE");
            }
        }
        fetchPatientData();
        const t = setInterval(fetchPatientData, 5000);
        return () => clearInterval(t);
    }, [activePatientId]);

    /* ---------------- AI Diagnostic Assistant ---------------- */
    async function runDiagnosticAI() {
        if (!latest) return;
        try {
            setLoadingAI(true);
            const res = await api.post("/ai/analyze", {
                heart_rate: latest.heart_rate,
                spo2: latest.spo2,
                temperature: latest.temperature,
            });
            setClinicalInsight(res.data.ai_insight || res.data.summary || "");
        } catch {
            setClinicalInsight("Diagnostic Engine Throttled. Review raw telemetry manually.");
        } finally {
            setLoadingAI(false);
        }
    }

    return (
        <div style={styles.page}>
            {/* Physician Header - Admin Link Removed */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.greeting}>PHYSICIAN PORTAL: {doctorName.toUpperCase()} 🩺</h2>
                    <p style={styles.subText}>DIAGNOSTIC OVERVIEW: {activePatientId}</p>
                </div>
                <div style={styles.headerRight}>
                    {/* Only About and Logout remain for a cleaner look */}
                    <Link to="/about" style={styles.aboutLink}>ABOUT SYSTEM</Link>
                    <LogoutButton />
                </div>
            </div>

            {/* Azure AI Status Badge */}
            <div style={styles.statusBadge}>
                <span style={styles.pulse}></span>
                AZURE AI VISION ENGINE: ACTIVE (REGION: CENTRALINDIA)
            </div>

            {error && <div style={styles.errorBox}>⚠️ {error}</div>}

            {/* Clinical Telemetry Grid */}
            {latest && (
                <div style={styles.grid}>
                    <MetricCard label="HEART RATE" value={latest.heart_rate} unit="BPM" color="#ef4444" />
                    <MetricCard label="SPO2 SATURATION" value={latest.spo2} unit="%" color="#3b82f6" />
                    <MetricCard label="CORE TEMPERATURE" value={latest.temperature} unit="°C" color="#f59e0b" />
                </div>
            )}

            <div style={styles.mainLayout}>
                <div style={styles.leftCol}>
                    <div style={styles.panel}>
                        <div style={styles.panelHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={styles.iconBox}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                                <h3 style={styles.panelTitle}>AI CLINICAL SCANNER</h3>
                            </div>
                            <span style={styles.tag}>VISION 4.0</span>
                        </div>
                        <div style={styles.panelBody}>
                            <ClinicalScanner />
                        </div>
                    </div>

                    <div style={styles.aiPanel}>
                        <div style={styles.aiHeader}>
                            <h3 style={styles.panelTitle}>✨ DIAGNOSTIC ASSISTANT</h3>
                            <button onClick={runDiagnosticAI} disabled={loadingAI} style={loadingAI ? styles.btnDisabled : styles.btnActive}>
                                {loadingAI ? "PROCESSING..." : "GENERATE SUMMARY"}
                            </button>
                        </div>
                        <div style={styles.aiBody}>
                            {clinicalInsight ? (
                                <p style={styles.aiText}>{clinicalInsight}</p>
                            ) : (
                                <div style={styles.placeholder}>Awaiting telemetry for automated clinical assessment...</div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={styles.sidebar}>
                    <div style={styles.alertBox}>
                        <h4 style={{ color: '#fbbf24', margin: '0 0 15px 0', fontWeight: '900' }}>CRITICAL ALERTS</h4>
                        {alerts.length > 0 ? (
                            alerts.map((a, i) => <div key={i} style={styles.alertItem}>{a.message}</div>)
                        ) : (
                            <p style={{ fontSize: '12px', color: '#475569', fontWeight: '700' }}>NO ACTIVE HEMODYNAMIC ALERTS</p>
                        )}
                    </div>
                    <div style={styles.chatWrapper}>
                        <ChatBox deviceId={activePatientId} role="doctor" />
                    </div>
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
    aboutLink: { color: "#3b82f6", textDecoration: "none", fontWeight: "900", fontSize: "13px" },

    statusBadge: { padding: "14px", borderRadius: "12px", background: "rgba(34, 197, 94, 0.05)", border: "1px solid #22c55e", color: "#22c55e", fontSize: "12px", fontWeight: "900", textAlign: "center", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", letterSpacing: "1px" },
    pulse: { height: "10px", width: "10px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 12px #22c55e" },

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
    tag: { fontSize: "10px", color: "#22c55e", background: "rgba(34, 197, 94, 0.1)", padding: "5px 10px", borderRadius: "6px", fontWeight: "900" },
    panelBody: { padding: "24px" },

    aiPanel: { background: "#0f172a", borderRadius: "24px", border: "1px solid rgba(34, 197, 94, 0.2)", overflow: "hidden" },
    aiHeader: { padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", background: "rgba(34, 197, 94, 0.03)" },
    aiBody: { padding: "28px" },
    aiText: { fontSize: "16px", lineHeight: "1.8", color: "#cbd5e1", fontWeight: "500" },
    placeholder: { textAlign: "center", color: "#475569", fontSize: "14px", padding: "20px", fontWeight: "600" },

    btnActive: { background: "#f8fafc", color: "#020617", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "900", cursor: "pointer", fontSize: "12px" },
    btnDisabled: { background: "#1e293b", color: "#475569", border: "none", padding: "12px 24px", borderRadius: "12px", cursor: "not-allowed", fontSize: "12px" },

    sidebar: { display: "flex", flexDirection: "column", gap: "30px" },
    alertBox: { background: "rgba(251, 191, 36, 0.05)", border: "1px solid rgba(251, 191, 36, 0.2)", padding: "24px", borderRadius: "24px" },
    alertItem: { fontSize: "14px", color: "#fbbf24", padding: "12px 0", borderBottom: "1px solid rgba(251, 191, 36, 0.1)", fontWeight: "600" },
    chatWrapper: { flex: 1, minHeight: "550px" },
    errorBox: { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "18px", borderRadius: "16px", textAlign: "center", fontWeight: "900", marginBottom: "30px", border: "1px solid #ef4444", fontSize: "14px" }
};