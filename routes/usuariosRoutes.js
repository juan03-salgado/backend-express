import { Router } from "express";
import { getUsuarios, getUsuarioId, crearUsuario, actualizarUsuario, eliminarUsuario, loginUsuario } from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/", getUsuarios);
router.get("/:id", getUsuarioId);
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);
router.post("/login", loginUsuario);

export default router;
