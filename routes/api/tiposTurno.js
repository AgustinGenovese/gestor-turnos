import express from "express";
import { obtenerTiposTurno, crearTipoTurno, obtenerTipoTurno, actualizarTipoTurno, eliminarTipoTurno } from "../../controllers/apiControllers/tiposTurnoController.js";

const router = express.Router();

router.get("/", obtenerTiposTurno);
router.post("/", crearTipoTurno);
router.get("/:id", obtenerTipoTurno);
router.put("/:id", actualizarTipoTurno);
router.delete("/:id", eliminarTipoTurno);

export default router;
