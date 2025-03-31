// src/config/logger.ts
import winston from "winston";
import fs from "fs";
import path from "path";
import { env } from "./env";

// Asegurarse de que el directorio para logs exista
const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [
    // Transporte para consola
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Transporte para errores críticos
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    // Transporte para logs combinados
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// En entornos de desarrollo, se pueden agregar más detalles
if (env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;
