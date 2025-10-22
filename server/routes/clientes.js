import express from "express";
import {
  obtenerClientes,
  crearCliente,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente
} from "../controllers/clientesController.js";

const router = express.Router();

router.get("/", obtenerClientes);
router.post("/", crearCliente);
router.get("/:id", obtenerCliente);
router.put("/:id", actualizarCliente); // PUT para actualizar
router.delete("/:id", eliminarCliente); // DELETE para eliminar

export default router;
