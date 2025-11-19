import express from "express";
import { 
  crearCobro,
  obtenerCobros,
  obtenerCobroId,
  obtenerCobroPorFecha,
  eliminarCobro
} from "../controllers/cobrosController.js";

const router = express.Router();

// Crear cobro
router.post("/", crearCobro);

// Obtener todos los cobros
router.get("/", obtenerCobros);

// Obtener cobros por fecha -> /cobros/fecha?dia=2025-11-17
router.get("/fecha", obtenerCobroPorFecha);

// Obtener cobro por ID
router.get("/:id", obtenerCobroId);

// Eliminar cobro
router.delete("/:id", eliminarCobro);

export default router;