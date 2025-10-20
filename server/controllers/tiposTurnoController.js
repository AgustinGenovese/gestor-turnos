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