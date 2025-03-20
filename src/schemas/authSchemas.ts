// src/schemas/authSchemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Debe ser un correo válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  email: z.string().email({ message: "Debe ser un correo válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  role: z.enum(["ADMIN", "WORKER"]).optional().default("WORKER"),
  department: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
