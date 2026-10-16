import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

const CAMPOS_TEXTO = ["solicitante", "curso", "data", "horario", "finalidade"] as const;

// Valida o body do POST /agendamentos ANTES de consultar o catálogo.
export function validarAgendamento(request: Request, _response: Response, next: NextFunction) {
  const body = request.body ?? {};

  for (const campo of CAMPOS_TEXTO) {
    if (typeof body[campo] !== "string" || body[campo].trim() === "") {
      throw new AppError(`Campo obrigatório ausente ou inválido: ${campo}`, 400);
    }
  }

  if (body.recursoId === undefined || body.recursoId === null || body.recursoId === "") {
    throw new AppError("Campo obrigatório ausente: recursoId", 400);
  }
  if (typeof body.recursoId !== "number" || !Number.isInteger(body.recursoId) || body.recursoId <= 0) {
    throw new AppError("recursoId precisa ser um número inteiro positivo", 400);
  }

  // data no formato AAAA-MM-DD e que exista no calendário
  const data: string = body.data.trim();
  const dt = new Date(`${data}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || isNaN(dt.getTime()) || dt.toISOString().slice(0, 10) !== data) {
    throw new AppError("data inválida: use o formato AAAA-MM-DD (ex.: 2026-10-09)", 400);
  }

  // horario no formato HH:MM-HH:MM, com início antes do fim
  const horario: string = body.horario.trim();
  const m = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/.exec(horario);
  if (!m || `${m[1]}:${m[2]}` >= `${m[3]}:${m[4]}`) {
    throw new AppError("horario inválido: use HH:MM-HH:MM com início antes do fim (ex.: 18:50-20:20)", 400);
  }

  request.body = {
    solicitante: body.solicitante.trim(),
    curso: body.curso.trim(),
    recursoId: body.recursoId,
    data,
    horario,
    finalidade: body.finalidade.trim()
  };
  next();
}
