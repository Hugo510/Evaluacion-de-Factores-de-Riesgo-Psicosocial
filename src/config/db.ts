// src/config/db.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { env } from "./env";

// Configurar los niveles de log según el entorno
const getPrismaLogLevels = (): Prisma.LogLevel[] => {
  switch (env.NODE_ENV) {
    case "development":
      return ["query", "info", "warn", "error"] as Prisma.LogLevel[];
    case "test":
      return ["warn", "error"] as Prisma.LogLevel[];
    case "production":
      return ["error"] as Prisma.LogLevel[];
    default:
      return ["error"] as Prisma.LogLevel[];
  }
};

const prisma = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
  log: getPrismaLogLevels(),
});

export default prisma;
