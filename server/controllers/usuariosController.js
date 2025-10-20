import Usuario from "../models/usuario.js";

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: "El email ya está registrado" });

    // Aquí pasamos password en texto plano, el hash lo hará el pre 'save' en el modelo
    const nuevoUsuario = new Usuario({ nombre, email, password, rol });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};