// src/routes/questionnaireRoutes.ts
import { Router } from "express";
import {
  getQuestionnaires,
  getQuestionnaireById,
  createQuestionnaire,
} from "../controllers/questionnaireController";
import { validateBody } from "../middleware/validationMiddleware";
import { createQuestionnaireSchema } from "../schemas/questionnaireSchemas";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /questionnaires:
 *   get:
 *     summary: Obtiene todos los cuestionarios.
 *     tags: [Questionnaires]
 *     responses:
 *       200:
 *         description: Lista de cuestionarios.
 */
router.get("/", getQuestionnaires);

/**
 * @swagger
 * /questionnaires/{id}:
 *   get:
 *     summary: Obtiene el detalle de un cuestionario.
 *     tags: [Questionnaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID del cuestionario.
 *     responses:
 *       200:
 *         description: Detalle del cuestionario.
 *       404:
 *         description: Cuestionario no encontrado.
 */
router.get("/:id", getQuestionnaireById);

/**
 * @swagger
 * /questionnaires:
 *   post:
 *     summary: Crea un nuevo cuestionario.
 *     tags: [Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuestionnaireInput'
 *     responses:
 *       201:
 *         description: Cuestionario creado exitosamente.
 *       400:
 *         description: Error en la validación.
 */
router.post(
  "/",
  authMiddleware,
  validateBody(createQuestionnaireSchema),
  createQuestionnaire
);

export default router;
