import React from "react";
import { Link } from "react-router-dom";

export default function About() {
    return (
        <div style={styles.page}>
            {/* Navbar */}
            <div style={styles.nav}>
                <div style={styles.navContent}>
                    <span style={styles.brand}>VitalMotion | Clinical Intelligence</span>
                    <Link to="/" style={styles.navLink}>Return to Portal</Link>
                </div>
            </div>

            {/* Hero */}
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>Project Overview & Clinical Impact</h1>
                <p style={styles.heroSubtitle}>
                    A standardized, ethical, AI-assisted vital monitoring platform
                    designed for early intervention in low-resource and rural healthcare systems.
                </p>
            </div>

            <div style={styles.container}>
                <div style={styles.layout}>
                    {/* Main Content */}
                    <div style={styles.mainContent}>
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>Global Health Context</h2>
                            <p style={styles.para}>
                                Cardiovascular diseases remain the leading cause of mortality worldwide.
                                According to the World Health Organization (WHO), approximately
                                <b> 17.9 million deaths occur annually</b>, accounting for nearly
                                <b> 32% of all global deaths</b>.
                            </p>
                            <p style={styles.para}>
                                VitalMotion focuses on the <b>3.6 billion people</b> lacking access to
                                essential healthcare services, particularly in rural and underserved regions
                                where early diagnostics are delayed by distance and infrastructure gaps.
                            </p>
                        </section>

                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>Clinical Governance & Ethics</h2>
                            <p style={styles.para}>
                                VitalMotion is designed strictly as a
                                <b> Clinical Decision Support System (CDSS)</b>.
                            </p>
                            <ul style={styles.list}>
                                <li>No automated diagnosis or prescriptions are generated.</li>
                                <li>AI insights are advisory and support licensed medical professionals.</li>
                                <li>Patient monitoring sessions are isolated to maintain data sovereignty.</li>
                                <li>System design aligns with HIPAA-inspired privacy principles.</li>
                            </ul>
                        </section>

                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>Project Author & Contact</h2>
                            <p style={styles.para}>
                                This project is independently designed and developed as a solo,
                                research-driven innovation initiative for the Microsoft Imagine Cup 2025.
                            </p>

                            <div style={styles.contactBox}>
                                <div>
                                    <span style={styles.contactLabel}>Email</span>
                                    <a
                                        href="mailto:labishetty1234@gmail.com"
                                        style={styles.contactLink}
                                    >
                                        labishetty1234@gmail.com
                                    </a>
                                </div>

                                <div>
                                    <span style={styles.contactLabel}>GitHub</span>
                                    <a
                                        href="https://github.com/MRJ0007"
                                        target="_blank"
                                        rel="noreferrer"
                                        style={styles.contactLink}
                                    >
                                        github.com/MRJ0007
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* NEW PROFESSIONAL SECTION */}
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                Open Collaboration & Continuous Improvement
                            </h2>
                            <p style={styles.para}>
                                VitalMotion is built on the belief that meaningful healthcare innovation
                                evolves through continuous learning, responsible experimentation,
                                and shared expertise.
                            </p>
                            <p style={styles.para}>
                                Any suggestions, architectural improvements, research insights,
                                or ideas that contribute toward ethical healthcare delivery
                                and positive societal impact are highly appreciated.
                            </p>
                            <p style={styles.para}>
                                The project remains open to constructive feedback and future collaboration
                                aimed at improving accessibility, reliability, and real-world clinical value.
                            </p>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside style={styles.sidebar}>
                        <div style={styles.cardGreen}>
                            <h3 style={styles.cardTitleGreen}>Special Recognition</h3>
                            <p style={styles.cardText}>
                                This project is proudly developed for the
                                <b> Microsoft Imagine Cup</b>.
                            </p>
                            <p style={styles.cardText}>
                                Sincere gratitude to <b>Microsoft Azure</b> for scalable cloud and AI services,
                                and <b>GitHub</b> for empowering the development lifecycle.
                            </p>
                            <div style={styles.tagRow}>
                                <span style={styles.tag}>Azure</span>
                                <span style={styles.tag}>GitHub</span>
                                <span style={styles.tag}>Imagine Cup</span>
                            </div>
                        </div>

                        <div style={styles.cardBlue}>
                            <h3 style={styles.cardTitle}>Security & Privacy</h3>
                            <p style={styles.cardTextMuted}>
                                VitalMotion follows stateless processing principles where real-time
                                health data is analyzed without unnecessary long-term storage,
                                minimizing privacy risks and regulatory exposure.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            <footer style={styles.footer}>
                © 2025 VitalMotion Research & Development · Microsoft Imagine Cup 2025
            </footer>
        </div>
    );
}

/* ================= STYLES ================= */

const styles = {
    page: {
        background: "radial-gradient(circle at top, #020617, #000)",
        minHeight: "100vh",
        color: "#f1f5f9",
        fontFamily: "Inter, Arial, sans-serif",
    },

    nav: {
        borderBottom: "1px solid #1e293b",
        padding: "14px 0",
        background: "#020617",
    },
    navContent: {
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        padding: "0 20px",
    },
    brand: {
        fontSize: "13px",
        fontWeight: "700",
        color: "#22c55e",
        letterSpacing: "1px",
        textTransform: "uppercase",
    },
    navLink: {
        color: "#60a5fa",
        textDecoration: "none",
        fontSize: "13px",
    },

    hero: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "60px 20px 40px",
    },
    heroTitle: {
        fontSize: "36px",
        fontWeight: "700",
        marginBottom: "14px",
    },
    heroSubtitle: {
        fontSize: "18px",
        color: "#94a3b8",
        maxWidth: "820px",
        lineHeight: "1.6",
    },

    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 20px",
    },
    layout: {
        display: "flex",
        gap: "40px",
    },
    mainContent: { flex: 2 },
    sidebar: { flex: 1 },

    section: { marginBottom: "40px" },
    sectionTitle: {
        fontSize: "20px",
        marginBottom: "16px",
        borderBottom: "2px solid #22c55e",
        paddingBottom: "6px",
        color: "#22c55e",
    },
    para: {
        fontSize: "15px",
        color: "#cbd5e1",
        lineHeight: "1.7",
        marginBottom: "12px",
    },
    list: {
        paddingLeft: "20px",
        fontSize: "15px",
        color: "#cbd5e1",
        lineHeight: "2",
    },

    contactBox: {
        display: "flex",
        gap: "30px",
        marginTop: "15px",
        flexWrap: "wrap",
    },
    contactLabel: {
        display: "block",
        fontSize: "11px",
        color: "#94a3b8",
        textTransform: "uppercase",
        marginBottom: "4px",
    },
    contactLink: {
        color: "#60a5fa",
        fontSize: "14px",
        textDecoration: "none",
        fontWeight: "500",
    },

    cardGreen: {
        background: "rgba(34,197,94,0.08)",
        border: "1px solid rgba(34,197,94,0.25)",
        padding: "22px",
        borderRadius: "14px",
        marginBottom: "22px",
    },
    cardBlue: {
        background: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.25)",
        padding: "22px",
        borderRadius: "14px",
    },
    cardTitleGreen: {
        fontSize: "13px",
        fontWeight: "700",
        color: "#22c55e",
        textTransform: "uppercase",
        marginBottom: "12px",
    },
    cardTitle: {
        fontSize: "13px",
        fontWeight: "700",
        color: "#fff",
        textTransform: "uppercase",
        marginBottom: "12px",
    },
    cardText: {
        fontSize: "14px",
        color: "#e5e7eb",
        lineHeight: "1.6",
        marginBottom: "10px",
    },
    cardTextMuted: {
        fontSize: "14px",
        color: "#94a3b8",
        lineHeight: "1.6",
    },

    tagRow: {
        display: "flex",
        gap: "8px",
        marginTop: "14px",
    },
    tag: {
        background: "#020617",
        padding: "5px 9px",
        borderRadius: "6px",
        fontSize: "10px",
        fontWeight: "700",
        color: "#f1f5f9",
        border: "1px solid #1e293b",
    },

    footer: {
        textAlign: "center",
        padding: "40px 0",
        fontSize: "12px",
        color: "#64748b",
        borderTop: "1px solid #1e293b",
        marginTop: "60px",
    },
};
