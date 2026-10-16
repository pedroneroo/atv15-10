import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

const ORIGEM = "servico-catalogo";

// Middleware de rota inexistente: vira um 404 padronizado.
export function rotaNaoEncontrada(_request: Request, _response: Response, next: NextFunction) {
  next(new AppError("Rota não encontrada", 404));
}

// Último middleware da aplicação: TODO erro sai neste formato:
// { "mensagem": "...", "status": 404, "origem": "servico-catalogo" }
export function errorHandler(
  erro: any,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  let status = 500;
  let mensagem = "Erro interno do servidor";

  if (erro instanceof AppError) {
    status = erro.statusCode;
    mensagem = erro.message;
  } else if (erro?.type === "entity.parse.failed") {
    // JSON malformado no body
    status = 400;
    mensagem = "JSON inválido no corpo da requisição";
  } else {
    console.error(erro);
  }

  return response.status(status).json({ mensagem, status, origem: ORIGEM });
}
