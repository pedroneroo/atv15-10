import { Router } from "express";
import { recursosController } from "../controllers/recursos.controller";
import { validarRecurso } from "../middlewares/validarRecurso";
import { verificarToken } from "../middlewares/verificarToken";

const router = Router();

router.get("/", recursosController.listar); // aceita ?status= e ?tipo=
router.get("/:id", recursosController.buscarPorId);
router.post("/", validarRecurso, recursosController.criar);
router.patch("/:id/status", verificarToken, recursosController.atualizarStatus);

export default router;
