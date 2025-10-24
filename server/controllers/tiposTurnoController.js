import TipoTurno from "../models/tipoTurno.js";

export const crearTipoTurno = async (req, res) => {
  try {
    const nuevo = new TipoTurno(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tipo de turno" });
  }
};

export const obtenerTiposTurno = async (req, res) => {
  try {
    const tipos = await TipoTurno.find(); // trae todos los documentos
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tipos de turno" });
  }
};

// ✅ Actualizar un tipo de turno
export const actualizarTipoTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await TipoTurno.findByIdAndUpdate(id, req.body, { new: true });
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
