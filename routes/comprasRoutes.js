import { Router } from "express";
import { getCompras, getComprasId, realizarCompras, actualizarCompra, eliminarCompra } from "../controllers/compras.controller.js";

const router = Router();

router.get("/", getCompras);
router.get("/:id", getComprasId);
router.post("/", realizarCompras);
router.put("/:id", actualizarCompra);
router.delete("/:id", eliminarCompra);

export default router;