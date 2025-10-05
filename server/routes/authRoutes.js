import express from "express";
import { login, logout, verificarSesion } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/check", verificarSesion);

export default router;
