import { FormTurno } from "../components/FormTurno.jsx";

export default function TurnosPage() {
  const crearTurno = async (datos) => {
    console.log(datos);
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
    } catch (err) {
      console.error(err);
      alert("Error al crear turno");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex flex-col items-center p-6">

      {/* HEADER */}
      <header className="w-full max-w-5xl bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 text-white py-5 px-6 rounded-2xl shadow-lg mb-10 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Ícono peluquería SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132a2 2 0 10-2.11 3.328l3.197 2.132a2 2 0 002.11-3.328zM12 21l-6-6 6-6 6 6-6 6z" />
          </svg>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-sm">
            tupeluqueria.com
          </h1>
        </div>
        <div className="mt-3 md:mt-0 flex items-center space-x-2 text-base font-medium text-gray-100">
          {/* Icono calendario SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Reserva tu turno fácilmente</span>
        </div>
      </header>

      {/* TÍTULO DEL FORMULARIO */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-700 mb-8">
        Solicitar Turno
      </h2>

      {/* CARD DEL FORM */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-10 border-t-4 border-purple-300">
        <FormTurno onCrearTurno={crearTurno} />
      </div>

      {/* DECORACIÓN INFERIOR */}
      <div className="mt-12 w-full flex justify-center space-x-4 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132a2 2 0 10-2.11 3.328l3.197 2.132a2 2 0 002.11-3.328zM12 21l-6-6 6-6 6 6-6 6z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
}
