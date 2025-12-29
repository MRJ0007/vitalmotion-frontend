import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import DoctorLogin from "./pages/DoctorLogin";
import UserDashboard from "./pages/UserDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import RequireRole from "./auth/RequireRole";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* About Page */}
                <Route path="/about" element={<About />} />

                {/* Auth Routes */}
                <Route path="/doctor/login" element={<DoctorLogin />} />
                <Route path="/user/auth" element={<AuthPage />} />

                {/* Protected Dashboards */}
                <Route path="/user/dashboard" element={<RequireRole role="user"><UserDashboard /></RequireRole>} />
                <Route path="/doctor/dashboard" element={<RequireRole role="doctor"><DoctorDashboard /></RequireRole>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;