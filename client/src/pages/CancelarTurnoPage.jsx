import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../api/fetch";

export default function CancelarTurnoPage() {
  const { id } = useParams();
  const [turno, setTurno] = useState(null);
  const [mensaje, setMensaje] = useState("Cargando información del turno...");

  useEffect(() => {
    const obtenerTurno = async () => {
      try {
        const res = await fetch(`${API_URL}/api/turnos/${id}`);
        const data = await res.json();

        if (res.ok) {
          setTurno(data);
          setMensaje("¿Seguro que desea cancelar este turno?");
        } else {
          setMensaje(data.msg || "No se pudo obtener la información del turno ❌");
        }
      } catch (error) {
        console.error("Error al obtener turno:", error);
        setMensaje("Error al conectar con el servidor ❌");
      }
    };

    obtenerTurno();
  }, [id]);

  const eliminarTurno = async () => {
    if (!turno) return;

    const confirmar = window.confirm(
      `¿Seguro que desea cancelar el turno de ${turno.tipoTurno} para ${turno.nombre}? 
Horario: ${turno.horario} 
Fecha: ${turno.fecha}`
    );

    if (!confirmar) {
      setMensaje("Cancelación abortada ❎");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/turnos/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          <div className="text-center mx-auto">
            <strong className="block text-lg">Turno cancelado correctamente</strong>
            <span className="text-sm text-gray-300">
              {data.msg || "La cancelación fue exitosa."}
            </span>
          </div>,
          { autoClose: 5000 }
        );
        setMensaje("Turno cancelado correctamente ✅");
      } else {
        toast.error(
          <div className="text-center mx-auto">
            <strong className="block text-lg">Error al cancelar el turno</strong>
            <span className="text-sm text-gray-300">
              {data.msg || "No se pudo eliminar el turno."}
            </span>
          </div>
        );
        setMensaje("No se pudo eliminar el turno ❌");
      }
    } catch (error) {
      console.error("Error al eliminar turno:", error);
      toast.error(
        <div className="text-center mx-auto">
          <strong className="block text-lg">Error de conexión</strong>
          <span className="text-sm text-gray-300">
            No se pudo contactar con el servidor.
          </span>
        </div>
      );
      setMensaje("Error de conexión con el servidor ❌");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center text-white"
      style={{ backgroundColor: "#0d0d12ff" }}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md"
        style={{ backgroundColor: "#141418" }}
      >
        <h1 className="text-2xl font-bold mb-4">Cancelar turno</h1>

        {turno ? (
          <>
            <p className="text-lg mb-4">
              {mensaje}
              <br />
              <span className="text-sm text-gray-400 block mt-2">
                <strong>{turno.tipoTurno}</strong> - {turno.nombre}
                <br />
                {turno.fecha} a las {turno.horario}
              </span>
            </p>

            <button
              onClick={eliminarTurno}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Cancelar turno
            </button>
          </>
        ) : (
          <p className="text-lg">{mensaje}</p>
        )}
      </div>

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
    </div>
  );
}
