import { AppError } from "../errors/AppError";
import { recursosRepository } from "../repositories/recursos.repository";
import { NovoRecurso, Recurso, STATUS, TIPOS, statusValido, tipoValido } from "../types";

export const recursosService = {
  listar(query: { status?: unknown; tipo?: unknown }): Recurso[] {
    // Filtros opcionais; se vierem com valor inválido, é erro do cliente (400).
    if (query.status !== undefined && !statusValido(query.status)) {
      throw new AppError(`Filtro 'status' inválido. Aceitos: ${STATUS.join(", ")}`, 400);
    }
    if (query.tipo !== undefined && !tipoValido(query.tipo)) {
      throw new AppError(`Filtro 'tipo' inválido. Aceitos: ${TIPOS.join(", ")}`, 400);
    }
    return recursosRepository.listar({
      status: query.status as Recurso["status"] | undefined,
      tipo: query.tipo as Recurso["tipo"] | undefined
    });
  },

  buscarPorId(id: number): Recurso {
    const recurso = recursosRepository.buscarPorId(id);
    if (!recurso) throw new AppError("Recurso não encontrado", 404);
    return recurso;
  },

  criar(dados: NovoRecurso): Recurso {
    return recursosRepository.criar(dados);
  },

  atualizarStatus(id: number, status: unknown): Recurso {
    if (!statusValido(status)) {
      throw new AppError(`Status inválido. Aceitos: ${STATUS.join(", ")}`, 400);
    }
    const atualizado = recursosRepository.atualizarStatus(id, status);
    if (!atualizado) throw new AppError("Recurso não encontrado", 404);
    return atualizado;
  }
};
