import { useState, useEffect } from "react";
import { InputField } from "../UI/InputField.jsx";
import { SelectField } from "../UI/SelectField.jsx";
import { Button } from "../UI/Button.jsx";
import { API_URL } from "../../api/fetch.js"; // <-- importar la URL del backend

export function FormTurno({ onCrearTurno }) {
  const [datosCliente, setDatosCliente] = useState({ nombre: "", email: "", telefono: "", tipoTurno: "" });
  const [tiposTurno, setTiposTurno] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [franjasDisponibles, setFranjasDisponibles] = useState([]);
  const [franjaSeleccionada, setFranjaSeleccionada] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");

  // 🔹 Validaciones
  const validarNombre = (nombre) => /^[\p{L}\s]{1,50}$/u.test(nombre.trim());
  const validarEmail = (email) => {
    const trimmed = email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed) && trimmed.length <= 150;
  };
  const validarTelefono = (telefono) => {
    const t = telefono.trim();
    const regex = /^\+?[0-9 ]+$/;
    const soloDigitos = t.replace(/\s/g, '');
    return regex.test(t) && soloDigitos.length >= 8 && soloDigitos.length <= 15;
  };

  // 🔹 Cargar tipos de turno
  useEffect(() => {
    const fetchTiposTurno = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tiposTurno`, { credentials: "include" });
        if (!res.ok) throw new Error("Error al obtener tipos de turno");
        const data = await res.json();
        setTiposTurno(data);
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

  // 🔹 Traer franjas disponibles cuando cambian fecha o tipo de turno
  useEffect(() => {
    if (!fechaSeleccionada || !datosCliente.tipoTurno) return;

    const fetchFranjas = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/turnos/franjas?fecha=${fechaSeleccionada}&tipoTurno=${datosCliente.tipoTurno}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Error al obtener franjas");
        const data = await res.json();
        setFranjasDisponibles(data.franjas || []);
        setFranjaSeleccionada("");
        setHorariosDisponibles([]);
        setHorarioSeleccionado("");
      } catch (err) {
        console.error(err);
        setFranjasDisponibles([]);
      }
    };

    fetchFranjas();
  }, [fechaSeleccionada, datosCliente.tipoTurno]);

  // 🔹 Traer horarios cuando cambia la franja seleccionada
  useEffect(() => {
    if (!franjaSeleccionada) return;

    const fetchHorarios = async () => {
      try {
        const esUltimaFranja =
          franjasDisponibles.length > 0 &&
          franjasDisponibles[franjasDisponibles.length - 1].inicio === franjaSeleccionada.split("-")[0];

        const url = `${API_URL}/api/turnos/horarios?fecha=${fechaSeleccionada}&franja=${franjaSeleccionada}&tipoTurno=${datosCliente.tipoTurno}&ultima=${esUltimaFranja}`;

        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Error al obtener horarios");

        const data = await res.json();
        setHorariosDisponibles(data.horarios || []);
        setHorarioSeleccionado(data.horarios?.[0] || "");
      } catch (err) {
        console.error(err);
        setHorariosDisponibles([]);
        setHorarioSeleccionado("");
      }
    };

    fetchHorarios();
  }, [franjaSeleccionada, fechaSeleccionada, datosCliente.tipoTurno, franjasDisponibles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
     // 🔹 Validaciones
    if (!datosCliente.nombre || !datosCliente.email || !datosCliente.telefono || !datosCliente.tipoTurno) {
      return alert("Completa todos los campos");
    }
    if (!validarNombre(datosCliente.nombre)) return alert("Nombre inválido (máximo 50 caracteres, solo letras y espacios)");
    if (!validarEmail(datosCliente.email)) return alert("Email inválido");
    if (!validarTelefono(datosCliente.telefono)) return alert("Teléfono inválido (mínimo 8, máximo 15 dígitos, permite + y espacios)");
    if (!fechaSeleccionada || !franjaSeleccionada || !horarioSeleccionado) {
      return alert("Selecciona fecha, franja y horario");
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

    // Reset del formulario
    setFechaSeleccionada("");
    setFranjasDisponibles([]);
    setFranjaSeleccionada("");
    setHorariosDisponibles([]);
    setHorarioSeleccionado("");
    setDatosCliente({ nombre: "", email: "", telefono: "", tipoTurno: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-md">
      <InputField
        type="text"
        name="nombre"
        placeholder="Nombre completo"
        value={datosCliente.nombre}
        onChange={handleChange}
        required
      />
      <InputField
        type="email"
        name="email"
        placeholder="Email"
        value={datosCliente.email}
        onChange={handleChange}
        required
      />

      <InputField
        type="tel"
        name="telefono"
        placeholder="Teléfono"
        value={datosCliente.telefono}
        onChange={handleChange}
        required
      />
      <SelectField
        name="tipoTurno"
        options={tiposTurno.map(t => ({ value: t._id, label: t.nombre }))}
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
      {fechaSeleccionada && franjasDisponibles.length > 0 ? (
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Franja horaria
          </label>
          <select
            name="franja"
            value={franjaSeleccionada}
            onChange={(e) => setFranjaSeleccionada(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Seleccionar franja</option>
            {franjasDisponibles.map(f => (
              <option key={f.inicio} value={`${f.inicio}-${f.fin}`}>
                {f.inicio} - {f.fin}
              </option>
            ))}
          </select>
        </div>
      ) : fechaSeleccionada ? (
        <p className="text-red-600">No hay franjas disponibles para esta fecha</p>
      ) : null}

      {franjaSeleccionada && horariosDisponibles.length > 0 ? (
        <select
          name="horario"
          value={horarioSeleccionado}
          onChange={(e) => setHorarioSeleccionado(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {horariosDisponibles.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      ) : franjaSeleccionada ? (
        <p className="text-red-600">No hay horarios disponibles para esta franja</p>
      ) : null}

      <div className="md:col-span-2 flex justify-end">
        <Button type="submit">Confirmar Turno</Button>
      </div>
    </form>
  );
}
