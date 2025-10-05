import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: "El email ya está registrado" });

    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ nombre, email, password: hash, rol });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};


// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario por ID
export const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};