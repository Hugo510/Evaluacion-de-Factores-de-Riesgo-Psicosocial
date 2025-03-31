/**
 * Script para sembrar usuarios en la base de datos
 */
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { users } from "../data/users";
import { executeSeedWithTransaction } from "../utils";
import logger from "../../../src/config/logger";

export default async function seedUsers(prisma: PrismaClient): Promise<User[]> {
  return executeSeedWithTransaction(prisma, "user", async () => {
    logger.info(`Creando ${users.length} usuarios...`);

    const createdUsers: User[] = [];

    for (const userData of users) {
      // Generar hash de la contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          department: userData.department,
        },
      });

      createdUsers.push(user);
      logger.info(`Usuario creado: ${user.name} (${user.email})`);
    }

    return createdUsers;
  });
}
