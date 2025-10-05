import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import PanelAdmin from "../pages/PanelAdmin.jsx";
import CalendarioPage from "../pages/CalendarioPage.jsx";
import { checkSesion } from "../services/authService.js";

export default function AppRouter() {
  const [autenticado, setAutenticado] = useState(null); // null = cargando

  useEffect(() => {
    // Verificar sesión al montar el router
    checkSesion().then(data => setAutenticado(data.autenticado));
  }, []);

  if (autenticado === null) return <div>Cargando...</div>; // spinner opcional

  return (
    <BrowserRouter>
      <Routes>
        {/* Calendar público */}
        <Route path="/calendar" element={<CalendarioPage />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            !autenticado ? (
              <Login setAutenticado={setAutenticado} />
            ) : (
              <Navigate to="/panelAdmin" />
            )
          }
        />

        {/* Panel protegido */}
        <Route
          path="/panelAdmin"
          element={
            autenticado ? <PanelAdmin /> : <Navigate to="/login" />
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/calendar" />} />
      </Routes>
    </BrowserRouter>
  );
}
