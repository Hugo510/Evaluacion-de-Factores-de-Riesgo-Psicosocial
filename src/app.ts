// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import { env } from "./config/env";
import logger from "./config/logger";
import swaggerSpec from "./config/swagger";
import prisma from "./config/db";

// Importación de rutas
import authRoutes from "./routes/authRoutes";
import questionnaireRoutes from "./routes/questionnaireRoutes";
import responseRoutes from "./routes/responseRoutes";
import reportRoutes from "./routes/reportRoutes";

// Importar middleware de manejo de errores
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();

// Configuración de rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por ventana por IP
  standardHeaders: true, // Devuelve info de rate limit en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*`
  message: "Demasiadas solicitudes, por favor intente de nuevo más tarde",
  skip: () => env.NODE_ENV === "development", // Sin límite en desarrollo
});

// Middleware básicos
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Morgan para logging HTTP
// Formato personalizado que incluye method, url, status, response time
const morganFormat = env.NODE_ENV === "production" ? "combined" : "dev";

// Morgan logger para HTTP requests
app.use(
  morgan(morganFormat, {
    stream: {
      // Usar nuestro logger de Winston para los logs de Morgan
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// Middleware de rate limit
app.use(limiter);

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Implementación de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint para obtener la especificación de Swagger en formato JSON
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Endpoint de health check
app.get("/health", async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`;

    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      database: "connected",
      version: process.env.npm_package_version || "1.0.0",
    };

    res.status(200).json(healthData);
  } catch (error) {
    logger.error("Health check failed", { error });

    const healthData = {
      status: "error",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      database: "disconnected",
      version: process.env.npm_package_version || "1.0.0",
    };

    res.status(503).json(healthData);
  }
});

// Rutas de la API
app.use("/auth", authRoutes);
app.use("/questionnaires", questionnaireRoutes);
app.use("/responses", responseRoutes);
app.use("/reports", reportRoutes);

// Manejo de errores
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const status = err.statusCode || 500;
    const message = err.message || "Error interno del servidor";

    logger.error(`Error: ${message}`, { stack: err.stack });

    res.status(status).json({
      success: false,
      message,
      ...(env.NODE_ENV !== "production" && { stack: err.stack }),
    });
  }
);

// Ruta para el manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
});

export default app;
