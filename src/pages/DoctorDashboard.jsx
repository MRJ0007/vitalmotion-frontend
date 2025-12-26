import { useEffect, useState } from "react";
import { api } from "../api";
import LogoutButton from "../components/LogoutButton";
import { getToken } from "../auth/authStorage";
import ChatBox from "../components/ChatBox";
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

    const [visionFile, setVisionFile] = useState(null);
    const [visionResult, setVisionResult] = useState(null);
    const [visionLoading, setVisionLoading] = useState(false);
    const [visionError, setVisionError] = useState("");

    const token = getToken();
    const payload = parseJwt(token);
    const doctorName = payload?.name || "Physician";
    const activePatientId = "vm-001";

    /* ---------------- TELEMETRY SYNC ---------------- */
    useEffect(() => {
        async function fetchPatientData() {
            try {
                const live = await api.get(`/sensor/live/${activePatientId}`);
                const alertRes = await api.get(`/alerts/latest/${activePatientId}`);
                setLatest(live.data);
                setAlerts(Array.isArray(alertRes.data) ? alertRes.data : alertRes.data ? [alertRes.data] : []);
                setError("");
            } catch {
                setError("SYSTEM FAILURE: PATIENT TELEMETRY OFFLINE");
                setAlerts([]);
            }
        }
        fetchPatientData();
        const t = setInterval(fetchPatientData, 5000);
        return () => clearInterval(t);
    }, []);

    /* ---------------- AI DIAGNOSTIC ---------------- */
    async function runDiagnosticAI() {
        if (!latest) return;
        try {
            setLoadingAI(true);
            const payload = {
                device_id: activePatientId,
                heart_rate: Number(latest.heart_rate),
                spo2: Number(latest.spo2),
                temperature: Number(latest.temperature),
            };
            const res = await api.post("/ai/analyze", payload);
            setClinicalInsight(res.data?.ai_insight || "Clinical assessment generated.");
        } catch {
            setClinicalInsight("Diagnostic engine unavailable. Review telemetry manually.");
        } finally {
            setLoadingAI(false);
        }
    }

    /* ---------------- VISION SCAN (Synced Logic) ---------------- */
    async function runVisionScan() {
        if (!visionFile) return setVisionError("Please select an image file");
        const formData = new FormData();
        formData.append("file", visionFile);

        try {
            setVisionLoading(true);
            setVisionError("");
            const res = await api.post("/vision/analyze-live", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Logic synced to User Dashboard structure
            setVisionResult(res.data.analysis || res.data.data);
        } catch (err) {
            setVisionError("Vision scan failed");
        } finally {
            setVisionLoading(false);
        }
    }

    return (
        <div style={styles.page}>
            {/* TOP NAVIGATION RAIL */}
            <nav style={styles.navRail}>
                <div style={styles.logoGroup}>
                    <div style={styles.pulseDot} />
                    <div>
                        <h1 style={styles.logoText}>PHYSICIAN PORTAL</h1>
                        <span style={styles.versionTag}>DR. {doctorName.toUpperCase()}</span>
                    </div>
                </div>
                <div style={styles.navLinks}>
                    <Link to="/about" style={styles.aboutLink}>ABOUT SYSTEM</Link>
                    <div style={styles.divider} />
                    <LogoutButton />
                </div>
            </nav>

            {/* TELEMETRY BANNER */}
            <section style={styles.telemetryGrid}>
                <MetricCard label="PATIENT HEART RATE" value={latest?.heart_rate} unit="BPM" color="#ff4d4d" icon="♥" />
                <MetricCard label="PATIENT SpO2" value={latest?.spo2} unit="%" color="#00d1ff" icon="O₂" />
                <MetricCard label="PATIENT TEMP" value={latest?.temperature} unit="°C" color="#ffb800" icon="🌡" />
            </section>

            {error && <div style={styles.systemAlert}>{error}</div>}

            {/* MAIN WORKSPACE */}
            <main style={styles.workspace}>
                {/* LEFT: CLINICAL TOOLS */}
                <div style={styles.leftPanel}>

                    {/* VISION SCANNER */}
                    <div style={styles.actionCard}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>CLINICAL DOCUMENT ANALYSIS</h3>
                            <div style={styles.statusBadge}>AZURE VISION AI</div>
                        </div>
                        <div style={styles.uploadZone}>
                            <input
                                type="file"
                                id="file-input"
                                style={{ display: 'none' }}
                                onChange={(e) => setVisionFile(e.target.files[0])}
                            />
                            <label htmlFor="file-input" style={styles.fileButton}>
                                {visionFile ? visionFile.name : "📁 ATTACH LAB REPORT / SCAN"}
                            </label>
                            <button
                                onClick={runVisionScan}
                                style={styles.scanButton}
                                disabled={visionLoading || !visionFile}
                            >
                                {visionLoading ? "SCANNING..." : "EXECUTE AI SCAN"}
                            </button>
                        </div>

                        {visionResult && (
                            <div style={styles.resultBox}>
                                <p style={styles.resultText}>{visionResult.extracted_note}</p>
                                <div style={styles.tagWrap}>
                                    {visionResult.tags?.map((t, i) => (
                                        <span key={i} style={styles.tag}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI DIAGNOSTIC SUMMARY */}
                    <div style={styles.actionCard}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>DIAGNOSTIC SUMMARY</h3>
                            <button onClick={runDiagnosticAI} style={styles.refreshBtn}>
                                {loadingAI ? "PROCESSING..." : "GENERATE INSIGHT"}
                            </button>
                        </div>
                        <div style={styles.aiTextBox}>
                            {clinicalInsight || "Aggregate patient data to generate clinical summary..."}
                        </div>
                    </div>
                </div>

                {/* RIGHT: ALERTS & COMMUNICATION */}
                <div style={styles.rightPanel}>
                    <div style={styles.monitorCard}>
                        <h4 style={styles.monitorTitle}>CRITICAL PATIENT ALERTS</h4>
                        <div style={styles.alertList}>
                            {alerts.length > 0 ? (
                                alerts.map((a, i) => (
                                    <div key={i} style={styles.alertItem}>
                                        <span style={styles.alertDot} />
                                        {a.message}
                                    </div>
                                ))
                            ) : (
                                <div style={styles.emptyText}>No immediate clinical threats detected.</div>
                            )}
                        </div>
                    </div>
                    <div style={styles.chatContainer}>
                        <ChatBox deviceId={activePatientId} role="doctor" />
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ---------------- UI COMPONENTS ---------------- */

function MetricCard({ label, value, unit, color, icon }) {
    return (
        <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
                <span style={styles.metricLabel}>{label}</span>
                <span style={{ color, opacity: 0.8 }}>{icon}</span>
            </div>
            <div style={styles.metricBody}>
                <span style={{ ...styles.metricValue, color }}>{value || "--"}</span>
                <span style={styles.metricUnit}>{unit}</span>
            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        minHeight: "100vh", background: "#020617", color: "#f1f5f9",
        padding: "0 40px 40px 40px", fontFamily: "'Inter', sans-serif"
    },
    navRail: {
        height: "80px", display: "flex", justifyContent: "space-between",
        alignItems: "center", borderBottom: "1px solid #1e293b", marginBottom: "30px"
    },
    logoGroup: { display: "flex", alignItems: "center", gap: "12px" },
    pulseDot: { width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 12px #ef4444" },
    logoText: { fontSize: "18px", fontWeight: "900", letterSpacing: "1px", margin: 0 },
    versionTag: { fontSize: "10px", color: "#64748b", fontWeight: "700" },

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
    alertItem: { fontSize: "13px", color: "#fca5a5", display: "flex", alignItems: "center", gap: "8px" },
    alertDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" },
    emptyText: { fontSize: "13px", color: "#475569", fontStyle: "italic" },
    chatContainer: { height: "400px", borderRadius: "20px", overflow: "hidden", border: "1px solid #1e293b" }
};