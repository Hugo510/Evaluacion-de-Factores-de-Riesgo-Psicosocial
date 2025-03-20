/**
 * Utilidades compartidas para los scripts de seeding
 */
import { PrismaClient } from "@prisma/client";
import logger from "../../src/config/logger";

/**
 * Parsea los argumentos de línea de comandos
 */
export function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg.startsWith("--")) {
      const [key, value] = arg.substring(2).split("=");
      args[key] = value || argv[++i] || "";
    }
  }

  return args;
}

/**
 * Limpia los datos de una tabla específica
 */
export async function cleanTable(
  prisma: PrismaClient,
  tableName: string
): Promise<void> {
  try {
    // @ts-ignore - Acceso dinámico a las propiedades de Prisma
    const result = await prisma[tableName].deleteMany({});
    logger.info(
      `🧹 Tabla ${tableName} limpiada: ${result.count} registros eliminados`
    );
  } catch (error) {
    logger.error(`❌ Error al limpiar tabla ${tableName}`, error);
    throw error;
  }
}

/**
 * Ejecuta un seed con manejo de transacciones y limpieza
 */
export async function executeSeedWithTransaction<T>(
  prisma: PrismaClient,
  tableName: string,
  seedFn: () => Promise<T>,
  skipClean = false
): Promise<T> {
  if (!skipClean) {
    await cleanTable(prisma, tableName);
  }

  return prisma.$transaction(async (tx) => {
    return seedFn();
  });
}
