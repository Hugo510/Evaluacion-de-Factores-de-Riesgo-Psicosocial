// src/routes/authRoutes.ts
import { Router } from "express";
import { login, register, getMe } from "../controllers/authController";
import { validateBody } from "../middleware/validationMiddleware";
import { loginSchema, registerSchema } from "../schemas/authSchemas";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Usuario autenticado.
 *       401:
 *         description: Credenciales inválidas.
 */
router.post("/login", validateBody(loginSchema), login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Error en la validación o usuario ya existe.
 */
router.post("/register", validateBody(registerSchema), register);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtiene la información del usuario autenticado actual
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john@example.com"
 *                     role:
 *                       type: string
 *                       enum: ["ADMIN", "WORKER"]
 *                       example: "WORKER"
 *                     department:
 *                       type: string
 *                       example: "Recursos Humanos"
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/me", authMiddleware, getMe);

export default router;
