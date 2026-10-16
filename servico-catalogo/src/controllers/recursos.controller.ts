import { Request, Response } from "express";
import { parseId } from "../errors/parseId";
import { recursosService } from "../services/recursos.service";

// Controller: só lê a requisição, chama a service e devolve a resposta.
export const recursosController = {
  listar(request: Request, response: Response) {
    const { status, tipo } = request.query;
    return response.status(200).json(recursosService.listar({ status, tipo }));
  },

  buscarPorId(request: Request, response: Response) {
    const id = parseId(request.params.id);
    return response.status(200).json(recursosService.buscarPorId(id));
  },

  criar(request: Request, response: Response) {
    const { nome, tipo, local, status } = request.body; // já validado pelo middleware
    return response.status(201).json(recursosService.criar({ nome, tipo, local, status }));
  },

  atualizarStatus(request: Request, response: Response) {
    const id = parseId(request.params.id);
    const { status } = request.body ?? {};
    return response.status(200).json(recursosService.atualizarStatus(id, status));
  }
};
