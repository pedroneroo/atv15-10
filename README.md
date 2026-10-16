# Web Services — Avaliação do 1º Bimestre (IFMS)

Sistema de **reservas de equipamentos e laboratórios do IFMS**, formado por dois Web Services
independentes que conversam por HTTP. O serviço de **Agendamentos** só cria uma reserva depois
de consultar o serviço de **Catálogo** (via `fetch`) para saber se o recurso existe e está disponível.

```
Cliente (Thunder Client) ──► Agendamentos :3000 ──fetch──► Catálogo :3001
                                     ◄── JSON organizado + status correto
```

## Tecnologias

Node.js (18+), TypeScript, Express, `fetch` nativo, dados em memória (sem banco).

## Como instalar e executar

Os dois serviços devem rodar **ao mesmo tempo**, cada um em um terminal.

```bash
# Terminal 1
cd servico-catalogo
npm install
npm run dev
# Catálogo rodando em http://localhost:3001

# Terminal 2
cd servico-agendamentos
npm install
npm run dev
# Agendamentos rodando em http://localhost:3000
```

Variáveis opcionais (ver `servico-agendamentos/.env.example`): `PORT` e `CATALOGO_URL`
(padrão `http://localhost:3001`).

> ⚠️ **`node_modules` não vai para o repositório** (está no `.gitignore`). Após clonar, rode `npm install` em cada serviço.

## Estrutura

```
servico-catalogo/src      server.ts, routes, controllers, services, repositories, middlewares, errors
servico-agendamentos/src  server.ts, routes, controllers, services, repositories, clients, middlewares, errors
evidencias/               resultados dos testes
testes/                   script que executa os testes obrigatórios
```

Fluxo em camadas: **route → middleware (validação/token) → controller → service → repository**.
No Agendamentos, a service chama o **client** (`catalogo.client.ts`), que executa o `fetch`.

## Endpoints — Catálogo (porta 3001)

| Método | Endpoint | Função | Status |
|---|---|---|---|
| GET | `/recursos` | lista todos (aceita `?status=` e `?tipo=`, combináveis) | 200, 400 (filtro inválido) |
| GET | `/recursos/:id` | busca por id | 200, 400, 404 |
| POST | `/recursos` | cadastra recurso | 201, 400 |
| PATCH | `/recursos/:id/status` 🔒 | altera apenas o status | 200, 400, 401, 404 |

Recursos de exemplo já cadastrados: 1 Notebook Dell, 2 Laboratório 3, 3 Projetor Epson (disponíveis),
4 Kit Arduino (**manutencao**), 5 Impressora 3D (**indisponivel**).

## Endpoints — Agendamentos (porta 3000)

| Método | Endpoint | Função | Status |
|---|---|---|---|
| GET | `/agendamentos` | lista (aceita `?curso=` e `?status=`, combináveis) | 200, 400 |
| GET | `/agendamentos/:id` | busca por id | 200, 400, 404 |
| POST | `/agendamentos` | cria reserva **consultando o catálogo** | 201, 400, 404, 409, 502 (e 504 se timeout) |
| PATCH | `/agendamentos/:id/status` 🔒 | altera status (`pendente`/`confirmado`/`cancelado`) | 200, 400, 401, 404 |
| DELETE | `/agendamentos/:id` 🔒 | remove reserva | 204, 401, 404 |

🔒 = exige o header `Authorization: Bearer ifms2026`.

## Exemplos de body JSON

**POST /recursos**
```json
{ "nome": "Roteador Cisco", "tipo": "equipamento", "local": "Bloco D", "status": "disponivel" }
```

**PATCH /recursos/1/status** (ou `/agendamentos/1/status`)
```json
{ "status": "manutencao" }
```

**POST /agendamentos** → `201 Created`
```json
{
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 2,
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes"
}
```
Resposta:
```json
{
  "id": 1,
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recurso": { "id": 2, "nome": "Laboratório 3", "local": "Bloco B" },
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes",
  "status": "confirmado"
}
```

**Formato padrão de erro** (todos os erros, nos dois serviços)
```json
{ "mensagem": "Recurso não encontrado no catálogo", "status": 404, "origem": "servico-agendamentos" }
```

## Tabela de status HTTP esperados

| Status | Quando acontece |
|---|---|
| 200 OK | consulta/alteração bem-sucedida |
| 201 Created | recurso ou reserva criados |
| 204 No Content | reserva removida |
| 400 Bad Request | campo ausente/inválido, `recursoId` não numérico, status ou filtro inválido, id inválido, JSON malformado |
| 401 Unauthorized | PATCH/DELETE sem o token `Bearer ifms2026` |
| 404 Not Found | recurso/reserva inexistente (ou rota inexistente) |
| 409 Conflict | recurso em `manutencao` ou `indisponivel` |
| 502 Bad Gateway | catálogo fora do ar, URL incorreta ou resposta inválida |
| 504 Gateway Timeout | catálogo não respondeu em 5 s (desafio extra) |

## Como testar a integração no Thunder Client

1. Suba os **dois** serviços.
2. Crie requisições no Thunder Client com `Content-Type: application/json` (e, nas rotas 🔒, a aba **Headers** com `Authorization` = `Bearer ifms2026`).
3. Roteiro:
   - `POST http://localhost:3000/agendamentos` com `recursoId: 2` → **201**
   - mesmo POST sem `solicitante` → **400**
   - `recursoId: 999` → **404** (o catálogo respondeu que não existe)
   - `recursoId: 4` (manutenção) → **409**
   - **pare o catálogo** (Ctrl+C no Terminal 1) e repita o POST válido → **502**
   - `DELETE http://localhost:3000/agendamentos/1` sem token → **401**; com token → **204**

**Atalho:** com os dois serviços rodando, `node testes/rodar-testes.mjs` executa todos os cenários e gera
`evidencias/resultado-testes.md`. Depois, com o catálogo parado, `node testes/rodar-testes.mjs --502`
gera `evidencias/resultado-502.md`. Veja também `evidencias/TESTES.md`.

## Middlewares

| Middleware | Onde | Função |
|---|---|---|
| `logger` | global | mostra método, URL e horário no terminal |
| `validarRecurso` | POST /recursos | bloqueia campos ausentes/valores inválidos |
| `validarAgendamento` | POST /agendamentos | exige solicitante, curso, recursoId (número), data (AAAA-MM-DD), horário (HH:MM-HH:MM) e finalidade |
| `verificarToken` | PATCH e DELETE | exige `Authorization: Bearer ifms2026` |
| `errorHandler` | final | padroniza os erros em JSON |
