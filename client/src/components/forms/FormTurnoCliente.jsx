import { useState, useEffect } from "react";
import { InputField } from "../UI/InputField.jsx";
import { ButtonCliente } from "../UI/ButtonCliente.jsx";
import { SelectorTipoTurno } from "../UI/SelectorTipoTurno.jsx";

export function FormTurnoCliente({ onCrearTurno }) {
  const [step, setStep] = useState(1);
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    tipoTurno: ""
  });

  const [tiposTurno, setTiposTurno] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [franjasDisponibles, setFranjasDisponibles] = useState([]);
  const [franjaSeleccionada, setFranjaSeleccionada] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");

  // 🔹 Fetch de tipos de turno
  useEffect(() => {
    const fetchTiposTurno = async () => {
      try {
        const res = await fetch("/api/tiposTurno");
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

  // 🔹 Fetch de franjas cuando cambia la fecha o tipo de turno
  useEffect(() => {
    if (!fechaSeleccionada || !datosCliente.tipoTurno) return;

    const fetchFranjas = async () => {
      try {
        const res = await fetch(
          `/api/turnos/franjas?fecha=${fechaSeleccionada}&tipoTurno=${datosCliente.tipoTurno}`
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

  // 🔹 Fetch de horarios cuando cambia la franja seleccionada
  useEffect(() => {
    if (!franjaSeleccionada) return;

    const fetchHorarios = async () => {
      try {
        const res = await fetch(
          `/api/turnos/horarios?fecha=${fechaSeleccionada}&franja=${franjaSeleccionada}&tipoTurno=${datosCliente.tipoTurno}`
        );
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
  }, [franjaSeleccionada, fechaSeleccionada, datosCliente.tipoTurno]);

  // 🔹 Handlers
  const handleChange = (e) => {
    setDatosCliente({ ...datosCliente, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1 && (!datosCliente.nombre || !datosCliente.apellido || !datosCliente.telefono || !datosCliente.email)) {
      return alert("Completa todos los campos antes de continuar");
    }

    if (step === 2 && !datosCliente.tipoTurno) {
      return alert("Selecciona un tipo de turno");
    }
    setStep(step + 1);
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fechaSeleccionada || !franjaSeleccionada || !horarioSeleccionado) {
      return alert("Selecciona fecha, franja y horario");
    }

    const fechaHora = `${fechaSeleccionada}T${horarioSeleccionado}:00`;

    onCrearTurno({
      cliente: {
        nombre: `${datosCliente.nombre} ${datosCliente.apellido}`,
        email: datosCliente.email,
        telefono: datosCliente.telefono
      },
      tipoTurno: datosCliente.tipoTurno,
      fechaHora
    });

    // Reset
    setStep(1);
    setDatosCliente({ nombre: "", apellido: "", email: "", telefono: "", tipoTurno: "" });
    setFechaSeleccionada("");
    setFranjasDisponibles([]);
    setFranjaSeleccionada("");
    setHorariosDisponibles([]);
    setHorarioSeleccionado("");
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl shadow-md"
      style={{ backgroundColor: "#0d0d12ff", color: "black" }}
    >
      {/* 🔸 Paso 1: Datos del cliente */}
      {step === 1 && (
        <>
          <InputField
            type="text"
            name="nombre"
            placeholder="Nombre/s"
            value={datosCliente.nombre}
            onChange={handleChange}
            required
            className="text-black"
          />
          <InputField
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={datosCliente.apellido}
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
            className="text-black"
          />
          <InputField
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={datosCliente.telefono}
            onChange={handleChange}
            required
            className="text-black"
          />
          <div className="md:col-span-2 flex justify-end">
            <ButtonCliente onClick={handleNextStep}>Siguiente</ButtonCliente>
          </div>
        </>
      )}

      {/* 🔸 Paso 2: Selección del tipo de turno */}
      {step === 2 && (
        <>
          <div className="md:col-span-2 ">
            <label className="block text-lg font-medium text-gray-100">
              Seleccione Tipo de Turno
            </label>
          </div>
          <div className="md:col-span-2">
            <SelectorTipoTurno
              tipos={tiposTurno}
              seleccionado={tiposTurno.find((t) => t._id === datosCliente.tipoTurno)}
              onSelect={(tipo) =>
                setDatosCliente((prev) => ({ ...prev, tipoTurno: tipo._id }))
              }
            />
          </div>
          <div className="md:col-span-2 flex justify-between mt-4">
            <ButtonCliente onClick={handlePrevStep}>Anterior</ButtonCliente>
            <ButtonCliente onClick={handleNextStep}>Siguiente</ButtonCliente>
          </div>
        </>
      )}

      {/* 🔸 Paso 3: Fecha, franja y horario */}
      {step === 3 && (
        <>
          <InputField
            label="Fecha"
            type="date"
            name="fecha"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            required
            className="text-black"
          />

          {fechaSeleccionada && franjasDisponibles.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Franja horaria
              </label>
              <select
                name="franja"
                value={franjaSeleccionada}
                onChange={(e) => setFranjaSeleccionada(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Seleccionar franja</option>
                {franjasDisponibles.map((f) => (
                  <option key={f.inicio} value={`${f.inicio}-${f.fin}`}>
                    {f.inicio} - {f.fin}
                  </option>
                ))}
              </select>
            </div>
          ) : fechaSeleccionada ? (
            <p className="text-red-600 mt-2 col-span-2">
              No hay franjas disponibles para esta fecha
            </p>
          ) : null}

          {franjaSeleccionada && horariosDisponibles.length > 0 ? (
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {horariosDisponibles.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorarioSeleccionado(h)}
                  className={`py-2 px-4 rounded-md text-white ${horarioSeleccionado === h
                    ? "bg-[#c2a255]"
                    : "bg-gray-700 hover:bg-gray-600"
                    }`}
                >
                  {h}
                </button>
              ))}
            </div>
          ) : franjaSeleccionada ? (
            <p className="text-red-600 mt-2 col-span-2">
              No hay horarios disponibles para esta franja
            </p>
          ) : null}

          <div className="md:col-span-2 flex justify-between mt-4">
            <ButtonCliente onClick={handlePrevStep}>Anterior</ButtonCliente>
            <ButtonCliente type="submit" onClick={handleSubmit}>
              Confirmar Turno
            </ButtonCliente>
          </div>
        </>
      )}
    </form>
  );
}
