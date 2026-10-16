import express from "express";
import agendamentosRoutes from "./routes/agendamentos.routes";
import { logger } from "./middlewares/logger";
import { errorHandler, rotaNaoEncontrada } from "./middlewares/errorHandler";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(logger);
app.use(express.json());

app.use("/agendamentos", agendamentosRoutes);

app.use(rotaNaoEncontrada);
app.use(errorHandler); // sempre por último

app.listen(PORT, () => {
  console.log(`Agendamentos rodando em http://localhost:${PORT}`);
});
