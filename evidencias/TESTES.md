# Evidências de teste

Os testes foram executados com o script `testes/rodar-testes.mjs` (que dispara as mesmas
requisições que seriam feitas no Thunder Client) e o resultado completo — método, URL, headers,
body, status esperado/obtido e resposta JSON — está nos arquivos:

- [`resultado-testes.md`](./resultado-testes.md) — catálogo, agendamentos, token e integração (404, 409)
- [`resultado-502.md`](./resultado-502.md) — catálogo parado → 502

## Casos cobertos

| Grupo | Teste | Esperado |
|---|---|---|
| Catálogo | Listar recursos | 200 + array |
| Catálogo | Buscar existente / inexistente | 200 / 404 |
| Catálogo | Criar válido / nome vazio | 201 / 400 |
| Catálogo | Filtrar `?status=disponivel` | 200 + array filtrado |
| Token | PATCH recurso sem token / com token | 401 / 200 |
| Agendamentos | Criar reserva válida | 201 |
| Agendamentos | Body sem solicitante / recursoId não numérico | 400 |
| Agendamentos | Listar / filtrar por curso | 200 + array |
| Token | DELETE sem token / com token | 401 / 204 |
| Integração | Recurso inexistente no catálogo | 404 |
| Integração | Recurso em manutenção ou indisponível | 409 |
| Integração | Catálogo fora do ar | 502 |
