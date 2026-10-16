# Gabarito: resultado esperado dos testes (26 casos)

> ⚠️ **GABARITO, NÃO É EVIDÊNCIA REAL.** Estes resultados foram deduzidos lendo o código do projeto (não houve execução, pois o ambiente não tinha internet para instalar o `express`). Servem só para você **comparar** com a saída do seu `node testes/rodar-testes.mjs`. Para entregar, use sempre os arquivos gerados pela sua própria execução.

Ordem importa: o estado é em memória e os testes dependem uns dos outros (ex.: o recurso criado no caso 4 vira o id 6; a reserva criada vira id 1). Rode com os serviços recém-iniciados.

## Catálogo — Listar recursos

- **Requisição:** `GET http://localhost:3001/recursos`
- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
[
  {
    "id": 1,
    "nome": "Notebook Dell",
    "tipo": "equipamento",
    "local": "Bloco A",
    "status": "disponivel"
  },
  {
    "id": 2,
    "nome": "Laboratório 3",
    "tipo": "laboratorio",
    "local": "Bloco B",
    "status": "disponivel"
  },
  {
    "id": 3,
    "nome": "Projetor Epson",
    "tipo": "equipamento",
    "local": "Bloco A",
    "status": "disponivel"
  },
  {
    "id": 4,
    "nome": "Kit Arduino",
    "tipo": "equipamento",
    "local": "Bloco C",
    "status": "manutencao"
  },
  {
    "id": 5,
    "nome": "Impressora 3D",
    "tipo": "equipamento",
    "local": "Bloco C",
    "status": "indisponivel"
  }
]
```

## Catálogo — Buscar existente

- **Requisição:** `GET http://localhost:3001/recursos/1`
- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
{
  "id": 1,
  "nome": "Notebook Dell",
  "tipo": "equipamento",
  "local": "Bloco A",
  "status": "disponivel"
}
```

## Catálogo — Buscar inexistente

- **Requisição:** `GET http://localhost:3001/recursos/999`
- **Esperado:** 404 | **Obtido (previsto pelo código):** 404

- **Resposta:**

```json
{
  "mensagem": "Recurso não encontrado",
  "status": 404,
  "origem": "servico-catalogo"
}
```

## Catálogo — Criar válido

- **Requisição:** `POST http://localhost:3001/recursos`
- **Body:**

```json
{
  "nome": "Roteador Cisco",
  "tipo": "equipamento",
  "local": "Bloco D",
  "status": "disponivel"
}
```

- **Esperado:** 201 | **Obtido (previsto pelo código):** 201

- **Resposta:**

```json
{
  "id": 6,
  "nome": "Roteador Cisco",
  "tipo": "equipamento",
  "local": "Bloco D",
  "status": "disponivel"
}
```

## Catálogo — Criar inválido (nome vazio)

- **Requisição:** `POST http://localhost:3001/recursos`
- **Body:**

```json
{
  "nome": "",
  "tipo": "equipamento",
  "local": "Bloco D",
  "status": "disponivel"
}
```

- **Esperado:** 400 | **Obtido (previsto pelo código):** 400

- **Resposta:**

```json
{
  "mensagem": "Campo 'nome' é obrigatório",
  "status": 400,
  "origem": "servico-catalogo"
}
```

## Catálogo — Filtrar disponíveis

- **Requisição:** `GET http://localhost:3001/recursos?status=disponivel`
- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
[
  {
    "id": 1,
    "nome": "Notebook Dell",
    "tipo": "equipamento",
    "local": "Bloco A",
    "status": "disponivel"
  },
  {
    "id": 2,
    "nome": "Laboratório 3",
    "tipo": "laboratorio",
    "local": "Bloco B",
    "status": "disponivel"
  },
  {
    "id": 3,
    "nome": "Projetor Epson",
    "tipo": "equipamento",
    "local": "Bloco A",
    "status": "disponivel"
  },
  {
    "id": 6,
    "nome": "Roteador Cisco",
    "tipo": "equipamento",
    "local": "Bloco D",
    "status": "disponivel"
  }
]
```

## Catálogo — Filtrar por tipo e status combinados

- **Requisição:** `GET http://localhost:3001/recursos?tipo=equipamento&status=manutencao`
- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
[
  {
    "id": 4,
    "nome": "Kit Arduino",
    "tipo": "equipamento",
    "local": "Bloco C",
    "status": "manutencao"
  }
]
```

## Token — Alterar status do recurso SEM token

- **Requisição:** `PATCH http://localhost:3001/recursos/1/status`
- **Body:**

```json
{
  "status": "disponivel"
}
```

- **Esperado:** 401 | **Obtido (previsto pelo código):** 401

- **Resposta:**

```json
{
  "mensagem": "Token inválido ou ausente",
  "status": 401,
  "origem": "servico-catalogo"
}
```

## Token — Alterar status do recurso COM token

- **Requisição:** `PATCH http://localhost:3001/recursos/1/status`
- **Headers:** `Authorization: Bearer ifms2026`
- **Body:**

```json
{
  "status": "disponivel"
}
```

- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
{
  "id": 1,
  "nome": "Notebook Dell",
  "tipo": "equipamento",
  "local": "Bloco A",
  "status": "disponivel"
}
```

## Catálogo — Alterar status inválido

- **Requisição:** `PATCH http://localhost:3001/recursos/1/status`
- **Headers:** `Authorization: Bearer ifms2026`
- **Body:**

```json
{
  "status": "quebrado"
}
```

- **Esperado:** 400 | **Obtido (previsto pelo código):** 400

- **Resposta:**

```json
{
  "mensagem": "Status inválido. Aceitos: disponivel, manutencao, indisponivel",
  "status": 400,
  "origem": "servico-catalogo"
}
```

## Agendamentos — Criar reserva válida

- **Requisição:** `POST http://localhost:3000/agendamentos`
- **Body:**

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

- **Esperado:** 201 | **Obtido (previsto pelo código):** 201

- **Resposta:**

```json
{
  "id": 1,
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recurso": {
    "id": 2,
    "nome": "Laboratório 3",
    "local": "Bloco B"
  },
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes",
  "status": "confirmado"
}
```

## Agendamentos — Body incompleto (sem solicitante)

- **Requisição:** `POST http://localhost:3000/agendamentos`
- **Body:**

```json
{
  "curso": "TSI",
  "recursoId": 2,
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes"
}
```

- **Esperado:** 400 | **Obtido (previsto pelo código):** 400

- **Resposta:**

```json
{
  "mensagem": "Campo obrigatório ausente ou inválido: solicitante",
  "status": 400,
  "origem": "servico-agendamentos"
}
```

## Agendamentos — recursoId não numérico

- **Requisição:** `POST http://localhost:3000/agendamentos`
- **Body:**

```json
{
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": "abc",
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes"
}
```

- **Esperado:** 400 | **Obtido (previsto pelo código):** 400

- **Resposta:**

```json
{
  "mensagem": "recursoId precisa ser um número inteiro positivo",
  "status": 400,
  "origem": "servico-agendamentos"
}
```

## Integração — Recurso inexistente no catálogo

- **Requisição:** `POST http://localhost:3000/agendamentos`
- **Body:**

```json
{
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 999,
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes"
}
```

- **Esperado:** 404 | **Obtido (previsto pelo código):** 404

- **Resposta:**

```json
{
  "mensagem": "Recurso não encontrado no catálogo",
  "status": 404,
  "origem": "servico-agendamentos"
}
```

## Integração — Recurso em manutenção

- **Requisição:** `POST http://localhost:3000/agendamentos`
- **Body:**

```json
{
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 4,
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes"
}
```

- **Esperado:** 409 | **Obtido (previsto pelo código):** 409

- **Resposta:**

```json
{
  "mensagem": "Recurso 'Kit Arduino' não pode ser reservado: status 'manutencao'",
  "status": 409,
  "origem": "servico-agendamentos"
}
```

## Integração — Recurso indisponível

- **Requisição:** `POST http://localhost:3000/agendamentos`
- **Body:**

```json
{
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 5,
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes"
}
```

- **Esperado:** 409 | **Obtido (previsto pelo código):** 409

- **Resposta:**

```json
{
  "mensagem": "Recurso 'Impressora 3D' não pode ser reservado: status 'indisponivel'",
  "status": 409,
  "origem": "servico-agendamentos"
}
```

## Agendamentos — Listar reservas

- **Requisição:** `GET http://localhost:3000/agendamentos`
- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
[
  {
    "id": 1,
    "solicitante": "Ana Souza",
    "curso": "TSI",
    "recursoId": 2,
    "data": "2026-10-09",
    "horario": "18:50-20:20",
    "finalidade": "Aula prática de redes",
    "status": "confirmado"
  }
]
```

## Agendamentos — Buscar reserva por id

- **Requisição:** `GET http://localhost:3000/agendamentos/1`
- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
{
  "id": 1,
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 2,
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes",
  "status": "confirmado"
}
```

## Agendamentos — Buscar reserva inexistente

- **Requisição:** `GET http://localhost:3000/agendamentos/999`
- **Esperado:** 404 | **Obtido (previsto pelo código):** 404

- **Resposta:**

```json
{
  "mensagem": "Agendamento não encontrado",
  "status": 404,
  "origem": "servico-agendamentos"
}
```

## Agendamentos — Filtrar por curso

- **Requisição:** `GET http://localhost:3000/agendamentos?curso=TSI`
- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
[
  {
    "id": 1,
    "solicitante": "Ana Souza",
    "curso": "TSI",
    "recursoId": 2,
    "data": "2026-10-09",
    "horario": "18:50-20:20",
    "finalidade": "Aula prática de redes",
    "status": "confirmado"
  }
]
```

## Agendamentos — Filtrar por curso e status

- **Requisição:** `GET http://localhost:3000/agendamentos?curso=TSI&status=confirmado`
- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
[
  {
    "id": 1,
    "solicitante": "Ana Souza",
    "curso": "TSI",
    "recursoId": 2,
    "data": "2026-10-09",
    "horario": "18:50-20:20",
    "finalidade": "Aula prática de redes",
    "status": "confirmado"
  }
]
```

## Token — Alterar status da reserva SEM token

- **Requisição:** `PATCH http://localhost:3000/agendamentos/1/status`
- **Body:**

```json
{
  "status": "cancelado"
}
```

- **Esperado:** 401 | **Obtido (previsto pelo código):** 401

- **Resposta:**

```json
{
  "mensagem": "Token inválido ou ausente",
  "status": 401,
  "origem": "servico-agendamentos"
}
```

## Agendamentos — Alterar status da reserva COM token

- **Requisição:** `PATCH http://localhost:3000/agendamentos/1/status`
- **Headers:** `Authorization: Bearer ifms2026`
- **Body:**

```json
{
  "status": "cancelado"
}
```

- **Esperado:** 200 | **Obtido (previsto pelo código):** 200

- **Resposta:**

```json
{
  "id": 1,
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 2,
  "data": "2026-10-09",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes",
  "status": "cancelado"
}
```

## Token — Excluir SEM token

- **Requisição:** `DELETE http://localhost:3000/agendamentos/1`
- **Esperado:** 401 | **Obtido (previsto pelo código):** 401

- **Resposta:**

```json
{
  "mensagem": "Token inválido ou ausente",
  "status": 401,
  "origem": "servico-agendamentos"
}
```

## Token — Excluir COM token

- **Requisição:** `DELETE http://localhost:3000/agendamentos/1`
- **Headers:** `Authorization: Bearer ifms2026`
- **Esperado:** 204 | **Obtido (previsto pelo código):** 204

- **Resposta:**

```json
(sem corpo)
```

## Agendamentos — Excluir reserva inexistente

- **Requisição:** `DELETE http://localhost:3000/agendamentos/999`
- **Headers:** `Authorization: Bearer ifms2026`
- **Esperado:** 404 | **Obtido (previsto pelo código):** 404

- **Resposta:**

```json
{
  "mensagem": "Agendamento não encontrado",
  "status": 404,
  "origem": "servico-agendamentos"
}
```

