import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ---------- PAGES ---------- */
import AuthPage from "./pages/AuthPage";         // Unified Patient Auth
import DoctorLogin from "./pages/DoctorLogin";   // Exclusive Doctor Portal
import UserOtp from "./pages/UserOtp";
import CreatePassword from "./pages/CreatePassword";
import UserDashboard from "./pages/UserDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import About from "./pages/About";

/* ---------- AUTH GUARD ---------- */
import RequireRole from "./auth/RequireRole";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Landing Redirect */}
                <Route path="/" element={<Navigate to="/user/auth" />} />

                {/* 2. Patient Authentication Flow */}
                <Route path="/user/auth" element={<AuthPage />} />
                <Route path="/user/otp" element={<UserOtp />} />
                <Route path="/user/create-password" element={<CreatePassword />} />

                {/* 3. Physician Exclusive Portal */}
                <Route path="/doctor/login" element={<DoctorLogin />} />

                {/* 4. Shared Information Pages */}
                <Route path="/about" element={<About />} />

                {/* 5. Role-Protected Dashboards */}
                {/* Only users with role: 'user' can enter here */}
                <Route
                    path="/user/dashboard"
                    element={
                        <RequireRole role="user">
                            <UserDashboard />
                        </RequireRole>
                    }
                />

                {/* Only users with role: 'doctor' can enter here */}
                <Route
                    path="/doctor/dashboard"
                    element={
                        <RequireRole role="doctor">
                            <DoctorDashboard />
                        </RequireRole>
                    }
                />

                {/* 6. 404 Fallback */}
                <Route
                    path="*"
                    element={
                        <div style={errorStyle}>
                            <h1>404</h1>
                            <p>Uplink Lost: Path not found in clinical database.</p>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

const errorStyle = {
    color: 'white',
    textAlign: 'center',
    padding: 100,
    background: '#020617',
    minHeight: '100vh',
    fontFamily: 'sans-serif'
};

export default App