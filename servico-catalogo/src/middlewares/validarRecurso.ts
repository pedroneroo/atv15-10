import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { STATUS, TIPOS, statusValido, tipoValido } from "../types";

// Valida o body do POST /recursos ANTES de chegar no controller.
export function validarRecurso(request: Request, _response: Response, next: NextFunction) {
  const body = request.body ?? {};

  if (typeof body.nome !== "string" || body.nome.trim() === "") {
    throw new AppError("Campo 'nome' é obrigatório", 400);
  }
  if (typeof body.local !== "string" || body.local.trim() === "") {
    throw new AppError("Campo 'local' é obrigatório", 400);
  }
  if (!tipoValido(body.tipo)) {
    throw new AppError(`Campo 'tipo' inválido ou ausente. Aceitos: ${TIPOS.join(", ")}`, 400);
  }
  if (!statusValido(body.status)) {
    throw new AppError(`Campo 'status' inválido ou ausente. Aceitos: ${STATUS.join(", ")}`, 400);
  }

  request.body = {
    nome: body.nome.trim(),
    tipo: body.tipo,
    local: body.local.trim(),
    status: body.status
  };
  next();
}
