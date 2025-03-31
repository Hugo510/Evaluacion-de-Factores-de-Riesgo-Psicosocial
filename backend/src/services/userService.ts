// src/services/userService.ts

import prisma from "../config/db";
import { User, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UserService {
  /**
   * Crea un nuevo usuario con la contraseña hasheada.
   * @param name Nombre del usuario.
   * @param email Correo electrónico.
   * @param password Contraseña en texto plano.
   * @param role Rol del usuario (ADMIN o WORKER).
   * @param department (Opcional) Departamento del usuario.
   */
  static async createUser(
    name: string,
    email: string,
    password: string,
    role: Role,
    department?: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        department,
      },
    });

    return user;
  }

  /**
   * Obtiene un usuario basado en su correo electrónico.
   * @param email Correo electrónico del usuario.
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id ID del usuario.
   * @returns Usuario encontrado o null si no existe.
   * @example
   * // Obtener un usuario por su ID
   * const user = await UserService.getUserById(1);
   * if (user) {
   *   console.log(`Usuario encontrado: ${user.name}`);
   * }
   */
  static async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  // Se pueden agregar más métodos: actualizar, eliminar, etc.
}
