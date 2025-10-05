import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    req.session.usuario = { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol };
    res.json({ message: "Login exitoso", usuario: req.session.usuario });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Sesión cerrada" });
  });
};

export const verificarSesion = (req, res) => {
  if (req.session.usuario) {
    res.json({ autenticado: true, usuario: req.session.usuario });
  } else {
    res.json({ autenticado: false });
  }
};