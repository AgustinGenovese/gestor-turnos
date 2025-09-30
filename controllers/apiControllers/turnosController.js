import Turno from "../../models/turno.js";
import TipoTurno from "../../models/tipoTurno.js";
import Cliente from "../../models/cliente.js";

export const crearTurno = async (req, res) => {
  try {
    const { cliente, peluquero, tipoTurno, fechaHora } = req.body;

    // Verificar si ya existe cliente por email
    let clienteDoc = await Cliente.findOne({ email: cliente.email });

    if (!clienteDoc) {
      clienteDoc = new Cliente({
        nombre: cliente.nombre,
        email: cliente.email,
      });
      await clienteDoc.save();
    }

    // Validar disponibilidad
    const turnoExistente = await Turno.findOne({ peluquero, fechaHora, estado: "pendiente" });
    if (turnoExistente) return res.status(400).json({ msg: "Horario ocupado" });

    // Calcular precio
    const tipo = await TipoTurno.findById(tipoTurno);
    let precioTotal = tipo.precioBase;

    // Crear turno
    const turno = new Turno({
      cliente: clienteDoc._id,
      peluquero,
      tipoTurno,
      fechaHora,
      precioTotal,
    });
    await turno.save();

    // 🔥 Actualizar referencia en cliente
    clienteDoc.turnos.push(turno._id);
    await clienteDoc.save();

    res.status(201).json(turno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear turno" });
  }
};


// Obtener turnos
export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find().populate("cliente peluquero tipoTurno productosVendidos");
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

// Actualizar turno (por ejemplo, cambiar estado o agregar productos)
export const actualizarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!turno) return res.status(404).json({ error: "Turno no encontrado" });
    res.json(turno);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar turno" });
  }
};

// Eliminar turno
export const eliminarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByIdAndDelete(req.params.id);
    if (!turno) return res.status(404).json({ error: "Turno no encontrado" });
    res.json({ msg: "Turno eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar turno" });
  }
};
