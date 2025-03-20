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
    components: {
      schemas: {
        // Esquema para Login
        LoginInput: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "usuario@dominio.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "contraseña123",
            },
          },
          required: ["email", "password"],
        },
        // Esquema para Registro de Usuario
        RegisterInput: {
          type: "object",
          properties: {
            name: { type: "string", example: "Juan Pérez" },
            email: {
              type: "string",
              format: "email",
              example: "juanperez@dominio.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "contraseña123",
            },
            role: {
              type: "string",
              enum: ["ADMIN", "WORKER"],
              default: "WORKER",
              example: "WORKER",
            },
            department: { type: "string", example: "Recursos Humanos" },
          },
          required: ["name", "email", "password"],
        },
        // Esquema para la creación de una Pregunta (usada en cuestionarios)
        QuestionInput: {
          type: "object",
          properties: {
            text: {
              type: "string",
              example: "¿Cómo evalúas tu carga laboral?",
            },
            category: { type: "string", example: "Cargas de Trabajo" },
          },
          required: ["text", "category"],
        },
        // Esquema para la creación de un Cuestionario
        CreateQuestionnaireInput: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "Evaluación de Riesgo Psicosocial",
            },
            description: {
              type: "string",
              example: "Cuestionario para evaluar factores psicosociales",
            },
            questions: {
              type: "array",
              items: { $ref: "#/components/schemas/QuestionInput" },
            },
          },
          required: ["title", "questions"],
        },
        // Esquema para una respuesta individual a una pregunta
        AnswerInput: {
          type: "object",
          properties: {
            questionId: { type: "number", example: 1 },
            value: {
              type: "number",
              minimum: 0,
              maximum: 5,
              example: 3,
            },
          },
          required: ["questionId", "value"],
        },
        // Esquema para el envío de respuestas de un cuestionario
        SubmitResponseInput: {
          type: "object",
          properties: {
            questionnaireId: { type: "number", example: 1 },
            answers: {
              type: "array",
              items: { $ref: "#/components/schemas/AnswerInput" },
            },
          },
          required: ["questionnaireId", "answers"],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Archivos donde se documentarán los endpoints
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
