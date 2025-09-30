import express from "express";
import { home, calendario, mostrarLogin, procesarLogin, mostrarPanel, logout } from "../controllers/pagesControllers.js";
import { protegerRuta, redirigirSiAutenticado } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", home);
router.get("/calendario", calendario);

// Login
router.get("/login", redirigirSiAutenticado, mostrarLogin); // muestra el form
router.post("/login", procesarLogin);                      // procesa credenciales

// Logout
router.get("/logout", logout);

// Panel
router.get("/panelAdmin", protegerRuta, mostrarPanel);

export default router;