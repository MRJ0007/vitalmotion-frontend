import { useEffect, useState, useRef } from "react";
import { api } from "../api";

export default function ChatBox({ deviceId, role }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const scrollRef = useRef(null); // To auto-scroll to latest message

    /* ---------------- Auto Scroll ---------------- */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    /* ---------------- Load Messages ---------------- */
    async function loadMessages() {
        try {
            const res = await api.get(`/chat/messages/${deviceId}`);
            setMessages(res.data || []);
        } catch (e) {
            console.error("Chat load failed", e);
        }
    }

    /* ---------------- Send Message ---------------- */
    async function sendMessage() {
        if (!text.trim()) return;

        try {
            await api.post("/chat/send", {
                device_id: deviceId,
                message: text,
                sender: role,
            });

            setText("");
            loadMessages();
        } catch (e) {
            console.error("Chat send failed", e);
        }
    }

    /* ---------------- FIX: Enter Key Handler ---------------- */
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    /* ---------------- Poll + Cleanup ---------------- */
    useEffect(() => {
        loadMessages();
        const poll = setInterval(loadMessages, 3000);

        return () => {
            clearInterval(poll);
            // Optional: api.post(`/chat/clear/${deviceId}`);
        };
    }, [deviceId]);

    return (
        <div style={styles.box}>
            <div style={styles.chatHeader}>
                <h4 style={{ margin: 0 }}>💬 Live Consultation</h4>
                <div style={styles.onlineDot}></div>
            </div>

            <p style={styles.note}>
                {role === "doctor"
                    ? "Secured Physician Uplink"
                    : "Encrypted Patient-Doctor Session"}
            </p>

            <div style={styles.messages} ref={scrollRef}>
                {messages.map((m, i) => {
                    const isMine = m.sender === role;
                    const label = isMine
                        ? "You"
                        : role === "user"
                            ? "Doctor"
                            : "Patient";

                    return (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: isMine ? "flex-end" : "flex-start",
                                marginBottom: 12,
                            }}
                        >
                            <span style={styles.label}>{label}</span>
                            <div
                                style={{
                                    background: isMine
                                        ? role === "doctor" ? "#2563eb" : "#22c55e"
                                        : "#1e293b",
                                    padding: "10px 14px",
                                    borderRadius: isMine ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                                    maxWidth: "85%",
                                    color: "white",
                                    fontSize: "14px",
                                    boxShadow: isMine ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "none"
                                }}
                            >
                                {m.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={styles.row}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown} // Triggered on Enter
                    placeholder="Type a clinical message..."
                    style={styles.input}
                />
                <button onClick={sendMessage} style={styles.sendBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    );
}

/* ---------------- Elite Styles ---------------- */
const styles = {
    box: {
        border: "1px solid #1e293b",
        padding: "16px",
        borderRadius: "20px",
        background: "#0f172a",
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    chatHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px"
    },
    onlineDot: {
        width: "8px",
        height: "8px",
        background: "#22c55e",
        borderRadius: "50%",
        boxShadow: "0 0 8px #22c55e"
    },
    note: {
        fontSize: "11px",
        color: "#64748b",
        marginBottom: "16px",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    messages: {
        flex: 1,
        maxHeight: "350px",
        overflowY: "auto",
        marginBottom: "16px",
        paddingRight: "8px",
    },
    label: {
        fontSize: "10px",
        fontWeight: "bold",
        color: "#94a3b8",
        marginBottom: "4px",
        marginRight: "4px",
        marginLeft: "4px"
    },
    row: {
        display: "flex",
        gap: "8px",
        background: "#020617",
        padding: "8px",
        borderRadius: "14px",
        border: "1px solid #1e293b"
    },
    input: {
        flex: 1,
        padding: "10px",
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "14px",
        outline: "none"
    },
    sendBtn: {
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "10px",
        padding: "0 15px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "0.2s"
    },
};