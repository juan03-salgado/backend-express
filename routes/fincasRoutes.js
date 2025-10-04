import { Router } from "express";
import { getFincas, getFincaId, crearFincas, actualizarFincas, eliminarFincas} from "../controllers/fincas.controller.js";

const router = Router();

router.get("/", getFincas);
router.get("/:id", getFincaId);
router.post("/", crearFincas);
router.put("/:id", actualizarFincas);
router.delete("/:id", eliminarFincas);

export default router;
