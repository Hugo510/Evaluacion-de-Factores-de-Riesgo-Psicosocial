// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { LoginInput, RegisterInput } from "../schemas/authSchemas";
import { UserService } from "../services/userService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { TokenService } from "../services/tokenService";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input: LoginInput = req.body;

    // Buscar al usuario por email
    const user = await UserService.getUserByEmail(input.email);
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Comparar la contraseña
    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input: RegisterInput = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await UserService.getUserByEmail(input.email);
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    // Crear el nuevo usuario
    const newUser = await UserService.createUser(
      input.name,
      input.email,
      input.password,
      input.role,
      input.department
    );

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene la información del usuario autenticado actual basado en su token JWT
 *
 * @param {AuthenticatedRequest} req - Solicitud HTTP con datos del usuario autenticado
 * @param {Response} res - Respuesta HTTP
 * @param {NextFunction} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>}
 */
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "Usuario no autenticado" });
      return;
    }

    const user = await UserService.getUserById(userId);

    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
      return;
    }

    // Devolver información del usuario sin incluir campos sensibles
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cierra la sesión del usuario invalidando el token actual
 */
export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener el token de autorización
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      // Añadir token a la lista negra
      TokenService.blacklistToken(token);

      // Responder con éxito
      res.status(200).json({
        success: true,
        message: "Sesión cerrada exitosamente",
      });
    } else {
      // Si no hay token, simplemente responder con éxito
      res.status(200).json({
        success: true,
        message: "No había sesión activa",
      });
    }
  } catch (error) {
    next(error);
  }
};
