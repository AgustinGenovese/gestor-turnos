import express from "express";
import { 
  crearTurno, 
  obtenerTurnos, 
  obtenerTurnoId,
  obtenerFranjasDisponibles,
  obtenerHorariosPorFranja,
  eliminarTurno
} from "../controllers/turnosController.js";

const router = express.Router();

// Crear turno
router.post("/", crearTurno);

// Obtener todos los turnos
router.get("/", obtenerTurnos);

// Obtener franjas disponibles (1 hora)
router.get("/franjas", obtenerFranjasDisponibles);

// Obtener horarios disponibles dentro de una franja
router.get("/horarios", obtenerHorariosPorFranja);

// Eliminar turno
router.delete("/:id", eliminarTurno);

router.get("/:id", obtenerTurnoId);

export default router;
