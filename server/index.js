import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
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

// --- CORS ---
const allowedOrigins = [
  "http://localhost:5173", // Frontend local
  "https://gestor-turnos-2.onrender.com",
  "https://gestor-turnos-4.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite solicitudes sin 'origin' (como Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true, // 🔑 necesario si usas cookies/sesiones
  })
);

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Configuración de sesiones ---
app.set("trust proxy", 1); // Render usa proxy

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS solo en producción
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

// --- 404 para rutas no encontradas ---
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// --- Inicio del servidor ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
