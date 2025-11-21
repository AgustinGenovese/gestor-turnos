import { useState } from "react";

export function SelectorTipoTurno({ tipos, onSelect, seleccionado }) {
  // 1. Agrupar por categoría
  const grupos = tipos.reduce((acc, tipo) => {
    const cat = tipo.categoria || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tipo);
    return acc;
  }, {});

  const categorias = Object.keys(grupos);

  // 2. Estado: primera categoría abierta, el resto cerradas
  const [abierto, setAbierto] = useState(
    categorias.reduce((acc, cat, i) => {
      acc[cat] = i === 0; // solo la primera categoría abierta
      return acc;
    }, {})
  );

  const toggle = (cat) => {
    setAbierto((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="space-y-6">
      {Object.entries(grupos).map(([categoria, lista]) => (
        <div key={categoria} className="border-b border-gray-800 pb-2">

          {/* HEADER del acordeón */}
          <button
            onClick={() => toggle(categoria)}
            type="button"
            className="w-full flex justify-between items-center py-2"
          >
            <h2 className="text-lg font-semibold text-gray-100">
              {categoria}
            </h2>

            <span
              className={`transition-transform text-white ${
                abierto[categoria] ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>

          {/* CONTENIDO del acordeón */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-hidden transition-all duration-300
              ${abierto[categoria] ? "max-h-[2000px] mt-3" : "max-h-0"}
            `}
          >
            {lista.map((tipo) => {
              const activo = seleccionado?._id === tipo._id;
              return (
                <button
                  key={tipo._id}
                  onClick={() => onSelect(tipo)}
                  type="button"
                  className={`p-3 rounded-lg border text-left shadow-sm transition-all
                    ${
                      activo
                        ? "border-[#c2a255] bg-[#c2a255]/10 shadow-md text-white"
                        : "border-gray-700 hover:border-[#c2a255]/50"
                    }
                  `}
                >
                  <h3 className="font-medium text-gray-200 mb-1">
                    {tipo.nombre}
                  </h3>

                  <div className="flex justify-between text-sm text-gray-400">
                    <span>⏱ {tipo.duracion} min</span>
                    <span>💲 {tipo.precio}</span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      ))}
    </div>
  );
}
