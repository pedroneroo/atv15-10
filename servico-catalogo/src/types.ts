export const TIPOS = ["laboratorio", "equipamento"] as const;
export const STATUS = ["disponivel", "manutencao", "indisponivel"] as const;

export type TipoRecurso = (typeof TIPOS)[number];
export type StatusRecurso = (typeof STATUS)[number];

export type Recurso = {
  id: number;
  nome: string;
  tipo: TipoRecurso;
  local: string;
  status: StatusRecurso;
};

export type NovoRecurso = Omit<Recurso, "id">;

export const tipoValido = (v: unknown): v is TipoRecurso =>
  typeof v === "string" && (TIPOS as readonly string[]).includes(v);

export const statusValido = (v: unknown): v is StatusRecurso =>
  typeof v === "string" && (STATUS as readonly string[]).includes(v);
