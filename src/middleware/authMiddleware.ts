// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import logger from "../config/logger";

// Extender el tipo Request para incluir el usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verificar el token
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = decoded as {
        id: number;
        email: string;
        role: string;
      };
      next();
    } catch (error) {
      logger.warn("Invalid token", { error });
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  } catch (error) {
    logger.error("Error in auth middleware", { error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
