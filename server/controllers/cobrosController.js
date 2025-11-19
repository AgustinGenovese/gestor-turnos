import Cobro from "../models/cobro.js";

// Crear cobro
export const crearCobro = async (req, res) => {
  try {
    const nuevoCobro = new Cobro(req.body);
    await nuevoCobro.save();

    res.status(201).json({
      message: "Cobro creado exitosamente",
      cobro: nuevoCobro,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el cobro", error });
  }
};

// Obtener todos los cobros
export const obtenerCobros = async (req, res) => {
  try {
    const cobros = await Cobro.find().sort({ fecha: -1 });
    res.json(cobros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los cobros", error });
  }
};

// Obtener cobro por ID
export const obtenerCobroId = async (req, res) => {
  try {
    const { id } = req.params;
    const cobro = await Cobro.findById(id);

    if (!cobro) {
      return res.status(404).json({ message: "Cobro no encontrado" });
    }

    res.json(cobro);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cobro", error });
  }
};

// Obtener cobros por fecha -> /cobros/fecha?dia=2025-11-17
export const obtenerCobroPorFecha = async (req, res) => {
  try {
    const { dia } = req.query;

    if (!dia) {
      return res.status(400).json({ message: "Debe enviar ?dia=YYYY-MM-DD" });
    }

    const inicio = new Date(`${dia}T00:00:00.000Z`);
    const fin = new Date(`${dia}T23:59:59.999Z`);

    const cobros = await Cobro.find({
      fecha: { $gte: inicio, $lte: fin },
    }).sort({ fecha: 1 });

    res.json(cobros);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar cobros por fecha", error });
  }
};

// Eliminar cobro
export const eliminarCobro = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Cobro.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ message: "Cobro no encontrado" });
    }

    res.json({ message: "Cobro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cobro", error });
  }
};
