// src/config/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Riesgo Psicosocial API",
      version: "1.0.0",
      description:
        "API para la identificación y análisis de los factores de riesgo psicosocial según la NOM-035",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Archivos que contienen las anotaciones de la API
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
