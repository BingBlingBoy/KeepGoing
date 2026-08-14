import { NextFunction, type Request, type Response } from "express";
import winstonLogger from "./winstonLogger";

export function logger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime

    const { method, originalUrl } = req
    const { statusCode } = res

    winstonLogger.http(`[${method} ${originalUrl} ${statusCode} - ${duration}ms]`)
  })

  next();
}
