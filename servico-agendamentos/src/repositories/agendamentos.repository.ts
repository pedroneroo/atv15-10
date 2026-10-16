import { Agendamento, NovoAgendamento, StatusAgendamento } from "../types";

const agendamentos: Agendamento[] = [];
let proximoId = 1;

export const agendamentosRepository = {
  listar(filtros: { curso?: string; status?: StatusAgendamento }): Agendamento[] {
    return agendamentos.filter(
      (a) =>
        (!filtros.curso || a.curso.toLowerCase() === filtros.curso.toLowerCase()) &&
        (!filtros.status || a.status === filtros.status)
    );
  },

  buscarPorId(id: number): Agendamento | undefined {
    return agendamentos.find((a) => a.id === id);
  },

  criar(dados: NovoAgendamento, status: StatusAgendamento): Agendamento {
    const novo: Agendamento = { id: proximoId++, ...dados, status };
    agendamentos.push(novo);
    return novo;
  },

  atualizarStatus(id: number, status: StatusAgendamento): Agendamento | undefined {
    const ag = agendamentos.find((a) => a.id === id);
    if (!ag) return undefined;
    ag.status = status;
    return ag;
  },

  remover(id: number): boolean {
    const indice = agendamentos.findIndex((a) => a.id === id);
    if (indice === -1) return false;
    agendamentos.splice(indice, 1);
    return true;
  }
};
