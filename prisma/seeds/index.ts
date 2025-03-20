/**
 * Punto de entrada principal para el seeding de la base de datos
 *
 * Este script puede ejecutarse con:
 * npm run seed
 *
 * O con argumentos para ejecutar solo ciertos seeds:
 * npm run seed -- --only users,questionnaires
 */
import { PrismaClient } from "@prisma/client";
import { parseArgs } from "./utils";
import logger from "../../src/config/logger";
// Importar scripts de seeding
import seedUsers from "./scripts/users";
import seedQuestionnaires from "./scripts/questionnaires";
import seedResponses from "./scripts/responses";

const prisma = new PrismaClient();

async function main() {
  logger.info("🌱 Iniciando proceso de seeding...");

  // Parsear argumentos de línea de comandos
  const args = parseArgs(process.argv);
  const onlySpecificSeeds = args.only ? args.only.split(",") : null;

  try {
    // Definir los seeds en orden de dependencia
    const seeds = [
      { name: "users", fn: seedUsers },
      { name: "questionnaires", fn: seedQuestionnaires },
      { name: "responses", fn: seedResponses },
    ];

    // Ejecutar seeds según lo especificado
    for (const seed of seeds) {
      if (!onlySpecificSeeds || onlySpecificSeeds.includes(seed.name)) {
        logger.info(`🔄 Ejecutando seed: ${seed.name}`);
        await seed.fn(prisma);
        logger.info(`✅ Seed completado: ${seed.name}`);
      }
    }

    logger.info("✅ Proceso de seeding completado exitosamente");
  } catch (error) {
    logger.error("❌ Error durante el proceso de seeding", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
