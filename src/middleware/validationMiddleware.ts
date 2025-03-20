/**
 * Middleware para validación de datos con Zod
 * @module middleware/validation
 */
import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import logger from "../config/logger";

/**
 * Middleware para validar el cuerpo de una solicitud mediante un esquema Zod
 *
 * @param {ZodType<any>} schema - Esquema Zod para validar
 * @returns {Function} Middleware de Express que realiza la validación
 * @example
 * // En un router:
 * router.post('/users', validateBody(userSchema), createUser);
 */
export const validateBody = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Parsear y validar el cuerpo de la solicitud
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Error de validación Zod (datos inválidos)
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
        // Error inesperado durante la validación
        logger.error("Error inesperado en validación", { error });
        res.status(500).json({
          success: false,
          message: "Error interno del servidor durante la validación",
        });
      }
    }
  };
};

/**
 * Middleware para validar parámetros de ruta mediante un esquema Zod
 *
 * @param {ZodType<any>} schema - Esquema Zod para validar
 * @returns {Function} Middleware de Express que realiza la validación
 * @example
 * // En un router:
 * router.get('/users/:id', validateParams(userIdSchema), getUserById);
 */
export const validateParams = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Validación de parámetros fallida", {
          path: req.path,
          params: req.params,
          errors: error.errors,
        });

        res.status(400).json({
          success: false,
          message: "Parámetros de ruta inválidos",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      } else {
        logger.error("Error inesperado en validación de parámetros", { error });
        res.status(500).json({
          success: false,
          message: "Error interno del servidor durante la validación",
        });
      }
    }
  };
};
