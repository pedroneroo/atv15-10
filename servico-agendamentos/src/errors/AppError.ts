// Erro de aplicação com status HTTP. É lançado (throw) em qualquer camada
// e capturado pelo errorHandler, que monta a resposta JSON padronizada.
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
