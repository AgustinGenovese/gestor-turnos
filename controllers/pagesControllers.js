import Usuario from "../models/usuario.js";
import bcrypt from "bcrypt";

// GET /
export const home = (req, res) => {
  res.send("Servidor de turnos funcionando ✅");
};

// GET /calendario
export const calendario = (req, res) => {
  res.render("calendario");
};

// GET /login -> muestra el formulario
export const mostrarLogin = (req, res) => {
  res.render("login", { error: null });
};

// POST /login -> procesa las credenciales
export const procesarLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario en DB
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }

    // 2. Comparar contraseñas
    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }

    // 3. Guardar datos en sesión
    req.session.autenticado = true;
    req.session.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      rol: usuario.rol
    };

    return res.redirect("/panelAdmin");
  } catch (error) {
    console.error("Error en login:", error);
    res.render("login", { error: "Ocurrió un error, intenta nuevamente" });
  }
};

// GET /panel_carga -> solo entra si está autenticado
export const mostrarPanel = (req, res) => {
  res.render("panelAdmin", { usuario: req.session.usuario });
};

// GET /logout -> destruye la sesión
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.redirect("/panelAdmin");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};

