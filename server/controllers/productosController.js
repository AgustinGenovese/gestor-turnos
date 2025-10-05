import Producto from "../models/producto.js";

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const nuevo = new Producto(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// Obtener producto por ID
export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: "No encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!producto) return res.status(404).json({ error: "No encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: "No encontrado" });
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
};
