import express from "express";
import {
  obtenerClientes,
  crearCliente,
  obtenerCliente,
} from "../controllers/clientesController.js";

const router = express.Router();

router.get("/", obtenerClientes);
router.post("/", crearCliente);
router.get("/:id", obtenerCliente);

export default router;
