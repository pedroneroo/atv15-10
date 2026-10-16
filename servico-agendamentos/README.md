# Serviço de Agendamentos

Recebe reservas, valida os dados, consulta o Catálogo por HTTP (`fetch`) e registra a reserva. Porta **3000**.
Requer o Catálogo rodando em `http://localhost:3001` (ou defina `CATALOGO_URL`).

```bash
npm install
npm run dev   # Agendamentos rodando em http://localhost:3000
```

Endpoints, exemplos de body e tabela de status: veja o [README principal](../README.md).
`node_modules` não deve ir ao repositório.
