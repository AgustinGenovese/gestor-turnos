import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Login from "../pages/Login.jsx";
import PanelAdmin from "../pages/PanelAdmin.jsx";
import TurnosPage from "../pages/TurnosPage.jsx";

export default function AppRouter() {
  const { autenticado } = useAuth();

  if (autenticado === null) return <p>Cargando sesión...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/turnos" element={<TurnosPage />} />
        <Route
          path="/login"
          element={!autenticado ? <Login /> : <Navigate to="/panelAdmin" />}
        />
        <Route
          path="/panelAdmin"
          element={autenticado ? <PanelAdmin /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/turnos" />} />
      </Routes>
    </BrowserRouter>
  );
}
