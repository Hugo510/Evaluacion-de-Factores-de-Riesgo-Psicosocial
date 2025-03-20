// src/routes/authRoutes.ts
import { Router } from "express";
import { login, register } from "../controllers/authController";
import { validateBody } from "../middleware/validationMiddleware";
import { loginSchema, registerSchema } from "../schemas/authSchemas";

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

export default router;
