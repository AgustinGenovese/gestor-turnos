import express from "express";
import {
  obtenerTiposTurno,
  crearTipoTurno,
  actualizarTipoTurno,
  eliminarTipoTurno,
} from "../controllers/tiposTurnoController.js";

const router = express.Router();

// Obtener todos los tipos
router.get("/", obtenerTiposTurno);

// Crear uno nuevo
router.post("/", crearTipoTurno);

// Actualizar (editar) uno existente
router.put("/:id", actualizarTipoTurno);

// Eliminar uno existente
router.delete("/:id", eliminarTipoTurno);

export default router;
