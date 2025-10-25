import express from "express";
import session from "express-session";
import cors from "cors";
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
conectarDB();

// --- CORS ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://gestor-turnos-4.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman, etc.
    if (allowedOrigins.includes(origin) || origin.startsWith("https://gestor-turnos-")) {
      callback(null, true);
    } else {
      callback(new Error("Origen no permitido por CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Sesiones ---
app.set("trust proxy", 1); // Render usa proxy
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,       // HTTPS obligatorio
    sameSite: "none",   // cross-site cookies permitidas
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  }
}));

// --- Rutas API ---
app.use("/api/turnos", turnosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/tiposTurno", tipoTurnoRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);

// --- Servir React en producción ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dist")));

// --- Fallback SPA ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// --- 404 API fallback (opcional) ---
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
