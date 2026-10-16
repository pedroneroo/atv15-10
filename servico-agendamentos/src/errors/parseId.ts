import { AppError } from "./AppError";

// Converte o :id da URL em número. Se não for inteiro positivo, responde 400.
export function parseId(valor: string): number {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("id inválido: deve ser um número inteiro positivo", 400);
  }
  return id;
}
