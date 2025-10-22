import Cliente from "../models/cliente.js";
import Turno from "../models/turno.js"; 

// Listar todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

// Crear cliente
export const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

// Obtener cliente por ID
export const obtenerCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener cliente" });
  }
};

// Actualizar cliente
export const actualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

// Eliminar cliente y todos sus turnos
export const eliminarCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;

    // 1️⃣ Buscar y eliminar todos los turnos del cliente
    await Turno.deleteMany({ cliente: clienteId });

    // 2️⃣ Eliminar el cliente
    const cliente = await Cliente.findByIdAndDelete(clienteId);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });

    res.json({ message: "Cliente y sus turnos eliminados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};
