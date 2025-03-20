// src/controllers/responseController.ts
import { Request, Response, NextFunction } from "express";
import { ResponseService } from "../services/responseService";
import { SubmitResponseInput } from "../schemas/responseSchemas";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const submitResponse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input: SubmitResponseInput = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const result = await ResponseService.submitResponse(userId, input);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
