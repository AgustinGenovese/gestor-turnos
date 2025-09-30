import express from "express";
import {
  obtenerClientes,
  crearCliente,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente
} from "../../controllers/apiControllers/clientesController.js";

const router = express.Router();

router.get("/", obtenerClientes);
router.post("/", crearCliente);
router.get("/:id", obtenerCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);

export default router;
