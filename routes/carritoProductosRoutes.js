import { Router } from "express";
import { getCarritoProducto, getCarritoProductoId, añadirCarrito, actualizarCarritoProductos, eliminarCarritoProductos } from "../controllers/carrito.productos.controller.js";

const router = Router();

router.get("/", getCarritoProducto);
router.get("/:id", getCarritoProductoId);
router.post("/", añadirCarrito);
router.put("/:id", actualizarCarritoProductos);
router.delete("/:id", eliminarCarritoProductos);

export default router;
