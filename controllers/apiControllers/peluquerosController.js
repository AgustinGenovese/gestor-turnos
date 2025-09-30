import Peluquero from "../../models/peluquero.js";

// Crear peluquero
export const crearPeluquero = async (req, res) => {
  try {
    const nuevo = new Peluquero(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear peluquero" });
  }
};

// Obtener peluquero por ID
export const obtenerPeluquero = async (req, res) => {
  try {
    const peluquero = await Peluquero.findById(req.params.id);
    if (!peluquero) return res.status(404).json({ error: "No encontrado" });
    res.json(peluquero);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener peluquero" });
  }
};

// Actualizar peluquero
export const actualizarPeluquero = async (req, res) => {
  try {
    const peluquero = await Peluquero.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!peluquero) return res.status(404).json({ error: "No encontrado" });
    res.json(peluquero);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
};

// Eliminar peluquero
export const eliminarPeluquero = async (req, res) => {
  try {
    const peluquero = await Peluquero.findByIdAndDelete(req.params.id);
    if (!peluquero) return res.status(404).json({ error: "No encontrado" });
    res.json({ msg: "Peluquero eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
};