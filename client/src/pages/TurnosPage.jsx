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
            Sarkirian Barberia
          </h1>
        </div>
      </header>

      {/* CONTENIDO */}
      <div
        className="
          min-h-screen text-gray-100 flex flex-col items-center 
          p-6
          pt-32       /* mobile: 128px */
          md:pt-36    /* tablet: 144px */
          lg:pt-40    /* desktop: 160px */
        "
        style={{ backgroundColor: "#0d0d12ff" }}
      >

        <FormTurnoCliente onCrearTurno={crearTurno} />

        {/* DECORACIÓN INFERIOR */}
        <div className="mt-12 w-full flex justify-center space-x-4 text-gray-600">
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"
              />
              <circle cx="12" cy="8.5" r="2.5" />
            </svg>
          </a>

          <a
            href="https://www.instagram.com/sarkirianbarberia/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17" cy="7" r="1.2"></circle>
            </svg>
          </a>

        </div>

      </div>
    </>
  );
}
