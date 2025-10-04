import { Router } from "express";
import { getProveedores, getProveedoresId, crearProveedores, actualizarProveedores, eliminarProveedores } from "../controllers/proveedores.controller.js";

const router = Router();

router.get("/", getProveedores);
router.get("/:id", getProveedoresId);
router.post("/", crearProveedores);
router.put("/:id", actualizarProveedores);
router.delete("/:id", eliminarProveedores);

export default router;