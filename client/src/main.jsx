import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext.jsx"; // 👈 importá el contexto

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>     {/* 👈 envolvés toda la app */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
