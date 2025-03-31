// src/routes/responseRoutes.ts
import { Router } from "express";
import { submitResponse } from "../controllers/responseController";
import { validateBody } from "../middleware/validationMiddleware";
import { submitResponseSchema } from "../schemas/responseSchemas";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /responses:
 *   post:
 *     summary: Envía las respuestas de un cuestionario y calcula el riesgo.
 *     tags: [Responses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitResponseInput'
 *     responses:
 *       201:
 *         description: Respuesta enviada y riesgo calculado.
 *       400:
 *         description: Error en la validación.
 *       401:
 *         description: Usuario no autenticado.
 */
router.post(
  "/",
  authMiddleware,
  validateBody(submitResponseSchema),
  submitResponse
);

export default router;
