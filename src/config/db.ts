// src/config/db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Opcional: para depuración y logging
});

export default prisma;
