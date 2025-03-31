/**
 * Datos de usuarios para seeding
 * @module prisma/seeds/data/users
 */
import { Role } from "@prisma/client";

/**
 * Interfaz para los datos de usuario usados en el seeding
 */
export interface UserSeedData {
  /** Nombre completo del usuario */
  name: string;
  /** Correo electrónico (único) */
  email: string;
  /** Contraseña (sin hash, se aplicará en el script) */
  password: string;
  /** Rol del usuario (ADMIN o WORKER) */
  role: Role;
  /** Departamento al que pertenece */
  department: string;
}

/**
 * Datos de usuarios para seeding
 */
export const users: UserSeedData[] = [
  {
    name: "Administrador",
    email: "admin@example.com",
    password: "admin123",
    role: Role.ADMIN,
    department: "Dirección",
  },
  {
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "password123",
    role: Role.WORKER,
    department: "Recursos Humanos",
  },
  {
    name: "María Gómez",
    email: "maria@example.com",
    password: "password123",
    role: Role.WORKER,
    department: "Operaciones",
  },
  {
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    password: "password123",
    role: Role.WORKER,
    department: "Ventas",
  },
  {
    name: "Ana López",
    email: "ana@example.com",
    password: "password123",
    role: Role.WORKER,
    department: "Finanzas",
  },
];
