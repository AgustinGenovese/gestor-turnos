import TipoTurno from "../models/tipoTurno.js";

// ✅ Crear un tipo de turno
export const crearTipoTurno = async (req, res) => {
  try {
    const { nombre, duracion, precio, categoria } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !duracion || precio === undefined || !categoria) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    if (precio < 0) {
      return res.status(400).json({ error: "El precio no puede ser negativo" });
    }

    const nuevo = new TipoTurno({ nombre, duracion, precio, categoria });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tipo de turno" });
  }
};

// ✅ Obtener tipos de turno
export const obtenerTiposTurno = async (req, res) => {
  try {
    const tipos = await TipoTurno.find().sort({
      categoria: -1, // primero categoría (desc)
      nombre: 1      // dentro de cada categoría, orden alfabético asc
    });

    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tipos de turno" });
  }
};



// ✅ Actualizar un tipo de turno
export const actualizarTipoTurno = async (req, res) => {
  try {
    const { id } = req.params;

    // Validación del precio si viene incluido
    if (req.body.precio !== undefined && req.body.precio < 0) {
      return res.status(400).json({ error: "El precio no puede ser negativo" });
    }

    const actualizado = await TipoTurno.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!actualizado) {
      return res.status(404).json({ error: "Tipo de turno no encontrado" });
    }

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar tipo de turno" });
  }
};

// ✅ Eliminar un tipo de turno
export const eliminarTipoTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await TipoTurno.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ error: "Tipo de turno no encontrado" });
    }

    res.json({ mensaje: "Tipo de turno eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tipo de turno" });
  }
};
