// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import logger from "../config/logger";

export const validateBody = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Validación fallida", {
          path: req.path,
          errors: error.errors,
        });

        res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      } else {
        logger.error("Error inesperado en validación", { error });
        res.status(500).json({
          success: false,
          message: "Error interno del servidor durante la validación",
        });
      }
      // No retornar res.status().json() aquí, solo procesarlo
    }
  };
};
