import { NextFunction, Request, Response } from "express";
import { parseId } from "../errors/parseId";
import { agendamentosService } from "../services/agendamentos.service";

export const agendamentosController = {
  listar(request: Request, response: Response) {
    const { curso, status } = request.query;
    return response.status(200).json(agendamentosService.listar({ curso, status }));
  },

  buscarPorId(request: Request, response: Response) {
    const id = parseId(request.params.id);
    return response.status(200).json(agendamentosService.buscarPorId(id));
  },

  // async: precisa de try/catch porque o Express 4 não captura erros de funções assíncronas.
  async criar(request: Request, response: Response, next: NextFunction) {
    try {
      const criado = await agendamentosService.criar(request.body); // body validado pelo middleware
      return response.status(201).json(criado);
    } catch (erro) {
      next(erro); // entrega o erro ao errorHandler
    }
  },

  atualizarStatus(request: Request, response: Response) {
    const id = parseId(request.params.id);
    const { status } = request.body ?? {};
    return response.status(200).json(agendamentosService.atualizarStatus(id, status));
  },

  remover(request: Request, response: Response) {
    const id = parseId(request.params.id);
    agendamentosService.remover(id);
    return response.status(204).send();
  }
};
