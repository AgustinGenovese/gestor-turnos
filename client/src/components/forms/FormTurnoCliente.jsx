import { useState, useEffect } from "react";
import { InputField } from "../UI/InputField.jsx";
import { ButtonCliente } from "../UI/ButtonCliente.jsx";
import { SelectorTipoTurno } from "../UI/SelectorTipoTurno.jsx";
import { API_URL } from "../../api/fetch.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

// 🔹 Importar Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function FormTurnoCliente({ onCrearTurno }) {
  const [step, setStep] = useState(1);
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    tipoTurno: "",
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
        const res = await fetch(`${API_URL}/api/tiposTurno`, { credentials: "include" });
        if (!res.ok) throw new Error("Error al obtener tipos de turno");
        const data = await res.json();
        setTiposTurno(data);
      } catch (err) {
        console.error(err);
        setTiposTurno([]);
        toast.error("No se pudieron cargar los tipos de turno");
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
        toast.error("No se pudieron cargar las franjas horarias");
      }
    };
    fetchFranjas();
  }, [fechaSeleccionada, datosCliente.tipoTurno]);

  // 🔹 Fetch de horarios cuando cambia la franja seleccionada
  useEffect(() => {
    if (!franjaSeleccionada) return;

    const fetchHorarios = async () => {
      try {
        const esUltimaFranja =
          franjasDisponibles.length > 0 &&
          franjasDisponibles[franjasDisponibles.length - 1].inicio ===
          franjaSeleccionada.split("-")[0];

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
        toast.error("No se pudieron cargar los horarios disponibles");
      }
    };

    fetchHorarios();
  }, [franjaSeleccionada, fechaSeleccionada, datosCliente.tipoTurno, franjasDisponibles]);

  // 🔹 Validaciones
  const validarNombre = (nombre) => /^[\p{L}\s]{1,50}$/u.test(nombre.trim());
  const validarApellido = (apellido) => /^[\p{L}\s]{1,50}$/u.test(apellido.trim());
  const validarEmail = (email) => {
    const trimmed = email.trim();
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed) &&
      trimmed.length <= 150
    );
  };

  const validarTelefono = (telefono) => {
    const t = telefono.trim();

    const regex = /^\+?[0-9 ]+$/;
    const soloDigitos = t.replace(/\s/g, ''); // quitar espacios para contar

    return regex.test(t) && soloDigitos.length >= 8 && soloDigitos.length <= 15;
  };


  // 🔹 Handlers
  const handleChange = (e) => {
    setDatosCliente({ ...datosCliente, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!datosCliente.nombre || !datosCliente.apellido || !datosCliente.telefono || !datosCliente.email) {
        return toast.error("Completa todos los campos antes de continuar");
      }
      if (!validarNombre(datosCliente.nombre)) return toast.error("Nombre inválido");
      if (!validarApellido(datosCliente.apellido)) return toast.error("Apellido inválido");
      if (!validarEmail(datosCliente.email)) return toast.error("Email inválido");
      if (!validarTelefono(datosCliente.telefono)) return toast.error("Teléfono inválido (mínimo 8 dígitos, solo números)");
    }

    if (step === 2 && !datosCliente.tipoTurno) {
      return toast.error("Selecciona un tipo de turno");
    }

    if (step === 3 && !fechaSeleccionada) {
      return toast.error("Selecciona una fecha antes de continuar");
    }

    setStep(step + 1);
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fechaSeleccionada) return toast.error("Selecciona una fecha");
    if (!franjaSeleccionada) return toast.error("Selecciona una franja horaria");
    if (!horarioSeleccionado) return toast.error("Selecciona un horario");

    const fechaHora = `${fechaSeleccionada}T${horarioSeleccionado}:00`;

    onCrearTurno({
      cliente: {
        nombre: `${datosCliente.nombre} ${datosCliente.apellido}`,
        email: datosCliente.email,
        telefono: datosCliente.telefono,
      },
      tipoTurno: datosCliente.tipoTurno,
      fechaHora,
    });

    toast.success(
      <div className="text-center mx-auto">
        <strong className="block text-lg">Turno creado correctamente</strong>
        <span className="text-sm text-gray-300">
          Verifique su correo electrónico.
        </span>
      </div>,
      {
        autoClose: 5000 // 5000ms = 5 segundos
      });

    // Reset
    setStep(1);
    setDatosCliente({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      tipoTurno: "",
    });
    setFechaSeleccionada("");
    setFranjasDisponibles([]);
    setFranjaSeleccionada("");
    setHorariosDisponibles([]);
    setHorarioSeleccionado("");
  };

  return (
    <>
      <form
        className="flex flex-col w-full gap-6 px-0 py-4 rounded-2xl shadow-md"
        style={{ backgroundColor: "#0d0d12ff", color: "black" }}
      >

        {/* Barra de progreso minimalista solo texto */}
        <div className="grid grid-cols-4 gap-4 mb-2 text-center border-b border-gray-700 pb-2">
          {["Datos", "Servicio", "Fecha", "Horario"].map((nombre, index) => {
            const numeroPaso = index + 1;
            const activo = step === numeroPaso;

            return (
              <span
                key={index}
                className={`
          py-2 text-sm font-semibold tracking-wide transition-all
          ${activo ? "text-[#c2a255]" : "text-gray-400"}
        `}
              >
                {nombre}
              </span>
            );
          })}
        </div>

        {/* 🔸 Paso 1: Datos del cliente */}
        {step === 1 && (
          <>
            <div className="flex items-center space-x-2 text-base font-medium text-gray-300 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Reserva tu turno fácilmente</span>
            </div>

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
              required
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
              <div className="flex-1 min-w-[100px] px-3 py-2 text-sm"></div>
              <ButtonCliente onClick={handleNextStep} className="flex-1 min-w-[100px] px-3 py-2 text-sm">Siguiente</ButtonCliente>
            </div>
          </>
        )}

        {/* 🔸 Paso 2: Selección del tipo de turno */}
        {step === 2 && (
          <>
            <div className="md:col-span-2">
              <span className="block text-sm font-medium text-gray-300 mt-1 leading-tight">
                Puede seleccionar hasta dos opciones.
              </span>
              <span className="block text-sm mt-1 font-medium leading-tight text-[#ccac5c]">
                ¡En efectivo y transferencia tiene 10% de descuento!
              </span>
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
            <div className="md:col-span-2 flex justify-between gap-4 mt-4">
              <ButtonCliente onClick={handlePrevStep} className="flex-1 min-w-[100px] px-3 py-2 text-sm">
                Anterior
              </ButtonCliente>
              <ButtonCliente onClick={handleNextStep} className="flex-1 min-w-[100px] px-3 py-2 text-sm">
                Siguiente
              </ButtonCliente>
            </div>
          </>
        )}

        {/* 🔸 Paso 3: Fecha */}
        {step === 3 && (
          <>
            <div className="md:col-span-2 grid grid-cols-1 gap-3">
              <div className="flex justify-center mb-6">
                <div style={{ transform: "scale(1.15)", transformOrigin: "top center" }}>
                  <DatePicker
                    selected={fechaSeleccionada ? new Date(fechaSeleccionada + "T00:00") : null}
                    onChange={(date) => {
                      if (!date) return;
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, "0");
                      const dd = String(date.getDate()).padStart(2, "0");
                      setFechaSeleccionada(`${yyyy}-${mm}-${dd}`);
                    }}
                    inline
                    minDate={new Date()} // Bloquea fechas pasadas
                    filterDate={(date) => {
                      const day = date.getDay();
                      return day !== 0 && day !== 1; // Bloquea domingos (0) y lunes (1)
                    }}
                    locale="es"
                    placeholderText="Selecciona una fecha"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-between gap-4 mt-4">
              <ButtonCliente onClick={handlePrevStep} className="flex-1 min-w-[100px] px-3 py-2 text-sm">
                Anterior
              </ButtonCliente>
              <ButtonCliente onClick={handleNextStep} className="flex-1 min-w-[100px] px-3 py-2 text-sm">
                Siguiente
              </ButtonCliente>
            </div>
          </>
        )}

        {/* 🔸 Paso 4: Franja y horario */}

        {step === 4 && (
          <>
            <div className="md:col-span-2 grid grid-cols-1 gap-3">
              {fechaSeleccionada && franjasDisponibles.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
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
                    {franjasDisponibles.map((f) => (
                      <option key={f.inicio} value={`${f.inicio}-${f.fin}`}>
                        {f.inicio} - {f.fin}
                      </option>
                    ))}
                  </select>
                </div>
              ) : fechaSeleccionada ? (
                <div><p className="text-red-600 mt-2 col-span-2">
                  No hay horarios disponibles para esta fecha
                </p></div>

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
            </div>

            <div className="md:col-span-2 flex justify-between gap-4 mt-4">
              <ButtonCliente onClick={handlePrevStep} className="flex-1 min-w-[100px] px-3 py-2 text-sm">
                Anterior
              </ButtonCliente>
              <ButtonCliente
                type="submit"
                onClick={handleSubmit}
                className="flex-1 min-w-[100px] px-3 py-2 text-sm"
              >
                Confirmar
              </ButtonCliente>
            </div>
          </>
        )}
      </form>

      {/* 🔹 Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

