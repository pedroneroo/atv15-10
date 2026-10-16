import { AppError } from "../errors/AppError";
import { RecursoCatalogo } from "../types";

const CATALOGO_URL = process.env.CATALOGO_URL || "http://localhost:3001";
const TIMEOUT_MS = 5000;

// Client HTTP: única parte do projeto que "fala" com o serviço de catálogo.
export async function buscarRecursoNoCatalogo(recursoId: number): Promise<RecursoCatalogo> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let resposta: Awaited<ReturnType<typeof fetch>>;
  try {
    resposta = await fetch(`${CATALOGO_URL}/recursos/${recursoId}`, {
      signal: controller.signal
    });
  } catch (erro: any) {
    // fetch só rejeita quando não consegue falar com o servidor (fora do ar, URL errada, timeout)
    if (erro?.name === "AbortError") {
      throw new AppError("Tempo limite excedido ao consultar o catálogo", 504);
    }
    throw new AppError("Catálogo indisponível (falha na integração entre serviços)", 502);
  } finally {
    clearTimeout(timer);
  }

  if (resposta.status === 404) {
    throw new AppError("Recurso não encontrado no catálogo", 404);
  }
  if (!resposta.ok) {
    throw new AppError("Falha ao consultar catálogo", 502);
  }

  try {
    return (await resposta.json()) as RecursoCatalogo;
  } catch {
    throw new AppError("Resposta inválida do catálogo", 502);
  }
}
