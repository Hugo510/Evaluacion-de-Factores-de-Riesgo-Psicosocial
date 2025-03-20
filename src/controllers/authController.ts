// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { LoginInput, RegisterInput } from "../schemas/authSchemas";
import { UserService } from "../services/userService";

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
