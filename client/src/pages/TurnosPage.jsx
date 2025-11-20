import { FormTurnoCliente } from "../components/forms/FormTurnoCliente";
import { API_URL } from "../api/fetch";

export default function TurnosPage() {
  const crearTurno = async (datos) => {
    try {
      const res = await fetch(`${API_URL}/api/turnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return alert(errorData.msg || "Error al crear turno");
      }
    } catch (err) {
      console.error(err);
      alert("Error al crear turno");
    }
  };

  return (
    <>
      {/* HEADER FIJO */}
      <header
        className="
          fixed top-0 left-0 w-full z-50
          text-white py-5 px-6 flex flex-col md:flex-row items-center justify-between
        "
        style={{ backgroundColor: "#141418" }}
      >
        <div className="flex items-center space-x-3">
          <img
            src="https://res.cloudinary.com/dkarrynlz/image/upload/v1761103854/ChatGPT_Image_21_oct_2025__23_45_37-removebg-preview_kptnpx.png"
            alt="Logo Sarkirian"
            className="w-30 h-20 object-cover rounded-full"
          />
          <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm ml-4">
            Sarkirian Barbershop
          </h1>
        </div>
      </header>

      {/* CONTENIDO */}
      <div
        className="
          min-h-screen text-gray-100 flex flex-col items-center 
          p-6
          pt-48      /* mobile */
          md:pt-40   /* tablet */
          lg:pt-32   /* desktop */
        "
        style={{ backgroundColor: "#0d0d12ff" }}
      >
        <div className="flex items-center space-x-2 text-base font-medium text-gray-300 mb-4">
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

        {/* CARD DEL FORM */}
        <div
          className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-lg p-6 md:p-4 border-t-4"
          style={{ backgroundColor: "#141418" }}
        >
          <FormTurnoCliente onCrearTurno={crearTurno} />
        </div>

        {/* DECORACIÓN INFERIOR */}
        <div className="mt-12 w-full flex justify-center space-x-4 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132a2 2 0 10-2.11 3.328l3.197 2.132a2 2 0 002.11-3.328zM12 21l-6-6 6-6 6 6-6 6z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
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
        </div>
      </div>
    </>
  );
}
