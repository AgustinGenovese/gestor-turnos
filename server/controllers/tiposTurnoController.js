import TipoTurno from "../models/tipoTurno.js";

// Crear tipo de turno
export const crearTipoTurno = async (req, res) => {
  try {
    const nuevo = new TipoTurno(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tipo de turno" });
  }
};

// Obtener tipo de turno por ID
export const obtenerTipoTurno = async (req, res) => {
  try {
    const tipo = await TipoTurno.findById(req.params.id);
    if (!tipo) return res.status(404).json({ error: "No encontrado" });
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tipo de turno" });
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

// Actualizar tipo de turno
export const actualizarTipoTurno = async (req, res) => {
  try {
    const tipo = await TipoTurno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tipo) return res.status(404).json({ error: "No encontrado" });
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
};

// Eliminar tipo de turno
export const eliminarTipoTurno = async (req, res) => {
  try {
    const tipo = await TipoTurno.findByIdAndDelete(req.params.id);
    if (!tipo) return res.status(404).json({ error: "No encontrado" });
    res.json({ msg: "Tipo de turno eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
};
