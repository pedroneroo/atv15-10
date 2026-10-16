import { Request, Response, NextFunction } from "express";

// Middleware global: mostra método, URL e horário de cada requisição.
export function logger(request: Request, _response: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.originalUrl}`);
  next();
}
