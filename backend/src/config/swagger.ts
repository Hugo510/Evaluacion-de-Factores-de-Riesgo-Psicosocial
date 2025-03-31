/**
 * Configuración de Swagger/OpenAPI para documentación de la API
 * @module config/swagger
 */
import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

/**
 * Opciones de configuración para Swagger
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Riesgo Psicosocial API",
      version: "1.0.0",
      description:
        "API para la identificación y análisis de los factores de riesgo psicosocial según la NOM-035-STPS-2018",
      contact: {
        name: "Equipo de Desarrollo",
        email: "contact@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Servidor de desarrollo",
      },
      {
        url: `https://api-riesgo-psicosocial.example.com`,
        description: "Servidor de producción",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Operaciones de autenticación",
      },
      {
        name: "Questionnaires",
        description: "Gestión de cuestionarios",
      },
      {
        name: "Responses",
        description: "Gestión de respuestas a cuestionarios",
      },
      {
        name: "Reports",
        description: "Generación de reportes y análisis",
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
              description: "Correo electrónico del usuario",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "contraseña123",
              description: "Contraseña del usuario (mínimo 6 caracteres)",
            },
          },
          required: ["email", "password"],
        },
        // Esquema para Registro de Usuario
        RegisterInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Juan Pérez",
              description: "Nombre completo del usuario",
            },
            email: {
              type: "string",
              format: "email",
              example: "juanperez@dominio.com",
              description: "Correo electrónico único del usuario",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "contraseña123",
              description: "Contraseña del usuario (mínimo 6 caracteres)",
            },
            role: {
              type: "string",
              enum: ["ADMIN", "WORKER"],
              default: "WORKER",
              example: "WORKER",
              description:
                "Rol del usuario: ADMIN (administrador) o WORKER (trabajador)",
            },
            department: {
              type: "string",
              example: "Recursos Humanos",
              description: "Departamento al que pertenece el usuario",
            },
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
              description: "Texto de la pregunta",
            },
            category: {
              type: "string",
              example: "Cargas de Trabajo",
              description:
                "Categoría o dominio al que pertenece la pregunta según la NOM-035",
            },
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
              description: "Título del cuestionario",
            },
            description: {
              type: "string",
              example: "Cuestionario para evaluar factores psicosociales",
              description:
                "Descripción detallada del propósito del cuestionario",
            },
            questions: {
              type: "array",
              items: { $ref: "#/components/schemas/QuestionInput" },
              description: "Lista de preguntas que componen el cuestionario",
            },
          },
          required: ["title", "questions"],
        },
        // Esquema para una respuesta individual a una pregunta
        AnswerInput: {
          type: "object",
          properties: {
            questionId: {
              type: "number",
              example: 1,
              description: "ID de la pregunta que se está respondiendo",
            },
            value: {
              type: "number",
              minimum: 0,
              maximum: 4,
              example: 3,
              description:
                "Valor de la respuesta (0-4, donde 0 es 'Nunca' y 4 es 'Siempre')",
            },
          },
          required: ["questionId", "value"],
        },
        // Esquema para el envío de respuestas de un cuestionario
        SubmitResponseInput: {
          type: "object",
          properties: {
            questionnaireId: {
              type: "number",
              example: 1,
              description: "ID del cuestionario que se está respondiendo",
            },
            answers: {
              type: "array",
              items: { $ref: "#/components/schemas/AnswerInput" },
              description:
                "Lista de respuestas a las preguntas del cuestionario",
            },
          },
          required: ["questionnaireId", "answers"],
        },
        // Esquema para respuesta de error
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
              description: "Indica si la operación fue exitosa",
            },
            message: {
              type: "string",
              example: "Error de validación",
              description: "Mensaje descriptivo del error",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    example: "email",
                    description: "Campo que causó el error",
                  },
                  message: {
                    type: "string",
                    example: "Formato de email inválido",
                    description: "Descripción del error",
                  },
                },
              },
              description: "Lista de errores específicos (opcional)",
            },
          },
          required: ["success", "message"],
        },
        // Esquema para respuesta de salud
        HealthCheck: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "ok",
              enum: ["ok", "error"],
              description: "Estado general del servicio",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2023-10-25T15:30:45.123Z",
              description: "Momento de la verificación",
            },
            uptime: {
              type: "number",
              example: 3600,
              description:
                "Tiempo en segundos que el servicio ha estado activo",
            },
            environment: {
              type: "string",
              example: "production",
              description: "Entorno de ejecución actual",
            },
            database: {
              type: "string",
              example: "connected",
              enum: ["connected", "disconnected"],
              description: "Estado de la conexión a la base de datos",
            },
            version: {
              type: "string",
              example: "1.0.0",
              description: "Versión del servicio",
            },
          },
          required: [
            "status",
            "timestamp",
            "uptime",
            "environment",
            "database",
          ],
        },
        // Esquema de respuesta del usuario actual
        CurrentUser: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
              description: "Indica si la solicitud fue exitosa",
            },
            user: {
              type: "object",
              properties: {
                id: {
                  type: "number",
                  example: 1,
                  description: "ID único del usuario",
                },
                name: {
                  type: "string",
                  example: "Juan Pérez",
                  description: "Nombre completo del usuario",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "juan@example.com",
                  description: "Correo electrónico del usuario",
                },
                role: {
                  type: "string",
                  enum: ["ADMIN", "WORKER"],
                  example: "WORKER",
                  description: "Rol del usuario en el sistema",
                },
                department: {
                  type: "string",
                  example: "Recursos Humanos",
                  description: "Departamento al que pertenece el usuario",
                },
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Introduce el token JWT con el prefijo Bearer en el campo a continuación",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Token de acceso no proporcionado o inválido",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "No token provided",
              },
            },
          },
        },
        ValidationError: {
          description: "Error en la validación de datos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Error de validación",
                errors: [
                  {
                    field: "email",
                    message: "Formato de email inválido",
                  },
                ],
              },
            },
          },
        },
        ServerError: {
          description: "Error interno del servidor",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Error interno del servidor",
              },
            },
          },
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

/**
 * Especificación Swagger generada
 */
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
