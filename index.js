import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url"; // Necesario para usar __dirname en ES Modules
import dotenv from "dotenv";

import { conectarDB } from "./config/db.js";

import turnosRoutes from "./routes/api/turnos.js";
import clientesRoutes from "./routes/api/clientes.js";
import peluquerosRoutes from "./routes/api/peluqueros.js";
import tipoTurnoRoutes from "./routes/api/tiposTurno.js";
import productosRoutes from "./routes/api/productos.js";
import usuariosRoutes from "./routes/api/usuarios.js";

import pagesRoutes from "./routes/pages.js";

dotenv.config();

// Necesario para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

app.use("/api/turnos", turnosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/peluqueros", peluquerosRoutes);
app.use("/api/tiposTurno", tipoTurnoRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/usuarios", usuariosRoutes);

app.use("/", pagesRoutes);

app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
