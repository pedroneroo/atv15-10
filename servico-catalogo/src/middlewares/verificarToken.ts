import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

// Exige o header "Authorization: Bearer ifms2026" (usado em PATCH e DELETE).
export function verificarToken(request: Request, _response: Response, next: NextFunction) {
  const token = request.headers.authorization;

  if (token !== "Bearer ifms2026") {
    throw new AppError("Token inválido ou ausente", 401);
  }

  next();
}
