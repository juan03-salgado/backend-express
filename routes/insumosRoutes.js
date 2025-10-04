import { Router } from "express";
import { getInsumos, getInsumoId, crearInsumos, actualizarInsumos, eliminarInsumos } from "../controllers/insumos.controller.js";

const router = Router();

router.get("/", getInsumos);
router.get("/:id", getInsumoId);
router.post("/", crearInsumos);
router.put("/:id", actualizarInsumos);
router.delete("/:id", eliminarInsumos);

export default router;