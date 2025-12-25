import { useEffect, useState } from "react";
import { api } from "../api";
import LogoutButton from "../components/LogoutButton";

function AdminDashboard() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    async function loadDoctors() {
        try {
            const res = await api.get("/admin/doctors");
            setDoctors(res.data);
        } catch {
            setMsg("Failed to load doctors");
        }
    }

    async function createDoctor(e) {
        e.preventDefault();
        setMsg("");

        if (!email || !password) {
            setMsg("Email and password required");
            return;
        }

        try {
            setLoading(true);
            await api.post("/admin/doctors", { email, password });
            setMsg("Doctor created successfully");
            setEmail("");
            setPassword("");
            loadDoctors();
        } catch (err) {
            setMsg(
                err.response?.data?.detail ||
                "Failed to create doctor"
            );
        } finally {
            setLoading(false);
        }
    }

    async function toggleDoctor(email, active) {
        try {
            await api.patch(
                `/admin/doctors/${email}/status?active=${!active}`
            );
            loadDoctors();
        } catch {
            setMsg("Failed to update doctor status");
        }
    }

    useEffect(() => {
        loadDoctors();
    }, []);

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Admin Dashboard</h2>
                <LogoutButton redirectTo="/" />
            </div>

            {/* CREATE DOCTOR */}
            <form onSubmit={createDoctor} style={{ maxWidth: "360px" }}>
                <h3>Create Doctor</h3>

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@email.com"
                    style={inputStyle}
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    type="password"
                    style={inputStyle}
                />

                <button disabled={loading} style={btnStyle}>
                    {loading ? "Creating..." : "Create Doctor"}
                </button>

                {msg && <p>{msg}</p>}
            </form>

            {/* DOCTOR LIST */}
            <h3 style={{ marginTop: "30px" }}>Doctors</h3>

            <ul>
                {doctors.map((d) => (
                    <li key={d.email} style={listItemStyle}>
            <span>
              {d.email} — {d.active ? "Active" : "Inactive"}
            </span>
                        <button
                            onClick={() => toggleDoctor(d.email, d.active)}
                            style={toggleBtnStyle}
                        >
                            Toggle
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
};

const btnStyle = {
    padding: "10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
};

const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "500px",
    marginBottom: "8px",
};

const toggleBtnStyle = {
    padding: "4px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
};

export default AdminDashboard;
