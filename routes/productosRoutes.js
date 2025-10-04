import { Router } from "express";
import { getProductos, getProductosId, crearProductos, actualizarProductos, eliminarProductos } from "../controllers/productosAgricolas.controller.js";

const router = Router();

router.get("/", getProductos);
router.get("/:id", getProductosId);
router.post("/", crearProductos);
router.put("/:id", actualizarProductos);
router.delete("/:id", eliminarProductos);

export default router;