import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../../components/UI/Button.jsx";
import { API_URL } from "../../api/fetch.js";

export default function CobrosAdminPage() {
  const [cobros, setCobros] = useState([]);
  const [tiposTurno, setTiposTurno] = useState([]);

  const [nuevo, setNuevo] = useState({
    metodoPago: "",
    tipoTurnoId: "",
    monto: "",
    observaciones: "",
  });

  const [filtroFecha, setFiltroFecha] = useState("");
  const [loading, setLoading] = useState(false);

  const [totalDelDia, setTotalDelDia] = useState(0);
  const [totalSinGasto, setTotalSinGasto] = useState(0);

  useEffect(() => {
    obtenerCobros();
    obtenerTiposTurno();
  }, []);

  // Recalcular totales
  useEffect(() => {
    const total = cobros.reduce((sum, c) => sum + Number(c.monto), 0);
    setTotalDelDia(total);

    const totalSG = cobros.reduce((sum, c) => {
      const monto = Number(c.monto);
      if (c.metodoPago === "efectivo") {
        return sum + monto;
      } else {
        return sum + monto * 0.85;
      }
    }, 0);

    setTotalSinGasto(totalSG);
  }, [cobros]);

  // Obtener todos los cobros
  const obtenerCobros = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cobros`, { credentials: "include" });
      const data = await res.json();
      setCobros(data);
    } catch (error) {
      console.error("Error al obtener cobros:", error);
    }
  };

  // Obtener tipos de turno
  const obtenerTiposTurno = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tiposTurno`);
      const data = await res.json();
      setTiposTurno(data);
    } catch (error) {
      console.error("Error al obtener tipos de turno:", error);
    }
  };

  // Crear cobro
  const handleCrear = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/cobros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });

      const data = await res.json();
      setCobros([data.cobro, ...cobros]);

      setNuevo({
        metodoPago: "",
        tipoTurnoId: "",
        monto: "",
        observaciones: "",
      });
    } catch {
      alert("Error al crear cobro");
    }
  };

  // Filtrar por fecha
  const filtrarPorFecha = async () => {
    if (!filtroFecha) return obtenerCobros();

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/cobros/fecha?dia=${filtroFecha}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setCobros(data);
    } catch {
      alert("Error al filtrar por fecha");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cobro
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cobro?")) return;

    try {
      await fetch(`${API_URL}/api/cobros/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      setCobros(cobros.filter((c) => c._id !== id));
    } catch {
      alert("Error al eliminar el cobro");
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Cobros</h1>

      {/* Crear nuevo cobro */}
      <form
        onSubmit={handleCrear}
        className="flex flex-col gap-3 mb-6"
      >
        {/* Primera línea: método, tipo de turno, monto */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Método */}
          <select
            value={nuevo.metodoPago}
            onChange={(e) => {
              const metodo = e.target.value;
              let monto = nuevo.monto;

              if (nuevo.tipoTurnoId) {
                const seleccionado = tiposTurno.find(t => t._id === nuevo.tipoTurnoId);
                if (seleccionado) {
                  monto = metodo === "efectivo" ? seleccionado.precio * 0.85 : seleccionado.precio;
                }
              }

              setNuevo({ ...nuevo, metodoPago: metodo, monto });
            }}
            className="border border-gray-300 p-2 rounded w-full sm:w-40"
            required
          >
            <option value="">Método</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="debito">Débito</option>
          </select>

          {/* Tipo de turno */}
          <select
            value={nuevo.tipoTurnoId}
            onChange={(e) => {
              const id = e.target.value;
              const seleccionado = tiposTurno.find(t => t._id === id);

              if (seleccionado) {
                const monto = nuevo.metodoPago === "efectivo" ? seleccionado.precio * 0.85 : seleccionado.precio;

                setNuevo({
                  ...nuevo,
                  tipoTurnoId: id,
                  monto
                });
              } else {
                setNuevo({ ...nuevo, tipoTurnoId: id, monto: 0 });
              }
            }}
            className="border border-gray-300 p-2 rounded w-full sm:w-52"
            required
          >
            <option value="">Tipo de turno</option>
            {tiposTurno.map(t => (
              <option key={t._id} value={t._id}>
                {t.nombre} — ${t.precio}
              </option>
            ))}
          </select>

          {/* Monto automático */}
          <input
            type="number"
            placeholder="Monto ($)"
            value={nuevo.monto}
            readOnly
            className="border border-gray-300 p-2 rounded w-full sm:w-32 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Segunda línea: observaciones + botón */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Observaciones"
            value={nuevo.observaciones}
            onChange={(e) =>
              setNuevo({ ...nuevo, observaciones: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-full"
          />

          <Button className="sm:w-40">Cobrar</Button>
        </div>
      </form>

      {/* Filtro por fecha */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-48"
        />

        <Button onClick={filtrarPorFecha}>Filtrar</Button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Método</th>
              <th className="px-4 py-2 text-left">Monto</th>
              <th className="px-4 py-2 text-left">Observaciones</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : cobros.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500 italic">
                  No hay cobros registrados.
                </td>
              </tr>
            ) : (
              cobros.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {new Date(c.fecha).toLocaleString("es-AR")}
                  </td>
                  <td className="px-4 py-2 capitalize">{c.metodoPago}</td>
                  <td className="px-4 py-2">${c.monto}</td>
                  <td className="px-4 py-2">{c.observaciones || "-"}</td>

                  <td className="px-4 py-2 flex justify-center">
                    <button
                      onClick={() => handleEliminar(c._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <br />

      {/* TOTAL SIN GASTO BANCARIO */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700">
          Total neto:{" "}
          <span className="text-blue-600">
            ${totalSinGasto.toFixed(2)}
          </span>
        </h2>
      </div>

      {/* TOTAL DEL DÍA */}
      <div className="mb-4 p-4 bg-white rounded-xl shadow border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700">
          Total del día:{" "}
          <span className="text-green-600">${totalDelDia}</span>
        </h2>
      </div>

      
    </div>
  );
}
