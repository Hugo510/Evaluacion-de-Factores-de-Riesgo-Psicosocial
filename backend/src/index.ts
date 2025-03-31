/**
 * Punto de entrada principal de la aplicación
 * @module index
 */
import app from "./app";
import { env } from "./config/env";
import logger from "./config/logger";
import prisma from "./config/db";

/**
 * Función principal para iniciar el servidor
 */
async function startServer() {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    logger.info("📦 Conexión a la base de datos establecida");

    // Iniciar el servidor Express
    const server = app.listen(env.PORT, () => {
      logger.info(
        `🚀 Servidor corriendo en el puerto ${env.PORT} (${env.NODE_ENV})`
      );
      logger.info(
        `📚 Documentación disponible en http://localhost:${env.PORT}/api-docs`
      );
      logger.info(
        `🔍 Endpoint de salud en http://localhost:${env.PORT}/health`
      );
    });

    // Manejar señales de cierre
    const gracefulShutdown = async (signal: string) => {
      logger.info(`👋 ${signal} recibido. Cerrando servidor...`);

      server.close(async () => {
        logger.info("🔌 Cerrando conexiones de la base de datos...");
        await prisma.$disconnect();
        logger.info("🛑 Servidor cerrado correctamente");
        process.exit(0);
      });

      // Si después de 10 segundos no se han cerrado las conexiones, forzar cierre
      setTimeout(() => {
        logger.error("⏱️ Tiempo de cierre excedido, forzando salida");
        process.exit(1);
      }, 10000);
    };

    // Registrar manejadores para señales de cierre
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();
