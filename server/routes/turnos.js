import express from "express";
import { crearTurno, obtenerTurnos, obtenerHorariosDisponibles, eliminarTurno
} from "../controllers/turnosController.js";

const router = express.Router();

router.post("/", crearTurno);
router.get("/", obtenerTurnos);
router.get("/horarios", obtenerHorariosDisponibles);
router.delete("/:id", eliminarTurno);

export default router;
