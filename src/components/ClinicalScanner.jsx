import React, { useState } from 'react';
import axios from 'axios';

export default function ClinicalScanner() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:8000/vision/analyze-live", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setResult(res.data.data);
        } catch (err) {
            console.error("Clinical scan failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.scannerContainer}>
            <div style={styles.uploadArea}>
                {/* Hidden Real Input */}
                <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: 'none' }}
                />

                {/* Broad Custom Styled "Choose File" Button */}
                <label htmlFor="file-upload" style={styles.fileLabel}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginBottom: '8px'}}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span style={{fontWeight: '900', fontSize: '14px'}}>
                        {file ? `SELECTED: ${file.name.toUpperCase()}` : "CHOOSE CLINICAL DOCUMENT"}
                    </span>
                    <span style={{fontSize: '11px', color: '#64748b', marginTop: '4px'}}>
                        JPG, PNG (MAX 4MB)
                    </span>
                </label>

                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    style={loading ? styles.btnDisabled : styles.btnActive}
                >
                    {loading ? "⚡ ANALYZING..." : "START AI ANALYSIS"}
                </button>
            </div>

            {result && (
                <div style={styles.resultView}>
                    <div style={styles.reportHeader}>
                        <span style={styles.reportTitle}>ASSESSMENT REPORT</span>
                        <span style={styles.confScore}>CONFIDENCE: {(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <p style={styles.extractedNote}>{result.extracted_note}</p>
                    <div style={styles.tagGrid}>
                        {result.tags.map(tag => (
                            <span key={tag} style={styles.tag}>#{tag.toUpperCase()}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* --- Elite broad Styles --- */
const styles = {
    scannerContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
    uploadArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '30px',
        background: '#020617',
        border: '2px dashed #1e293b',
        borderRadius: '20px',
        alignItems: 'center',
        textAlign: 'center'
    },
    fileLabel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '20px',
        width: '100%',
        color: '#3b82f6',
        transition: '0.3s'
    },
    btnActive: {
        width: '100%',
        padding: '16px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '14px',
        fontWeight: '900',
        fontSize: '13px',
        letterSpacing: '1px',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
    },
    btnDisabled: {
        width: '100%',
        padding: '16px',
        background: '#1e293b',
        color: '#475569',
        border: 'none',
        borderRadius: '14px',
        fontWeight: '900',
        cursor: 'not-allowed'
    },
    resultView: {
        background: '#0a0d14',
        padding: '24px',
        borderRadius: '20px',
        borderLeft: '5px solid #3b82f6'
    },
    reportHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '12px'
    },
    reportTitle: { fontSize: '12px', fontWeight: '900', color: '#3b82f6', letterSpacing: '2px' },
    confScore: { fontSize: '11px', color: '#22c55e', fontWeight: '900' },
    extractedNote: { fontSize: '15px', lineHeight: '1.8', color: '#cbd5e1', marginBottom: '20px', fontWeight: '500' },
    tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    tag: { fontSize: '10px', padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '6px', fontWeight: '900' }
};