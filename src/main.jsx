/**
 * Main entry point for the Fractalite application.
 * This file initializes the React application and sets up the routing.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";

// Initialize the React application
const root = createRoot(document.getElementById("root"));

// Render the application with strict mode and routing
root.render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
