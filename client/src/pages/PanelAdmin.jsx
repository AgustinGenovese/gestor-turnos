import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FullCalendarWrapper } from "../components/FullCalendarWrapper.jsx";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONA_ARG = "America/Argentina/Buenos_Aires";

export default function PanelAdmin() {
  const { usuario, handleLogout } = useAuth();
  const navigate = useNavigate();

  const logoutAndRedirect = async () => {
    await handleLogout();
    navigate("/login");
  };

  const [turnos, setTurnos] = useState([]);

  // 🔄 Cargar turnos al montar el componente y convertir a hora Argentina
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await fetch("/api/turnos");
        if (!res.ok) throw new Error("Error al obtener turnos");

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Datos inválidos");

        // Convertir fechaHora de UTC a hora Argentina
        const turnosConvertidos = data.map(t => ({
          ...t,
          fechaHora: dayjs.utc(t.fechaHora).tz(ZONA_ARG).format("YYYY-MM-DD HH:mm")
        }));

        setTurnos(turnosConvertidos);
      } catch (error) {
        console.error("Error cargando turnos:", error);
        setTurnos([]);
      }
    };

    fetchTurnos();
  }, []);

  if (!usuario) return <p>Cargando datos del usuario...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          💈 Agenda de Turnos
        </h1>
        
        <button
          onClick={logoutAndRedirect}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Contenedor del calendario */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <FullCalendarWrapper turnos={turnos} />
      </div>
    </div>
  );
}
