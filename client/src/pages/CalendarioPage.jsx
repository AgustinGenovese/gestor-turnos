import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function CalendarioPage() {
  const [turnos, setTurnos] = useState([]);
  const [tiposTurno, setTiposTurno] = useState([]);

  // Traer turnos y tipos de turno del backend
  useEffect(() => {
    fetch("/api/turnos")
      .then(res => res.json())
      .then(data => setTurnos(data));

    fetch("/api/tiposTurno")
      .then(res => res.json())
      .then(data => setTiposTurno(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      cliente: {
        nombre: formData.get("nombre"),
        email: formData.get("email")
      },
      tipoTurno: formData.get("tipoTurno"),
      fechaHora: formData.get("fechaHora")
    };

    const res = await fetch("/api/turnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      const nuevoTurno = await res.json();
      setTurnos([...turnos, nuevoTurno]);
      e.target.reset();
      alert("Turno creado correctamente");
    } else {
      alert("Error al crear turno");
    }
  };

  // Mapear turnos a eventos de FullCalendar
  const eventos = turnos.map(turno => ({
    title: `${turno.cliente.nombre} - ${turno.tipoTurno.nombre}`,
    start: turno.fechaHora,
    backgroundColor: turno.estado === "cobrado"
      ? "green"
      : turno.estado === "pendiente"
        ? "blue"
        : "red"
  }));

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Calendario de Turnos</h1>

      <form id="formTurno" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 shadow-md">
        <input type="text" name="nombre" placeholder="Nombre del cliente" className="border p-2 rounded" required />
        <input type="email" name="email" placeholder="Email del cliente" className="border p-2 rounded" required />
        <select name="tipoTurno" className="border p-2 rounded" required>
          {tiposTurno.map(tipo => (
            <option key={tipo._id} value={tipo._id}>
              {tipo.nombre} ({tipo.duracion} min - ${tipo.precioBase})
            </option>
          ))}
        </select>
        <input type="datetime-local" name="fechaHora" className="border p-2 rounded" required />
        <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded">Crear Turno</button>
      </form>

      <div className="mt-6 bg-white p-4 rounded-2xl shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={eventos}
        />
      </div>
    </div>
  );
}
