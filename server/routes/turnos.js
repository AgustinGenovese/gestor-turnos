import express from "express";
import { crearTurno, obtenerTurnos, obtenerHorariosDisponibles
} from "../controllers/turnosController.js";

const router = express.Router();

router.post("/", crearTurno);
router.get("/", obtenerTurnos);
router.get("/horarios", obtenerHorariosDisponibles);

export default router;
