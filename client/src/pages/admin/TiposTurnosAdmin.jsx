import { useEffect, useState } from "react";
import { Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "../../components/UI/Button.jsx";
import { API_URL } from "../../api/fetch.js"; // <-- importamos la URL del backend

export default function TiposTurnosAdmin() {
  const [tipos, setTipos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", duracion: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({ nombre: "", duracion: "" });

  useEffect(() => {
    obtenerTipos();
  }, []);

  const obtenerTipos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tiposTurno`, { credentials: "include" });
      const data = await res.json();
      setTipos(data);
    } catch (error) {
      console.error("Error al obtener tipos:", error);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/tiposTurno`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });
      const data = await res.json();
      setTipos([...tipos, data]);
      setNuevo({ nombre: "", duracion: "" });
    } catch {
      alert("Error al crear tipo de turno");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este tipo de turno?")) return;
    try {
      await fetch(`${API_URL}/api/tiposTurno/${id}`, { method: "DELETE", credentials: "include" });
      setTipos(tipos.filter((t) => t._id !== id));
    } catch {
      alert("Error al eliminar tipo de turno");
    }
  };

  const handleGuardar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tiposTurno/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      setTipos(tipos.map((t) => (t._id === id ? data : t)));
      setEditandoId(null);
    } catch {
      alert("Error al editar tipo de turno");
    }
  };

  const iniciarEdicion = (tipo) => {
    setEditandoId(tipo._id);
    setEditData({ nombre: tipo.nombre, duracion: tipo.duracion });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditData({ nombre: "", duracion: "" });
  };

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Tipos de Turnos</h1>

      {/* Crear nuevo tipo */}
      <form onSubmit={handleCrear} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          className="border border-gray-300 p-2 rounded w-full"
          required

        />
        <input
          type="number"
          placeholder="Duración (min)"
          value={nuevo.duracion}
          onChange={(e) => setNuevo({ ...nuevo, duracion: Number(e.target.value) })}
          className="border border-gray-300 p-2 rounded w-full sm:w-32"
          step="5"
          min="0"
          required
        />

        <Button>
          Agregar
        </Button>
      </form>

      {/* Tabla de tipos de turno */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Duración (min)</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody >
            {tipos.map((tipo) => (
              <tr key={tipo._id} className="border-b hover:bg-gray-50">
                {editandoId === tipo._id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editData.nombre}
                        onChange={(e) =>
                          setEditData({ ...editData, nombre: e.target.value })
                        }
                        className="border p-2 rounded w-full"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editData.duracion}
                        onChange={(e) =>
                          setEditData({ ...editData, duracion: Number(e.target.value) })
                        }
                        className="border p-2 rounded w-full"
                        step="5"
                        min="0"
                        required
                      />
                    </td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleGuardar(tipo._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{tipo.nombre}</td>
                    <td className="px-4 py-2">{tipo.duracion}</td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => iniciarEdicion(tipo)}
                        className="text-blue-700 hover:text-blue-500"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminar(tipo._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {tipos.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-gray-500 py-4 italic"
                >
                  No hay tipos de turnos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
