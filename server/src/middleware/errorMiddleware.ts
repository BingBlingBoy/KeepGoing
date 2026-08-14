import { NextFunction, type Request, type Response } from "express";
import winstonLogger from "../logger/winstonLogger";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  winstonLogger.error(err.message || 'An unexpected error occurred', err);

  const statusCode = err.status || 500;

  switch (statusCode) {
    case 400:
      return res.status(400).json({
        error: err.message || "Bad Request - Invalid data provided"
      });

    case 401:
      return res.status(401).json({
        error: "Unauthorized - Authentication required"
      });

    case 403:
      return res.status(403).json({
        error: "Forbidden - You do not have permission to access this"
      });

    case 404:
      return res.status(404).json({
        error: "Resource not found"
      });

    case 409:
      return res.status(409).json({
        error: err.message || "Conflict - Resource already exists"
      });

    case 500:
    default:
      return res.status(500).json({
        error: "Internal Server Error"
      });
  }
}

export default errorHandler
