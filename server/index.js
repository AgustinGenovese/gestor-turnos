import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { conectarDB } from "./config/db.js";

import turnosRoutes from "./routes/turnos.js";
import clientesRoutes from "./routes/clientes.js";
import peluquerosRoutes from "./routes/peluqueros.js";
import tipoTurnoRoutes from "./routes/tiposTurno.js";
import productosRoutes from "./routes/productos.js";
import usuariosRoutes from "./routes/usuarios.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});