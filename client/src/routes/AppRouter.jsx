import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import TurnosPage from "../pages/TurnosPage.jsx";
import CancelarTurnoPage from "../pages/CancelarTurnoPage";
import Login from "../pages/Login.jsx";

import CalendarAdmin from "../pages/admin/CalendarAdmin.jsx";
import ClientesAdmin from "../pages/admin/ClientesAdmin.jsx"
import TiposTurnosAdmin from "../pages/admin/TiposTurnosAdmin.jsx"
import CobrosAdmin from "../pages/admin/CobrosAdmin.jsx";

import { AppLayout } from "../components/AppLayout.jsx";

export default function AppRouter() {
  const { autenticado } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/turnos" element={<TurnosPage />} />
        <Route path="/cancelar/:id" element={<CancelarTurnoPage />} />
        <Route
          path="/login"
          element={!autenticado ? <Login /> : <Navigate to="/CalendarAdmin" />}
        />


        {/* Rutas privadas dentro del layout */}
        <Route
          element={autenticado ? <AppLayout /> : <Navigate to="/login" />}
        >
          <Route path="/CalendarAdmin" element={<CalendarAdmin />} />
          <Route path="/ClientesAdmin" element={<ClientesAdmin />} />
          <Route path="/TiposTurnosAdmin" element={<TiposTurnosAdmin />} />
          <Route path="/CobrosAdmin" element={<CobrosAdmin />} /> 
          {/* Podés agregar más páginas protegidas aquí */}
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/turnos" />} />
      </Routes>
    </BrowserRouter>
  );
}
