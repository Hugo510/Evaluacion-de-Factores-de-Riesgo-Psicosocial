// src/routes/reportRoutes.ts
import { Router } from "express";
import {
  getUserReport,
  getDepartmentReport,
} from "../controllers/reportController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /reports/user/{userId}:
 *   get:
 *     summary: Obtiene el reporte del usuario en formato PDF.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del usuario.
 *     responses:
 *       200:
 *         description: Reporte generado en PDF.
 *       404:
 *         description: Reporte no encontrado.
 */
router.get("/user/:userId", authMiddleware, getUserReport);

/**
 * @swagger
 * /reports/department:
 *   get:
 *     summary: Obtiene reportes agregados por departamento.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte por departamento.
 */
router.get("/department", authMiddleware, getDepartmentReport);

export default router;
