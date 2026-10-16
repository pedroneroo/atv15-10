export const STATUS_AGENDAMENTO = ["pendente", "confirmado", "cancelado"] as const;
export type StatusAgendamento = (typeof STATUS_AGENDAMENTO)[number];

export type Agendamento = {
  id: number;
  solicitante: string;
  curso: string;
  recursoId: number;
  data: string;
  horario: string;
  finalidade: string;
  status: StatusAgendamento;
};

export type NovoAgendamento = Omit<Agendamento, "id" | "status">;

// Formato do recurso devolvido pelo serviço de catálogo.
export type RecursoCatalogo = {
  id: number;
  nome: string;
  tipo: string;
  local: string;
  status: "disponivel" | "manutencao" | "indisponivel";
};

export const statusAgendamentoValido = (v: unknown): v is StatusAgendamento =>
  typeof v === "string" && (STATUS_AGENDAMENTO as readonly string[]).includes(v);
