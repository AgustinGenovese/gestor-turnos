import express from "express";
import { crearPeluquero, obtenerPeluquero, actualizarPeluquero, eliminarPeluquero } from "../../controllers/apiControllers/peluquerosController.js";

const router = express.Router();

router.post("/", crearPeluquero);
router.get("/:id", obtenerPeluquero);
router.put("/:id", actualizarPeluquero);
router.delete("/:id", eliminarPeluquero);

export default router;
