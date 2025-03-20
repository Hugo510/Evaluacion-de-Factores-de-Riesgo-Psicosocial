// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Se parsea y se reemplaza el req.body con el objeto validado
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.errors, // Zod genera un array de errores de validación
      });
    }
  };
};
