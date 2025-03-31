// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Registro del error con detalles
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  // Se puede ajustar el status y el mensaje según el entorno o tipo de error
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
