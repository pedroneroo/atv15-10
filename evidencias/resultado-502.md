# Gabarito: teste de falha de integração (502)

> ⚠️ **GABARITO, NÃO É EVIDÊNCIA REAL.** Estes resultados foram deduzidos lendo o código do projeto (não houve execução, pois o ambiente não tinha internet para instalar o `express`). Servem só para você **comparar** com a saída do seu `node testes/rodar-testes.mjs`. Para entregar, use sempre os arquivos gerados pela sua própria execução.

Antes de rodar `node testes/rodar-testes.mjs --502`, pare o catálogo (Ctrl+C).

## Integração — Catálogo fora do ar

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

- **Esperado:** 502 | **Obtido (previsto pelo código):** 502

- **Resposta:**

```json
{
  "mensagem": "Catálogo indisponível (falha na integração entre serviços)",
  "status": 502,
  "origem": "servico-agendamentos"
}
```

