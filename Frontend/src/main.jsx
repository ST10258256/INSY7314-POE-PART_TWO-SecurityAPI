// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
// Use HashRouter instead of BrowserRouter for static hosts / file:// testing
import { HashRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
