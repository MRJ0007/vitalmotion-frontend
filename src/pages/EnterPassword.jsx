import { useState } from "react";

export default function EnterPassword({ onSuccess }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = () => {
        const doctor = JSON.parse(localStorage.getItem("pending_doctor"));
        const saved = localStorage.getItem(`vm_pass_${doctor.email}`);

        if (password !== saved) {
            setError("Incorrect password");
            return;
        }

        onSuccess(doctor);
    };

    return (
        <div className="app-container">
            <div className="page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <div className="card" style={{ width: 360 }}>
                    <h2>Enter Password</h2>

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: 10 }}
                    />

                    {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                    <button style={{ marginTop: 12 }} onClick={login}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
