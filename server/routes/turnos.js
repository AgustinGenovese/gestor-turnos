import express from "express";
import { crearTurno, obtenerTurnos, actualizarTurno, eliminarTurno } from "../controllers/turnosController.js";

const router = express.Router();

router.post("/", crearTurno);
router.get("/", obtenerTurnos);
router.put("/:id", actualizarTurno);
router.delete("/:id", eliminarTurno);

export default router;