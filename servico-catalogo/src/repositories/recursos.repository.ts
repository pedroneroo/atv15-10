import { Recurso, NovoRecurso, StatusRecurso, TipoRecurso } from "../types";

// "Banco de dados" em memória, já com alguns recursos para teste.
const recursos: Recurso[] = [
  { id: 1, nome: "Notebook Dell", tipo: "equipamento", local: "Bloco A", status: "disponivel" },
  { id: 2, nome: "Laboratório 3", tipo: "laboratorio", local: "Bloco B", status: "disponivel" },
  { id: 3, nome: "Projetor Epson", tipo: "equipamento", local: "Bloco A", status: "disponivel" },
  { id: 4, nome: "Kit Arduino", tipo: "equipamento", local: "Bloco C", status: "manutencao" },
  { id: 5, nome: "Impressora 3D", tipo: "equipamento", local: "Bloco C", status: "indisponivel" }
];

let proximoId = recursos.length + 1;

export const recursosRepository = {
  listar(filtros: { status?: StatusRecurso; tipo?: TipoRecurso }): Recurso[] {
    return recursos.filter(
      (r) =>
        (!filtros.status || r.status === filtros.status) &&
        (!filtros.tipo || r.tipo === filtros.tipo)
    );
  },

  buscarPorId(id: number): Recurso | undefined {
    return recursos.find((r) => r.id === id);
  },

  criar(dados: NovoRecurso): Recurso {
    const novo: Recurso = { id: proximoId++, ...dados };
    recursos.push(novo);
    return novo;
  },

  atualizarStatus(id: number, status: StatusRecurso): Recurso | undefined {
    const recurso = recursos.find((r) => r.id === id);
    if (!recurso) return undefined;
    recurso.status = status; // altera APENAS o status
    return recurso;
  }
};
