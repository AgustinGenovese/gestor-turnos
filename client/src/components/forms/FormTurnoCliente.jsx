import { useState, useEffect } from "react";
import { InputField } from "../UI/InputField.jsx";
import { SelectField } from "../UI/SelectField.jsx";

export function FormTurno({ onCrearTurno }) {
  const [datosCliente, setDatosCliente] = useState({ nombre: "", email: "", telefono: "", tipoTurno: "" });
  const [tiposTurno, setTiposTurno] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

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
    if (!fechaSeleccionada || !horarioSeleccionado || !datosCliente.tipoTurno || !datosCliente.telefono) {
      return alert("Completa todos los campos");
    }

    const fechaHora = `${fechaSeleccionada}T${horarioSeleccionado}:00`;

    onCrearTurno({
      cliente: {
        nombre: datosCliente.nombre,
        email: datosCliente.email,
        telefono: datosCliente.telefono
      },
      tipoTurno: datosCliente.tipoTurno,
      fechaHora
    });

    setFechaSeleccionada("");
    setHorarioSeleccionado("");
    setHorariosDisponibles([]);
    setDatosCliente({ nombre: "", email: "", telefono: "", tipoTurno: tiposTurno[0]?._id || "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl shadow-md"
      style={{ backgroundColor: '#0d0d12ff', color: 'black' }} // fondo oscuro, texto negro
    >
      {/* Fila 1 */}
      <InputField
        type="text"
        name="nombre"
        placeholder="Nombre completo"
        value={datosCliente.nombre}
        onChange={handleChange}
        required
        className="text-black"
      />
      <InputField
        type="email"
        name="email"
        placeholder="Email"
        value={datosCliente.email}
        onChange={handleChange}
        required
        className="text-black"
      />

      {/* Fila 2 */}
      <InputField
        type="tel"
        name="telefono"
        placeholder="Teléfono"
        value={datosCliente.telefono}
        onChange={handleChange}
        required
        className="text-black"
      />
      <SelectField
        name="tipoTurno"
        value={datosCliente.tipoTurno}
        onChange={handleChange}
        required
        options={tiposTurno || []} // <- aquí nunca será undefined
        className="text-black"
      />

      {/* Fila 3 */}
      <InputField
        label="Fecha"
        type="date"
        name="fecha"
        value={fechaSeleccionada}
        onChange={(e) => setFechaSeleccionada(e.target.value)}
        required
        className="text-black"
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
            className="text-black"
            style={{ color: 'black' }}
          />
        ) : (
          <p className="text-red-600 mt-8">
            No hay horarios disponibles para esta fecha
          </p>
        )
      )}

      {/* Fila 4: botón nuevo con colores personalizados */}
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="
            bg-[#c2a255] 
            hover:bg-[#ccac5c] 
            active:bg-[#ccac5c] 
            text-white 
            font-medium 
            py-2 
            px-6 
            rounded-md 
            shadow-sm 
            transition-colors
          "
        >
          Confirmar Turno
        </button>
      </div>
    </form>
  );
}

