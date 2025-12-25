import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import Global Styles
import "./index.css";
// These ensure the "Inter" or "Sans-Serif" fonts look broad and clean
import "./styles/theme.css";
import "./styles/layout.css";

import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Failed to find the root element. Ensure index.html has <div id='root'></div>");
}

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>
);