import express from "express";
import recursosRoutes from "./routes/recursos.routes";
import { logger } from "./middlewares/logger";
import { errorHandler, rotaNaoEncontrada } from "./middlewares/errorHandler";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(logger);
app.use(express.json());

app.use("/recursos", recursosRoutes);

app.use(rotaNaoEncontrada);
app.use(errorHandler); // sempre por último

app.listen(PORT, () => {
  console.log(`Catálogo rodando em http://localhost:${PORT}`);
});
