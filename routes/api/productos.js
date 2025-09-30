import express from "express";
import { crearProducto, obtenerProducto, actualizarProducto, eliminarProducto } from "../../controllers/apiControllers/productosController.js";

const router = express.Router();

router.post("/", crearProducto);
router.get("/:id", obtenerProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;
