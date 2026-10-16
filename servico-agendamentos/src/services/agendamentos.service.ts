import { AppError } from "../errors/AppError";
import { buscarRecursoNoCatalogo } from "../clients/catalogo.client";
import { agendamentosRepository } from "../repositories/agendamentos.repository";
import {
  Agendamento,
  NovoAgendamento,
  STATUS_AGENDAMENTO,
  statusAgendamentoValido
} from "../types";

export const agendamentosService = {
  listar(query: { curso?: unknown; status?: unknown }): Agendamento[] {
    if (query.curso !== undefined && typeof query.curso !== "string") {
      throw new AppError("Filtro 'curso' inválido", 400);
    }
    if (query.status !== undefined && !statusAgendamentoValido(query.status)) {
      throw new AppError(`Filtro 'status' inválido. Aceitos: ${STATUS_AGENDAMENTO.join(", ")}`, 400);
    }
    return agendamentosRepository.listar({
      curso: query.curso as string | undefined,
      status: query.status as Agendamento["status"] | undefined
    });
  },

  buscarPorId(id: number): Agendamento {
    const ag = agendamentosRepository.buscarPorId(id);
    if (!ag) throw new AppError("Agendamento não encontrado", 404);
    return ag;
  },

  // Fluxo do POST: (body já validado) -> fetch no catálogo -> regra -> salvar -> resposta
  async criar(dados: NovoAgendamento) {
    const recurso = await buscarRecursoNoCatalogo(dados.recursoId); // pode lançar 404 / 502 / 504

    if (recurso.status !== "disponivel") {
      throw new AppError(
        `Recurso '${recurso.nome}' não pode ser reservado: status '${recurso.status}'`,
        409
      );
    }

    const ag = agendamentosRepository.criar(dados, "confirmado");

    // Resposta organizada: reserva + dados resumidos do recurso (não é cópia do catálogo)
    return {
      id: ag.id,
      solicitante: ag.solicitante,
      curso: ag.curso,
      recurso: { id: recurso.id, nome: recurso.nome, local: recurso.local },
      data: ag.data,
      horario: ag.horario,
      finalidade: ag.finalidade,
      status: ag.status
    };
  },

  atualizarStatus(id: number, status: unknown): Agendamento {
    if (!statusAgendamentoValido(status)) {
      throw new AppError(`Status inválido. Aceitos: ${STATUS_AGENDAMENTO.join(", ")}`, 400);
    }
    const ag = agendamentosRepository.atualizarStatus(id, status);
    if (!ag) throw new AppError("Agendamento não encontrado", 404);
    return ag;
  },

  remover(id: number): void {
    if (!agendamentosRepository.remover(id)) {
      throw new AppError("Agendamento não encontrado", 404);
    }
  }
};
