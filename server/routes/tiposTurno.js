import express from "express";
import { obtenerTiposTurno, crearTipoTurno } from "../controllers/tiposTurnoController.js";

const router = express.Router();

router.get("/", obtenerTiposTurno);
router.post("/", crearTipoTurno);

export default router;
