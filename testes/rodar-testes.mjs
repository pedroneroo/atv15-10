// Executa os testes obrigatórios (caminho feliz e triste) contra os serviços em execução
// e salva a evidência em evidencias/resultado-testes.md.
//
//   node testes/rodar-testes.mjs         -> todos os testes (com os DOIS serviços rodando)
//   node testes/rodar-testes.mjs --502   -> só o teste de catálogo fora do ar (pare o catálogo antes)
import { mkdirSync, writeFileSync } from "node:fs";

const CAT = "http://localhost:3001";
const AG = "http://localhost:3000";
const AUTH = { Authorization: "Bearer ifms2026" };
const ctx = {};

const recursoOk = { nome: "Roteador Cisco", tipo: "equipamento", local: "Bloco D", status: "disponivel" };
const reservaOk = (recursoId) => ({
  solicitante: "Ana Souza", curso: "TSI", recursoId,
  data: "2026-10-09", horario: "18:50-20:20", finalidade: "Aula prática de redes"
});

const casos502 = [
  { grupo: "Integração", nome: "Catálogo fora do ar", m: "POST", u: `${AG}/agendamentos`, body: reservaOk(2), esp: 502 }
];

const casos = [
  // ---------- Catálogo ----------
  { grupo: "Catálogo", nome: "Listar recursos", m: "GET", u: `${CAT}/recursos`, esp: 200 },
  { grupo: "Catálogo", nome: "Buscar existente", m: "GET", u: `${CAT}/recursos/1`, esp: 200 },
  { grupo: "Catálogo", nome: "Buscar inexistente", m: "GET", u: `${CAT}/recursos/999`, esp: 404 },
  { grupo: "Catálogo", nome: "Criar válido", m: "POST", u: `${CAT}/recursos`, body: recursoOk, esp: 201 },
  { grupo: "Catálogo", nome: "Criar inválido (nome vazio)", m: "POST", u: `${CAT}/recursos`, body: { ...recursoOk, nome: "" }, esp: 400 },
  { grupo: "Catálogo", nome: "Filtrar disponíveis", m: "GET", u: `${CAT}/recursos?status=disponivel`, esp: 200 },
  { grupo: "Catálogo", nome: "Filtrar por tipo e status combinados", m: "GET", u: `${CAT}/recursos?tipo=equipamento&status=manutencao`, esp: 200 },
  { grupo: "Token", nome: "Alterar status do recurso SEM token", m: "PATCH", u: `${CAT}/recursos/1/status`, body: { status: "disponivel" }, esp: 401 },
  { grupo: "Token", nome: "Alterar status do recurso COM token", m: "PATCH", u: `${CAT}/recursos/1/status`, h: AUTH, body: { status: "disponivel" }, esp: 200 },
  { grupo: "Catálogo", nome: "Alterar status inválido", m: "PATCH", u: `${CAT}/recursos/1/status`, h: AUTH, body: { status: "quebrado" }, esp: 400 },
  // ---------- Agendamentos ----------
  { grupo: "Agendamentos", nome: "Criar reserva válida", m: "POST", u: `${AG}/agendamentos`, body: reservaOk(2), esp: 201, depois: (j) => (ctx.id = j.id) },
  { grupo: "Agendamentos", nome: "Body incompleto (sem solicitante)", m: "POST", u: `${AG}/agendamentos`, body: { ...reservaOk(2), solicitante: undefined }, esp: 400 },
  { grupo: "Agendamentos", nome: "recursoId não numérico", m: "POST", u: `${AG}/agendamentos`, body: reservaOk("abc"), esp: 400 },
  { grupo: "Integração", nome: "Recurso inexistente no catálogo", m: "POST", u: `${AG}/agendamentos`, body: reservaOk(999), esp: 404 },
  { grupo: "Integração", nome: "Recurso em manutenção", m: "POST", u: `${AG}/agendamentos`, body: reservaOk(4), esp: 409 },
  { grupo: "Integração", nome: "Recurso indisponível", m: "POST", u: `${AG}/agendamentos`, body: reservaOk(5), esp: 409 },
  { grupo: "Agendamentos", nome: "Listar reservas", m: "GET", u: `${AG}/agendamentos`, esp: 200 },
  { grupo: "Agendamentos", nome: "Buscar reserva por id", m: "GET", u: () => `${AG}/agendamentos/${ctx.id}`, esp: 200 },
  { grupo: "Agendamentos", nome: "Buscar reserva inexistente", m: "GET", u: `${AG}/agendamentos/999`, esp: 404 },
  { grupo: "Agendamentos", nome: "Filtrar por curso", m: "GET", u: `${AG}/agendamentos?curso=TSI`, esp: 200 },
  { grupo: "Agendamentos", nome: "Filtrar por curso e status", m: "GET", u: `${AG}/agendamentos?curso=TSI&status=confirmado`, esp: 200 },
  { grupo: "Token", nome: "Alterar status da reserva SEM token", m: "PATCH", u: () => `${AG}/agendamentos/${ctx.id}/status`, body: { status: "cancelado" }, esp: 401 },
  { grupo: "Agendamentos", nome: "Alterar status da reserva COM token", m: "PATCH", u: () => `${AG}/agendamentos/${ctx.id}/status`, h: AUTH, body: { status: "cancelado" }, esp: 200 },
  { grupo: "Token", nome: "Excluir SEM token", m: "DELETE", u: () => `${AG}/agendamentos/${ctx.id}`, esp: 401 },
  { grupo: "Token", nome: "Excluir COM token", m: "DELETE", u: () => `${AG}/agendamentos/${ctx.id}`, h: AUTH, esp: 204 },
  { grupo: "Agendamentos", nome: "Excluir reserva inexistente", m: "DELETE", u: `${AG}/agendamentos/999`, h: AUTH, esp: 404 }
];

const lista = process.argv.includes("--502") ? casos502 : casos;
const arquivo = process.argv.includes("--502") ? "resultado-502.md" : "resultado-testes.md";
let md = `# ${arquivo === "resultado-502.md" ? "Teste de falha de integração (502)" : "Resultado dos testes"}\n\nGerado em ${new Date().toLocaleString("pt-BR")}\n\n`;
let falhas = 0;

for (const c of lista) {
  const url = typeof c.u === "function" ? c.u() : c.u;
  const headers = { "Content-Type": "application/json", ...(c.h ?? {}) };
  let status, texto;
  try {
    const r = await fetch(url, { method: c.m, headers, body: c.body ? JSON.stringify(c.body) : undefined });
    status = r.status;
    texto = await r.text();
  } catch (e) {
    status = 0;
    texto = `Falha de conexão: ${e.message}`;
  }
  const ok = status === c.esp;
  if (!ok) falhas++;
  let json = texto;
  try { const j = JSON.parse(texto); json = JSON.stringify(j, null, 2); if (ok) c.depois?.(j); } catch {}
  console.log(`${ok ? "OK  " : "FALHOU"} [${c.grupo}] ${c.nome} -> esperado ${c.esp}, obtido ${status}`);
  md += `## ${c.grupo} — ${c.nome} ${ok ? "✅" : "❌"}\n\n- **Requisição:** \`${c.m} ${url}\`\n`;
  if (c.h) md += `- **Headers:** \`Authorization: Bearer ifms2026\`\n`;
  if (c.body) md += `- **Body:**\n\n\`\`\`json\n${JSON.stringify(c.body, null, 2)}\n\`\`\`\n\n`;
  md += `- **Esperado:** ${c.esp} | **Obtido:** ${status}\n\n- **Resposta:**\n\n\`\`\`json\n${json || "(sem corpo)"}\n\`\`\`\n\n`;
}

mkdirSync("evidencias", { recursive: true });
writeFileSync(`evidencias/${arquivo}`, md);
console.log(`\n${lista.length - falhas}/${lista.length} testes passaram. Evidência salva em evidencias/${arquivo}`);
process.exit(falhas ? 1 : 0);
