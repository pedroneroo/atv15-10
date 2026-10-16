import { Router } from "express";
import { agendamentosController } from "../controllers/agendamentos.controller";
import { validarAgendamento } from "../middlewares/validarAgendamento";
import { verificarToken } from "../middlewares/verificarToken";

const router = Router();

router.get("/", agendamentosController.listar); // aceita ?curso= e ?status=
router.get("/:id", agendamentosController.buscarPorId);
router.post("/", validarAgendamento, agendamentosController.criar);
router.patch("/:id/status", verificarToken, agendamentosController.atualizarStatus);
router.delete("/:id", verificarToken, agendamentosController.remover);

export default router;
