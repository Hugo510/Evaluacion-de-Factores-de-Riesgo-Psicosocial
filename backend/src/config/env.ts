// src/config/env.ts
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Definir el esquema de validación de las variables de entorno
const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 3000)),
  DATABASE_URL: z.string().min(1, "DATABASE_URL es obligatorio"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET es obligatorio"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),
  // Puedes agregar más variables de entorno aquí según tus necesidades
});

// Validar las variables de entorno
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Variables de entorno inválidas:", _env.error.format());
  process.exit(1);
}

// Exportar las variables validadas
export const env = _env.data;
