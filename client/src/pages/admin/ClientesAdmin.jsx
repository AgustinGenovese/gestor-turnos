import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react"; // 👈 íconos
import { API_URL } from "../../api/fetch.js"; // <-- importamos la URL del backend

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ nombre: "", email: "", telefono: "" });
  const [editandoId, setEditandoId] = useState(null); // id del cliente que se está editando

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/clientes`, { credentials: "include" }); // <-- aquí
        if (!res.ok) throw new Error("Error al obtener clientes");
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error(err);
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  // Filtrar clientes según los inputs
  const clientesFiltrados = clientes.filter((c) => {
    const nombreMatch = c.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const emailMatch = c.email.toLowerCase().includes(filtros.email.toLowerCase());
    const telefonoMatch = (c.telefono || "")
      .toLowerCase()
      .includes(filtros.telefono.toLowerCase());
    return nombreMatch && emailMatch && telefonoMatch;
  });

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Desea eliminar este cliente y todos sus turnos?")) return;

    try {
      const res = await fetch(`${API_URL}/api/clientes/${id}`, { method: "DELETE", credentials: "include" }); // <-- aquí
      if (!res.ok) throw new Error("Error al eliminar cliente");
      setClientes((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el cliente");
    }
  };

  const handleGuardar = async (cliente) => {
    try {
      const res = await fetch(`${API_URL}/api/clientes/${cliente._id}`, { // <-- aquí
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });
      if (!res.ok) throw new Error("Error al guardar cliente");
      setEditandoId(null);
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el cliente");
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="nombre"
          placeholder="Filtrar por nombre"
          value={filtros.nombre}
          onChange={handleFiltroChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="email"
          placeholder="Filtrar por email"
          value={filtros.email}
          onChange={handleFiltroChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="telefono"
          placeholder="Filtrar por teléfono"
          value={filtros.telefono}
          onChange={handleFiltroChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <p>Cargando clientes...</p>
      ) : clientesFiltrados.length === 0 ? (
        <p>No se encontraron clientes con esos filtros.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Teléfono</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {editandoId === c._id ? (
                      <input
                        type="text"
                        value={c.nombre}
                        onChange={(e) =>
                          setClientes((prev) =>
                            prev.map((cl) =>
                              cl._id === c._id ? { ...cl, nombre: e.target.value } : cl
                            )
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      c.nombre
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editandoId === c._id ? (
                      <input
                        type="text"
                        value={c.email}
                        onChange={(e) =>
                          setClientes((prev) =>
                            prev.map((cl) =>
                              cl._id === c._id ? { ...cl, email: e.target.value } : cl
                            )
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      c.email
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editandoId === c._id ? (
                      <input
                        type="text"
                        value={c.telefono || ""}
                        onChange={(e) =>
                          setClientes((prev) =>
                            prev.map((cl) =>
                              cl._id === c._id ? { ...cl, telefono: e.target.value } : cl
                            )
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      c.telefono || "-"
                    )}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-3">
                    {editandoId === c._id ? (
                      <button
                        onClick={() => handleGuardar(c)}
                        className="text-green-600 hover:text-green-400"
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditandoId(c._id)}
                        className="text-blue-800 hover:text-blue-600"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEliminar(c._id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
