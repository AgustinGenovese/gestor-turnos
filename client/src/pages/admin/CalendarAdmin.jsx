import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { FullCalendarWrapper } from "../../components/FullCalendarWrapper.jsx";
import { FormTurno } from "../../components/forms/FormTurno.jsx";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONA_ARG = "America/Argentina/Buenos_Aires";

export default function CalendarAdmin() {
  const { usuario } = useAuth();
  const [turnos, setTurnos] = useState([]);

  // 🔄 Cargar turnos
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await fetch("/api/turnos");
        if (!res.ok) throw new Error("Error al obtener turnos");
        const data = await res.json();

        const turnosConvertidos = data.map(t => ({
          ...t,
          fechaHora: dayjs.utc(t.fechaHora).tz(ZONA_ARG).format("YYYY-MM-DD HH:mm"),
        }));

        setTurnos(turnosConvertidos);
      } catch (error) {
        console.error("Error cargando turnos:", error);
        setTurnos([]);
      }
    };

    fetchTurnos();
  }, []);

  // 🧾 Crear nuevo turno
  const crearTurno = async (datos) => {
    try {
      const res = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return alert(errorData.msg || "Error al crear turno");
      }

      alert("Turno creado correctamente");

      // Refrescar turnos
      const nuevosTurnos = await fetch("/api/turnos").then(r => r.json());
      const turnosConvertidos = nuevosTurnos.map(t => ({
        ...t,
        fechaHora: dayjs.utc(t.fechaHora).tz(ZONA_ARG).format("YYYY-MM-DD HH:mm"),
      }));
      setTurnos(turnosConvertidos);

    } catch (err) {
      console.error(err);
      alert("Error al crear turno");
    }
  };

  if (!usuario) return <p className="p-6">Cargando datos del usuario...</p>;

  return (
    <div className="max-w-6xl mx-auto p-2 bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-4"> Gestion de Turnos</h1>

      {/* Formulario */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Crear nuevo turno</h2>
        <FormTurno onCrearTurno={crearTurno} simple />
      </div>

      {/* Calendario debajo */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Agenda</h2>
        <FullCalendarWrapper turnos={turnos} />
      </div>
    </div>
  );
}
