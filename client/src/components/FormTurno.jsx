import { useState, useEffect } from "react";
import { InputField } from "./InputField.jsx";
import { SelectField } from "./SelectField.jsx";
import { Button } from "./Button.jsx";

export function FormTurno({ onCrearTurno }) {
  const [datosCliente, setDatosCliente] = useState({ nombre: "", email: "", tipoTurno: "" });
  const [tiposTurno, setTiposTurno] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  // Cargar tipos de turno
  useEffect(() => {
    const fetchTiposTurno = async () => {
      try {
        const res = await fetch("/api/tiposTurno");
        if (!res.ok) throw new Error("Error al obtener tipos de turno");
        const data = await res.json();
        const tiposFormateados = data.map(t => ({
          _id: t._id,
          nombre: `${t.nombre} (${t.duracion} min)`,
          duracion: t.duracion || 0
        }));
        setTiposTurno(tiposFormateados);
        if (data.length > 0) {
          setDatosCliente(prev => ({ ...prev, tipoTurno: data[0]._id }));
        }
      } catch (err) {
        console.error(err);
        setTiposTurno([]);
      }
    };
    fetchTiposTurno();
  }, []);

  const handleChange = (e) => {
    setDatosCliente({ ...datosCliente, [e.target.name]: e.target.value });
  };

 // Traer horarios disponibles
useEffect(() => {
  if (!fechaSeleccionada) return;

  const year = Number(fechaSeleccionada.split("-")[0]);
  if (year !== 2025 && year !== 2026) return;

  const fetchHorarios = async () => {
    try {
      const res = await fetch(`/api/turnos/horarios?fecha=${fechaSeleccionada}`);
      if (!res.ok) throw new Error("Error al obtener horarios");

      const data = await res.json();
      const horariosArray = Array.isArray(data) ? data : data.horarios || [];
      const horariosFormateados = horariosArray.map(h => ({ value: h, label: h }));

      setHorariosDisponibles(horariosFormateados);
      // no hace falta setHorarioSeleccionado("") acá
    } catch (err) {
      console.error(err);
      setHorariosDisponibles([]);
    }
  };

  fetchHorarios();
}, [fechaSeleccionada]);


useEffect(() => {
  if (horariosDisponibles.length > 0) {
    setHorarioSeleccionado(horariosDisponibles[0].value);
  } else {
    setHorarioSeleccionado("");
  }
}, [horariosDisponibles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fechaSeleccionada || !horarioSeleccionado || !datosCliente.tipoTurno) {
      console.log(fechaSeleccionada)
      console.log(horarioSeleccionado)
      console.log(datosCliente.tipoTurno)
      return alert("Completa todos los campos");
    }

    // Enviar al backend directamente como string
    const fechaHora = `${fechaSeleccionada}T${horarioSeleccionado}:00`;

    onCrearTurno({
      cliente: { nombre: datosCliente.nombre, email: datosCliente.email },
      tipoTurno: datosCliente.tipoTurno,
      fechaHora
    });

    // Reset del formulario
    setFechaSeleccionada("");
    setHorarioSeleccionado("");
    setHorariosDisponibles([]);
    setDatosCliente({ nombre: "", email: "", tipoTurno: tiposTurno[0]?._id || "" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-md">
      <InputField
        type="text"
        name="nombre"
        placeholder="Nombre del cliente"
        value={datosCliente.nombre}
        onChange={handleChange}
        required
      />
      <InputField
        type="email"
        name="email"
        placeholder="Email del cliente"
        value={datosCliente.email}
        onChange={handleChange}
        required
      />
      <SelectField
        label="Tipo de Turno"
        name="tipoTurno"
        options={tiposTurno}
        value={datosCliente.tipoTurno}
        onChange={handleChange}
        required
      />
      <InputField
        label="Fecha"
        type="date"
        name="fecha"
        value={fechaSeleccionada}
        onChange={(e) => setFechaSeleccionada(e.target.value)}
        required
      />
      {fechaSeleccionada && (
        horariosDisponibles.length > 0 ? (
          <SelectField
            label="Horario"
            name="horario"
            options={horariosDisponibles}
            value={horarioSeleccionado}
            onChange={(e) => setHorarioSeleccionado(e.target.value)}
            required
          />
        ) : (
          <p className="col-span-2 text-red-600">No hay horarios disponibles para esta fecha</p>
        )
      )}
      <Button type="submit" className="col-span-2">Confirmar Turno</Button>
    </form>
  );
}
