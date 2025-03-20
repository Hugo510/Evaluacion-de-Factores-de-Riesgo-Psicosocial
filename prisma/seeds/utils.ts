/**
 * Utilidades compartidas para los scripts de seeding
 * @module prisma/seeds/utils
 */
import { PrismaClient } from "@prisma/client";
import logger from "../../src/config/logger";

/**
 * Parsea los argumentos de línea de comandos
 *
 * @param {string[]} argv - Argumentos de la línea de comandos (process.argv)
 * @returns {Record<string, string>} Objeto con las opciones parseadas (--clave=valor)
 * @example
 * // Con la llamada: ts-node seed.ts --only=users,questionnaires
 * const args = parseArgs(process.argv);
 * // args = { only: 'users,questionnaires' }
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
 *
 * @param {PrismaClient} prisma - Instancia del cliente Prisma
 * @param {string} tableName - Nombre de la tabla a limpiar
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la limpieza
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
 * Ejecuta un seed con manejo de transacciones y limpieza previa
 *
 * @template T Tipo de retorno de la función de seeding
 * @param {PrismaClient} prisma - Instancia del cliente Prisma
 * @param {string} tableName - Nombre de la tabla principal para el seeding
 * @param {() => Promise<T>} seedFn - Función que realiza el seeding
 * @param {boolean} skipClean - Si es true, omite la limpieza previa de la tabla
 * @returns {Promise<T>} Resultado de la función de seeding
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
