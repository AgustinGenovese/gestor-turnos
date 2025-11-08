import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { conectarDB } from "./config/db.js";

import turnosRoutes from "./routes/turnos.js";
import clientesRoutes from "./routes/clientes.js";
import tipoTurnoRoutes from "./routes/tiposTurno.js";
import usuariosRoutes from "./routes/usuarios.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// --- Conexión a la base de datos ---
conectarDB();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Configuración de sesiones ---
app.set("trust proxy", 1); // útil si en el futuro usás proxy (Render, Nginx, etc.)

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // cookie solo por HTTPS en producción
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

// --- Rutas API ---
app.use("/api/turnos", turnosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/tiposTurno", tipoTurnoRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);

// --- FRONTEND (React) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientPath = path.resolve(__dirname, "../client/dist");

// 🟩 Servir archivos estáticos
app.use(express.static(clientPath));

// 🟩 Cualquier otra ruta (no API) envía el index.html
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next(); // deja que las rutas de API sigan su curso
  }

  res.sendFile(path.join(clientPath, "index.html"));
});

// --- Inicio del servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
