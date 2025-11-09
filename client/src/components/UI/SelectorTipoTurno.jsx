export function SelectorTipoTurno({ tipos, onSelect, seleccionado }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {tipos.map((tipo) => {
        const activo = seleccionado?._id === tipo._id;
        return (
          <button
            key={tipo._id}
            onClick={() => onSelect(tipo)}
            type="button"
            className={`p-3 rounded-lg border text-left shadow-sm transition-all
              ${activo
                ? "border-[#c2a255] bg-[#c2a255]/10 shadow-md text-white"
                : "border-gray-700 hover:border-[#c2a255]/50"
              }
            `}
          >
            <h3 className="font-medium text-gray-200 mb-1">{tipo.nombre}</h3>

            <div className="flex justify-between text-sm text-gray-400">
              <span>⏱ {tipo.duracion} min</span>
              <span >💲 {tipo.precio}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
